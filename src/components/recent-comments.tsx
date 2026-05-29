"use client";

import { useEffect, useState } from "react";

type RecentComment = {
  id: string;
  unitName: string;
  sourceName: string;
  comment: string;
  createdAt: string;
  shiftDate: string;
};

function formatRelativeDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  if (diffDays === 1) return "Yesterday";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function RecentComments() {
  const [comments, setComments] = useState<RecentComment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open || comments !== null) return;

    setLoading(true);
    fetch("/api/admin/recent-comments")
      .then((res) => res.json())
      .then((data) => setComments(data.comments ?? []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [open, comments]);

  return (
    <details className="rounded-3xl bg-white p-5 shadow-sm" onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}>
      <summary className="cursor-pointer">
        <h2 className="inline text-sm font-bold uppercase tracking-[0.25em] text-red-700">Recent Comments — Last 7 Days</h2>
      </summary>
      <div className="mt-4">
        {loading ? (
          <p className="text-sm font-semibold text-slate-500">Loading...</p>
        ) : comments === null ? null : comments.length === 0 ? (
          <p className="text-sm font-semibold text-slate-500">No comments in the last 7 days.</p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-bold text-slate-500">
                  {formatRelativeDate(comment.createdAt)} | {comment.unitName} | {comment.sourceName}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm font-semibold text-slate-700">{comment.comment}</p>
              </div>
              ))}
            </div>
        )}
      </div>
    </details>
  );
}
