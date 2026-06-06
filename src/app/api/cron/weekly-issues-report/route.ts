import { NextResponse, type NextRequest } from "next/server";
import { getWeeklyIssuesReport } from "@/lib/weekly-issues-report";
import { buildWeeklyIssuesEmail } from "@/lib/email/weekly-issues-report";
import { sendEmailWithAttachment } from "@/lib/email/resend";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { logSystemEvent } from "@/lib/system-log";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("CRON_SECRET is not configured");
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

async function hasSuccessfulRun(weekStart: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("weekly_email_report_runs")
    .select("id, sent_at")
    .eq("report_week_start", weekStart)
    .eq("status", "sent")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

async function recordRun({ weekStart, recipientCount, status, errorMessage }: { weekStart: string; recipientCount: number; status: string; errorMessage?: string }) {
  const supabase = createAdminClient();
  await supabase.from("weekly_email_report_runs").upsert({
    report_week_start: weekStart,
    sent_at: new Date().toISOString(),
    recipient_count: recipientCount,
    status,
    error_message: errorMessage ?? null,
  }, { onConflict: "report_week_start" });
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const force = request.nextUrl.searchParams.get("force") === "true";
    const testEmail = request.nextUrl.searchParams.get("test");

    if (!force) {
      const report = await getWeeklyIssuesReport();
      const existing = await hasSuccessfulRun(report.reportWeekStart);
      if (existing) {
        return NextResponse.json({ status: "already_sent", weekStart: report.reportWeekStart, sentAt: existing.sent_at });
      }
    }

    const report = await getWeeklyIssuesReport();

    if (testEmail) {
      report.recipients = [{ id: "test", username: "Test", email: testEmail }];
    }

    if (report.recipients.length === 0) {
      await recordRun({ weekStart: report.reportWeekStart, recipientCount: 0, status: force ? "sent" : "skipped" });
      return NextResponse.json({ status: "skipped", reason: "no_recipients", weekStart: report.reportWeekStart });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const email = buildWeeklyIssuesEmail(report, appUrl);
    const sendResult = await sendEmailWithAttachment({
      to: report.recipients.map((r) => r.email),
      subject: email.subject,
      html: email.html,
      text: email.text,
      attachments: [],
    });

    if (sendResult.error) {
      throw new Error(sendResult.error.message);
    }

    await recordRun({
      weekStart: report.reportWeekStart,
      recipientCount: report.recipients.length,
      status: "sent",
    });

    await logSystemEvent({
      actorType: "system",
      actorName: "Weekly issues cron",
      area: "reporting",
      action: "weekly_issues.sent",
      targetType: "weekly_report",
      targetId: report.reportWeekStart,
      targetName: report.reportWeekStart,
      result: "success",
      afterData: {
        recipient_count: report.recipients.length,
        issue_count: report.issueCounts.total,
        open_count: report.issueCounts.open,
        in_progress_count: report.issueCounts.in_progress,
      },
      metadata: { forced: force },
    });

    return NextResponse.json({
      status: "sent",
      weekStart: report.reportWeekStart,
      recipientCount: report.recipients.length,
      issueCount: report.issueCounts.total,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Weekly issues report failed";
    console.error("Weekly issues report failed:", error);
    await logSystemEvent({
      actorType: "system",
      actorName: "Weekly issues cron",
      area: "reporting",
      action: "weekly_issues.failed",
      targetType: "weekly_report",
      result: "failure",
      message,
    }).catch(() => {});
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
