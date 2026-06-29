import { createAdminClient } from "@/lib/supabase/server-admin";

export type WeeklyIssuesReport = {
  reportWeekStart: string;
  generatedAt: string;
  issueCounts: { open: number; in_progress: number; total: number };
  issues: WeeklyIssueCard[];
  recipients: WeeklyReportRecipient[];
};

export type WeeklyIssueCard = {
  title: string;
  unitName: string | null;
  status: "open" | "in_progress";
  tags: string[];
  createdBy: string;
  createdAt: string;
  noteCount: number;
  latestNote: { text: string; by: string } | null;
};

export type WeeklyReportRecipient = {
  id: string;
  username: string;
  email: string;
};

function getMonday(date: Date): string {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

export async function getWeeklyIssuesReport(): Promise<WeeklyIssuesReport> {
  const supabase = createAdminClient();
  const now = new Date();
  const reportWeekStart = getMonday(now);

  const { data: issues, error: issuesError } = await supabase
    .from("issues")
    .select("id, title, unit_id, tags, status, created_by, created_at, units(name)")
    .in("status", ["open", "in_progress"])
    .order("created_at", { ascending: false });

  if (issuesError) throw new Error(issuesError.message);

  const openCount = (issues ?? []).filter((i) => i.status === "open").length;
  const inProgressCount = (issues ?? []).filter((i) => i.status === "in_progress").length;

  const issueIds = (issues ?? []).map((i) => i.id);

  const noteCounts: Record<string, number> = {};
  const latestNotes: Record<string, { text: string; by: string } | null> = {};

  if (issueIds.length > 0) {
    const { data: notes, error: notesError } = await supabase
      .from("issue_notes")
      .select("id, issue_id, text, created_by, created_at")
      .in("issue_id", issueIds)
      .order("created_at", { ascending: false });

    if (notesError) throw new Error(notesError.message);

    for (const note of (notes ?? []) as any[]) {
      noteCounts[note.issue_id] = (noteCounts[note.issue_id] ?? 0) + 1;
      if (!latestNotes[note.issue_id]) {
        latestNotes[note.issue_id] = { text: note.text, by: note.created_by };
      }
    }
  }

  const issueCards: WeeklyIssueCard[] = (issues ?? []).map((issue) => {
    const unitName = Array.isArray(issue.units) ? (issue.units[0] as any)?.name ?? null : (issue.units as any)?.name ?? null;
    return {
      title: issue.title,
      unitName,
      status: issue.status as "open" | "in_progress",
      tags: issue.tags ?? [],
      createdBy: issue.created_by,
      createdAt: issue.created_at,
      noteCount: noteCounts[issue.id] ?? 0,
      latestNote: latestNotes[issue.id] ?? null,
    };
  });

  const { data: recipients, error: recipientsError } = await supabase
    .from("admin_users")
    .select("id, username, email, receives_weekly_issues_digest")
    .not("email", "is", null)
    .neq("email", "")
    .eq("receives_weekly_issues_digest", true)
    .order("username");

  if (recipientsError) throw new Error(recipientsError.message);

  return {
    reportWeekStart,
    generatedAt: now.toISOString(),
    issueCounts: { open: openCount, in_progress: inProgressCount, total: (issues ?? []).length },
    issues: issueCards,
    recipients: (recipients ?? []).map((r) => ({ id: r.id, username: r.username, email: r.email })),
  };
}
