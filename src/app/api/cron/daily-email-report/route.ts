import { NextResponse, type NextRequest } from "next/server";
import { getDailyEmailReport } from "@/lib/daily-report";
import { buildDailyReportEmail } from "@/lib/email/daily-report";
import { sendEmailWithAttachment } from "@/lib/email/resend";
import { generateDailyChecksheetsPdf } from "@/lib/pdf/daily-checksheets";
import { createAdminClient } from "@/lib/supabase/server-admin";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("CRON_SECRET is not configured");
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

async function recordRun({
  reportDate,
  recipientCount,
  status,
  errorMessage,
  resendMessageId,
}: {
  reportDate: string;
  recipientCount: number;
  status: string;
  errorMessage?: string;
  resendMessageId?: string;
}) {
  const supabase = createAdminClient();
  await supabase.from("daily_email_report_runs").upsert({
    report_date: reportDate,
    sent_at: new Date().toISOString(),
    recipient_count: recipientCount,
    status,
    error_message: errorMessage ?? null,
    resend_message_id: resendMessageId ?? null,
  }, { onConflict: "report_date" });
}

async function hasSuccessfulRun(reportDate: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("daily_email_report_runs")
    .select("id, sent_at")
    .eq("report_date", reportDate)
    .eq("status", "sent")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function POST(request: NextRequest) {
  const requestedReportDate = request.nextUrl.searchParams.get("date") ?? undefined;
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const force = request.nextUrl.searchParams.get("force") === "true";
    const report = await getDailyEmailReport(requestedReportDate);

    if (!force) {
      const existingRun = await hasSuccessfulRun(report.reportDate);
      if (existingRun) {
        return NextResponse.json({ status: "already_sent", reportDate: report.reportDate, sentAt: existingRun.sent_at });
      }
    }

    if (report.recipients.length === 0) {
      await recordRun({ reportDate: report.reportDate, recipientCount: 0, status: "skipped" });
      return NextResponse.json({ status: "skipped", reason: "no_recipients", reportDate: report.reportDate });
    }

    const attachment = await generateDailyChecksheetsPdf(report.reportDate);
    const email = buildDailyReportEmail(report);
    const sendResult = await sendEmailWithAttachment({
      to: report.recipients.map((recipient) => recipient.email),
      subject: email.subject,
      html: email.html,
      text: email.text,
      attachments: [attachment],
    });

    if (sendResult.error) {
      throw new Error(sendResult.error.message);
    }

    await recordRun({
      reportDate: report.reportDate,
      recipientCount: report.recipients.length,
      status: "sent",
      resendMessageId: sendResult.data?.id,
    });

    return NextResponse.json({
      status: "sent",
      reportDate: report.reportDate,
      recipientCount: report.recipients.length,
      uncheckedUnitCount: report.uncheckedUnits.length,
      exceptionCount: report.exceptions.length,
      resendMessageId: sendResult.data?.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send daily report";
    if (requestedReportDate) {
      await recordRun({ reportDate: requestedReportDate, recipientCount: 0, status: "failed", errorMessage: message });
    }
    console.error("Daily email report failed:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
