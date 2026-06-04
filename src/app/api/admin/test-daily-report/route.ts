import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminSessionPrincipal } from "@/lib/auth/admin-session";
import { getDailyEmailReport } from "@/lib/daily-report";
import { buildDailyReportEmail } from "@/lib/email/daily-report";
import { sendEmailWithAttachment } from "@/lib/email/resend";
import { generateDailyChecksheetsPdf } from "@/lib/pdf/daily-checksheets";

export async function POST(request: NextRequest) {
  const session = await getAdminSessionPrincipal(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let email: string;
  try {
    const body = await request.json();
    email = body.email;
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const report = await getDailyEmailReport();
    const emailContent = buildDailyReportEmail(report);

    let attachment;
    try {
      attachment = await generateDailyChecksheetsPdf(report.reportDate);
    } catch {
      // PDF is optional for test
    }

    const result = await sendEmailWithAttachment({
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      attachments: attachment ? [attachment] : [],
    });

    return NextResponse.json({ status: "sent", reportDate: report.reportDate });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send test email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
