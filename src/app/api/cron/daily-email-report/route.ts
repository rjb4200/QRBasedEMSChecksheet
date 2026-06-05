import { NextResponse, type NextRequest } from "next/server";
import { getDailyEmailReport } from "@/lib/daily-report";
import { buildDailyReportEmail } from "@/lib/email/daily-report";
import { sendEmailWithAttachment } from "@/lib/email/resend";
import { generateDailyChecksheetsPdf } from "@/lib/pdf/daily-checksheets";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { logSystemEvent } from "@/lib/system-log";
import { sendPushoverNotification } from "@/lib/pushover";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("CRON_SECRET is not configured");
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function dailyReportSendHour() {
  const configured = Number(process.env.DAILY_REPORT_SEND_HOUR ?? 10);
  if (!Number.isInteger(configured) || configured < 0 || configured > 23) {
    throw new Error("DAILY_REPORT_SEND_HOUR must be an hour from 0 to 23");
  }
  return configured;
}

function currentLocalHour() {
  const timeZone = process.env.DAILY_REPORT_TIMEZONE || "America/New_York";
  const hour = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: false,
    hourCycle: "h23",
    timeZone,
  }).format(new Date());
  return Number(hour);
}

function isScheduledGetOutsideSendHour(request: NextRequest) {
  if (request.method !== "GET") return false;
  if (request.nextUrl.searchParams.has("date") || request.nextUrl.searchParams.get("force") === "true") return false;
  return currentLocalHour() !== dailyReportSendHour();
}

async function sendPushoverDailySummary(report: { reportDate: string; allUnits: unknown[]; recipients: { id: string; username: string; email: string }[]; exceptionCounts: Record<string, number> }) {
  try {
    const supabase = createAdminClient();
    const { data: pushoverRecipients, error } = await supabase
      .from("admin_users")
      .select("username, pushover_user_key")
      .eq("pushover_alert_enabled", true)
      .eq("pushover_daily_report", true)
      .not("pushover_user_key", "is", null)
      .neq("pushover_user_key", "");

    if (error || !pushoverRecipients || pushoverRecipients.length === 0) {
      await logSystemEvent({
        actorType: "system",
        actorName: "Daily report cron",
        area: "pushover",
        action: "daily_report.skipped",
        targetType: "pushover_alert",
        result: "warning",
        message: pushoverRecipients?.length === 0 ? "No Pushover daily report recipients" : undefined,
      }).catch(() => {});
      return;
    }

    const completeCount = report.allUnits.length;
    const exceptionTotal = Object.values(report.exceptionCounts).reduce((sum, c) => sum + c, 0);
    const message = `EMS Daily Report — ${report.reportDate}\n${completeCount} units reported\n${exceptionTotal} exceptions submitted`;

    const recipientUsernames: string[] = [];
    let successCount = 0;

    for (const recipient of pushoverRecipients) {
      if (!recipient.pushover_user_key) continue;

      const result = await sendPushoverNotification({
        userKey: recipient.pushover_user_key,
        title: "EMS Daily Report",
        message,
      });

      recipientUsernames.push(recipient.username);
      if (result.success) {
        successCount++;
      } else {
        console.error(`Pushover daily report failed for ${recipient.username}:`, result.error);
      }
    }

    await logSystemEvent({
      actorType: "system",
      actorName: "Daily report cron",
      area: "pushover",
      action: "daily_report.sent",
      targetType: "pushover_alert",
      result: successCount > 0 ? "success" : "failure",
      afterData: {
        reportDate: report.reportDate,
        recipientCount: recipientUsernames.length,
        successCount,
        recipients: recipientUsernames,
      },
    });
  } catch (error) {
    console.error("Pushover daily report summary failed:", error);
    await logSystemEvent({
      actorType: "system",
      actorName: "Daily report cron",
      area: "pushover",
      action: "daily_report.failed",
      targetType: "pushover_alert",
      result: "failure",
      message: error instanceof Error ? error.message : "Unknown error",
    }).catch(() => {});
  }
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

    if (isScheduledGetOutsideSendHour(request)) {
      return NextResponse.json({ status: "skipped", reason: "outside_send_hour" });
    }

    const force = request.nextUrl.searchParams.get("force") === "true";
    const testEmail = request.nextUrl.searchParams.get("test");
    const report = await getDailyEmailReport(requestedReportDate);

    if (testEmail) {
      report.recipients = [{ id: "test", username: "Test", email: testEmail }];
    }

    if (force) {
      await logSystemEvent({
        actorType: "system",
        actorName: "Daily report cron",
        area: "reporting",
        action: "daily_report.force_requested",
        targetType: "daily_report",
        targetId: report.reportDate,
        targetName: report.reportDate,
        result: "warning",
      });
    }

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

    let attachment;
    try {
      attachment = await generateDailyChecksheetsPdf(report.reportDate);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate daily checksheets PDF";
      await logSystemEvent({
        actorType: "system",
        actorName: "Daily report cron",
        area: "reporting",
        action: "daily_report.pdf_failed",
        targetType: "daily_report",
        targetId: report.reportDate,
        targetName: report.reportDate,
        result: "failure",
        message,
      });
      throw error;
    }
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

    await logSystemEvent({
      actorType: "system",
      actorName: "Daily report cron",
      area: "reporting",
      action: "daily_report.sent",
      targetType: "daily_report",
      targetId: report.reportDate,
      targetName: report.reportDate,
      result: "success",
      afterData: {
        recipient_count: report.recipients.length,
        unchecked_unit_count: report.allUnits.length,
        exception_count: Object.values(report.exceptionCounts).reduce((sum, c) => sum + c, 0),
        resend_message_id: sendResult.data?.id ?? null,
      },
      metadata: { forced: force },
    });

    await sendPushoverDailySummary(report);

    return NextResponse.json({
      status: "sent",
      reportDate: report.reportDate,
      recipientCount: report.recipients.length,
      uncheckedUnitCount: report.allUnits.length,
      exceptionCount: Object.values(report.exceptionCounts).reduce((sum, c) => sum + c, 0),
      resendMessageId: sendResult.data?.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send daily report";
    if (requestedReportDate) {
      await recordRun({ reportDate: requestedReportDate, recipientCount: 0, status: "failed", errorMessage: message });
    }
    await logSystemEvent({
      actorType: "system",
      actorName: "Daily report cron",
      area: "reporting",
      action: "daily_report.failed",
      targetType: "daily_report",
      targetId: requestedReportDate ?? null,
      targetName: requestedReportDate ?? null,
      result: "failure",
      message,
      metadata: { forced: request.nextUrl.searchParams.get("force") === "true" },
    });
    console.error("Daily email report failed:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
