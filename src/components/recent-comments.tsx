"use client";

import { useEffect, useState } from "react";

type RecentComment = {
  id: string;
  unitName: string;
  sourceName: string;
  comment: string;
  createdAt: string;
  shiftDate: string;
  crewNames?: string;
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
  const [compactComments, setCompactComments] = useState<RecentComment[] | null>(null);
  const [expandedComments, setExpandedComments] = useState<RecentComment[] | null>(null);
  const [compactLoading, setCompactLoading] = useState(true);
  const [expandedLoading, setExpandedLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCompactLoading(true);
    fetch("/api/admin/recent-comments?mode=compact")
      .then((res) => res.json())
      .then((data) => setCompactComments(data.comments ?? []))
      .catch(() => setCompactComments([]))
      .finally(() => setCompactLoading(false));
  }, []);

  useEffect(() => {
    if (!open || expandedComments !== null) return;

    setExpandedLoading(true);
    fetch("/api/admin/recent-comments?mode=expanded")
      .then((res) => res.json())
      .then((data) => setExpandedComments(data.comments ?? []))
      .catch(() => setExpandedComments([]))
      .finally(() => setExpandedLoading(false));
  }, [open, expandedComments]);

  const visibleComments = open ? expandedComments : compactComments;
  const loading = open ? expandedLoading : compactLoading;
  const emptyMessage = open ? "No comments in the last 10 days." : "No recent comments to preview.";

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">
      <button className="flex w-full items-center justify-between gap-3 text-left" onClick={() => setOpen((value) => !value)} type="button">
        <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Recent Comments — {open ? "Last 10 Days" : "Latest 3"}</h2>
        <span className="text-sm font-black text-slate-500">{open ? "Hide" : "Show 10 days"}</span>
      </button>
      <div className="mt-4">
        {loading ? (
          <p className="text-sm font-semibold text-slate-500">Loading...</p>
        ) : visibleComments === null ? null : visibleComments.length === 0 ? (
          <p className="text-sm font-semibold text-slate-500">{emptyMessage}</p>
        ) : (
          <div className="space-y-3">
            {visibleComments.map((comment) => (
              <div key={comment.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-bold text-slate-500">
                  {formatRelativeDate(comment.createdAt)} | {comment.unitName} | {comment.sourceName}
                </p>
                {comment.crewNames ? (
                  <p className="mt-2 inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-black text-red-800">Crew: {comment.crewNames}</p>
                ) : null}
                <p className="mt-1 whitespace-pre-wrap text-sm font-semibold text-slate-700">{comment.comment}</p>
              </div>
              ))}
            </div>
        )}
      </div>
    </section>
  );
}
