import { Resend } from "resend";

type EmailAttachment = {
  filename: string;
  content: Buffer;
};

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
  return new Resend(apiKey);
}

export function getResendFromEmail() {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error("RESEND_FROM_EMAIL is not configured");
  return from;
}

export async function sendEmailWithAttachment({
  to,
  subject,
  html,
  text,
  attachments,
}: {
  to: string[];
  subject: string;
  html: string;
  text: string;
  attachments: EmailAttachment[];
}) {
  const resend = getResendClient();
  return resend.emails.send({
    from: getResendFromEmail(),
    to,
    subject,
    html,
    text,
    replyTo: process.env.DAILY_REPORT_REPLY_TO || undefined,
    attachments: attachments.map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content,
    })),
  });
}
