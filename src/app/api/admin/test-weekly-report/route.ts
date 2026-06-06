import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminSessionPrincipal } from "@/lib/auth/admin-session";
import { getWeeklyIssuesReport } from "@/lib/weekly-issues-report";
import { buildWeeklyIssuesEmail } from "@/lib/email/weekly-issues-report";
import { sendEmailWithAttachment } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSessionPrincipal(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const report = await getWeeklyIssuesReport();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const emailContent = buildWeeklyIssuesEmail(report, appUrl);

    const result = await sendEmailWithAttachment({
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      attachments: [],
    });

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 502 });
    }

    return NextResponse.json({ status: "sent", weekStart: report.reportWeekStart, issueCount: report.issueCounts.total });
  } catch (error) {
    console.error("Test weekly report failed:", error);
    return NextResponse.json({ error: "Failed to send test weekly report" }, { status: 500 });
  }
}
