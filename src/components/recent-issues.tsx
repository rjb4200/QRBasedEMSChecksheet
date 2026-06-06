"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Issue {
  id: string;
  title: string;
  unit_id: string | null;
  tags: string[] | null;
  status: "open" | "in_progress" | "closed";
  created_at: string;
  units: { name: string } | null;
}

const STATUS_CONFIG = {
  open: { label: "Open", color: "text-red-700 bg-red-50 border-red-200" },
  in_progress: { label: "In Progress", color: "text-amber-700 bg-amber-50 border-amber-200" },
  closed: { label: "Closed", color: "text-green-700 bg-green-50 border-green-200" },
} as const;

const TAG_COLORS = [
  "bg-red-100 text-red-700",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-slate-100 text-slate-700",
];

function tagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = ((hash << 5) - hash + tag.charCodeAt(i)) | 0;
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export function RecentIssues() {
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/issues")
      .then((res) => res.json())
      .then((data) => {
        const active = ((data.issues ?? []) as Issue[])
          .filter((i) => i.status !== "closed")
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3);
        setIssues(active);
      })
      .catch(() => setIssues([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Open Issues</h2>
        <Link className="text-xs font-black text-red-700 hover:underline" href="/admin/issues">View all →</Link>
      </div>
      <div className="mt-3">
        {loading ? (
          <p className="text-sm font-semibold text-slate-500">Loading...</p>
        ) : !issues || issues.length === 0 ? (
          <p className="text-sm text-slate-500">No open issues.</p>
        ) : (
          <div className="space-y-2">
            {issues.map((issue) => {
              const status = STATUS_CONFIG[issue.status];
              return (
                <Link key={issue.id} href={`/admin/issues/${issue.id}`} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 transition hover:bg-slate-100">
                  <span className="font-bold text-sm text-slate-950 truncate flex-1">{issue.title}</span>
                  {issue.tags?.[0] && <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold hidden sm:inline ${tagColor(issue.tags[0])}`}>{issue.tags[0]}</span>}
                  {issue.units?.name && <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold border border-slate-300 text-slate-700 hidden sm:inline">{issue.units.name}</span>}
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${status.color}`}>{status.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
