import type { WeeklyIssuesReport, WeeklyIssueCard } from "@/lib/weekly-issues-report";

const STATUS_LABELS = { open: "Open", in_progress: "In Progress" } as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric" });
}

function issueCard(card: WeeklyIssueCard) {
  const notePreview = card.latestNote
    ? card.latestNote.text.length > 200
      ? card.latestNote.text.slice(0, 197) + "..."
      : card.latestNote.text
    : null;

  return `
<div style="border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin-bottom:12px; background:#f8fafc">
  <p style="margin:0 0 8px 0; font-weight:700; font-size:16px; color:#1e293b">${escapeHtml(card.title)}</p>
  <p style="margin:0 0 4px 0; font-size:13px; color:#64748b">
    ${card.unitName ? `<strong>${escapeHtml(card.unitName)}</strong> · ` : ""}
    <span style="display:inline-block; background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; border-radius:8px; padding:1px 8px; font-size:12px; font-weight:700">${STATUS_LABELS[card.status]}</span>
    ${card.tags.length > 0 ? ` · Tags: ${card.tags.map((t) => escapeHtml(t)).join(", ")}` : ""}
  </p>
  <p style="margin:0 0 4px 0; font-size:12px; color:#94a3b8">
    Created ${formatDate(card.createdAt)} by ${escapeHtml(card.createdBy)} · ${card.noteCount === 0 ? "No notes" : `${card.noteCount} note${card.noteCount === 1 ? "" : "s"}`}
  </p>
  ${notePreview ? `<p style="margin:8px 0 0 0; padding:8px; background:#f1f5f9; border-radius:8px; font-size:13px; color:#475569; font-style:italic">"${escapeHtml(notePreview)}" — ${escapeHtml(card.latestNote!.by)}</p>` : ""}
</div>`;
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function buildWeeklyIssuesEmail(report: WeeklyIssuesReport, appUrl: string) {
  const { issueCounts, issues, reportWeekStart } = report;
  const weekLabel = formatDate(reportWeekStart);

  const subject = `Weekly Issues Digest — Week of ${weekLabel}`;

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; max-width:640px; margin:0 auto; padding:24px">
  <h1 style="margin:0 0 4px 0; font-size:24px; color:#1e293b">Weekly Issues Digest</h1>
  <p style="margin:0 0 24px 0; font-size:14px; color:#64748b">Week of ${weekLabel}</p>

  <div style="background:#f1f5f9; border-radius:12px; padding:16px; margin-bottom:24px">
    <p style="margin:0; font-size:14px; color:#1e293b">
      <strong>Open:</strong> ${issueCounts.open} &nbsp;·&nbsp;
      <strong>In Progress:</strong> ${issueCounts.in_progress} &nbsp;·&nbsp;
      <strong>Total active:</strong> ${issueCounts.total}
    </p>
  </div>

  ${issueCounts.total === 0
    ? '<p style="font-size:14px; color:#64748b">No active issues this week.</p>'
    : `<div>${issues.map(issueCard).join("")}</div>`
  }

  <div style="margin-top:24px; padding-top:16px; border-top:1px solid #e2e8f0">
    <p style="margin:0; font-size:13px; color:#64748b">
      <a href="${appUrl}/admin/issues" style="color:#b91c1c; font-weight:700">View all issues →</a>
    </p>
    <p style="margin:8px 0 0 0; font-size:12px; color:#94a3b8">
      This digest is sent weekly to admins who have opted in. To change your preferences, visit the Admin Users page.
    </p>
  </div>
</div>`;

  const textIssues = issues.map((card) => {
    let text = `${card.title}\n`;
    text += `${STATUS_LABELS[card.status]}`;
    if (card.unitName) text += ` · ${card.unitName}`;
    text += ` · ${card.noteCount} note${card.noteCount === 1 ? "" : "s"}`;
    if (card.latestNote) text += `\nLatest: "${card.latestNote.text.slice(0, 150)}" — ${card.latestNote.by}`;
    return text;
  }).join("\n\n");

  const text = `
WEEKLY ISSUES DIGEST — Week of ${weekLabel}

Open: ${issueCounts.open}  |  In Progress: ${issueCounts.in_progress}  |  Total: ${issueCounts.total}

${issueCounts.total === 0 ? "No active issues this week." : textIssues}

View all issues: ${appUrl}/admin/issues
`.trim();

  return { subject, html, text };
}
