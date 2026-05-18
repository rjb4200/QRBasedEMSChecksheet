import { NextResponse, type NextRequest } from "next/server";
import { getDailyEmailReport } from "@/lib/daily-report";
import { buildDailyReportEmail } from "@/lib/email/daily-report";
import { sendEmailWithAttachment } from "@/lib/email/resend";
import { generateDailyChecksheetsPdf } from "@/lib/pdf/daily-checksheets";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { logSystemEvent } from "@/lib/system-log";

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
    const report = await getDailyEmailReport(requestedReportDate);

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
        unchecked_unit_count: report.uncheckedUnits.length,
        exception_count: report.exceptions.length,
        resend_message_id: sendResult.data?.id ?? null,
      },
      metadata: { forced: force },
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
