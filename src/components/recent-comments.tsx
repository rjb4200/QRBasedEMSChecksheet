"use client";

import { useEffect, useState } from "react";

type RecentComment = {
  id: string;
  unitId: string;
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

  const [escalatingId, setEscalatingId] = useState<string | null>(null);
  const [escTitle, setEscTitle] = useState("");
  const [escDescription, setEscDescription] = useState("");
  const [escUnitId, setEscUnitId] = useState("");
  const [escError, setEscError] = useState("");
  const [escSubmitting, setEscSubmitting] = useState(false);

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

  function startEscalate(comment: RecentComment) {
    setEscalatingId(comment.id);
    setEscTitle(comment.comment.length > 100 ? comment.comment.slice(0, 97) + "..." : comment.comment);
    setEscDescription(comment.comment);
    setEscUnitId(comment.unitId ?? "");
    setEscError("");
  }

  function cancelEscalate() {
    setEscalatingId(null);
    setEscTitle("");
    setEscDescription("");
    setEscUnitId("");
    setEscError("");
  }

  async function submitEscalate() {
    setEscError(""); setEscSubmitting(true);
    try {
      const res = await fetch("/api/admin/issues", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: escTitle, description: escDescription, unitId: escUnitId || undefined }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      cancelEscalate();
    } catch (err) {
      setEscError(err instanceof Error ? err.message : "Failed to create issue");
    } finally { setEscSubmitting(false); }
  }

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
                {escalatingId === comment.id ? (
                  <div className="grid gap-3">
                    {escError && <p className="text-xs font-bold text-red-700">{escError}</p>}
                    <label className="grid gap-1 text-xs font-bold text-slate-700">Title
                      <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={escTitle} onChange={(e) => setEscTitle(e.target.value)} />
                    </label>
                    <label className="grid gap-1 text-xs font-bold text-slate-700">Description
                      <textarea className="rounded-xl border border-slate-300 px-3 py-2 text-sm" rows={3} value={escDescription} onChange={(e) => setEscDescription(e.target.value)} />
                    </label>
                    <div className="flex items-center gap-2">
                      <button className="rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50" onClick={submitEscalate} disabled={escSubmitting || !escTitle.trim()} type="button">{escSubmitting ? "Creating..." : "Create"}</button>
                      <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600" onClick={cancelEscalate} type="button">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-500">
                          {formatRelativeDate(comment.createdAt)} | {comment.unitName} | {comment.sourceName}
                        </p>
                        {comment.crewNames ? (
                          <p className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold border border-slate-300 text-slate-700">Crew: {comment.crewNames}</p>
                        ) : null}
                        <p className="mt-1 whitespace-pre-wrap text-sm font-semibold text-slate-700">{comment.comment}</p>
                      </div>
                      <button className="shrink-0 rounded-lg border border-red-200 px-2 py-1 text-xs font-bold text-red-700 hover:bg-red-50" onClick={() => startEscalate(comment)} type="button">Create Issue</button>
                    </div>
                  </>
                )}
              </div>
              ))}
            </div>
        )}
      </div>
    </section>
  );
}
