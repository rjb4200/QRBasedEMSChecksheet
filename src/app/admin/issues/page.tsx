"use client";

import { useState, useEffect } from "react";
import { IconCancel, IconSave } from "@/components/icons";

interface Issue {
  id: string;
  title: string;
  description: string | null;
  unit_id: string | null;
  status: "open" | "in_progress" | "closed";
  created_by: string;
  created_at: string;
  updated_at: string;
  units: { name: string } | null;
}

interface Unit {
  id: string;
  name: string;
}

const STATUS_CONFIG = {
  open: { label: "Open", color: "text-red-700 bg-red-50 border-red-200" },
  in_progress: { label: "In Progress", color: "text-amber-700 bg-amber-50 border-amber-200" },
  closed: { label: "Closed", color: "text-green-700 bg-green-50 border-green-200" },
} as const;

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formExpanded, setFormExpanded] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newUnitId, setNewUnitId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [filter, setFilter] = useState<"all" | "active" | "closed">("active");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => { fetchIssues(); fetchUnits(); }, []);

  async function fetchIssues() {
    try {
      const res = await fetch("/api/admin/issues");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setIssues(data.issues || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load issues");
    } finally { setLoading(false); }
  }

  async function fetchUnits() {
    try {
      const res = await fetch("/api/admin/units-list");
      const data = await res.json();
      if (data.units) setUnits(data.units);
    } catch { /* units list is optional, ignore errors */ }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault(); setError(""); setIsCreating(true);
    try {
      const res = await fetch("/api/admin/issues", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, description: newDescription, unitId: newUnitId || undefined }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuccess("Issue created");
      setNewTitle(""); setNewDescription(""); setNewUnitId(""); setFormExpanded(false);
      fetchIssues();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create issue");
    } finally { setIsCreating(false); }
  }

  async function handleStatusChange(issueId: string, newStatus: string) {
    setError(""); setUpdatingId(issueId);
    try {
      const res = await fetch(`/api/admin/issues/${issueId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuccess("Status updated");
      fetchIssues();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally { setUpdatingId(null); }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  const filtered = filter === "all" ? issues : filter === "active" ? issues.filter((i) => i.status !== "closed") : issues.filter((i) => i.status === "closed");
  const counts = { all: issues.length, active: issues.filter((i) => i.status !== "closed").length, closed: issues.filter((i) => i.status === "closed").length };

  if (loading) {
    return <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950"><div className="mx-auto max-w-7xl"><p className="text-slate-600">Loading...</p></div></main>;
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6">
        <div><h1 className="text-4xl font-black">Issues</h1></div>

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">{error}</div>}
        {success && <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-800">{success}</div>}

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <button className="flex w-full items-center justify-between text-left" onClick={() => setFormExpanded((v) => !v)} type="button">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-red-700">Create Issue</p>
            <span className={`inline-flex items-center gap-1 rounded-xl px-3 py-1 text-xs font-bold transition ${formExpanded ? "bg-red-100 text-red-700" : "bg-red-700 text-white hover:bg-red-800"}`}>
              {formExpanded ? "Collapse" : "New Issue"}
              <svg className={`h-3 w-3 transition ${formExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </button>
          {formExpanded && (
            <form onSubmit={handleCreate} className="mt-4 grid gap-4">
              <label className="grid gap-1 text-sm font-bold text-slate-700">Title
                <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="What is the issue?" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
              </label>
              <label className="grid gap-1 text-sm font-bold text-slate-700">Description
                <textarea className="rounded-xl border border-slate-300 px-4 py-3" rows={3} placeholder="Add details..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
              </label>
              <label className="grid gap-1 text-sm font-bold text-slate-700">Unit <span className="font-normal text-slate-500">(optional)</span>
                <select className="rounded-xl border border-slate-300 px-4 py-3" value={newUnitId} onChange={(e) => setNewUnitId(e.target.value)}>
                  <option value="">No unit</option>
                  {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </label>
              <div><button className="rounded-xl bg-red-700 px-5 py-3 font-bold text-white disabled:opacity-50" type="submit" disabled={isCreating || !newTitle.trim()}>{isCreating ? "Creating..." : "Create"}</button></div>
            </form>
          )}
        </div>

        <div className="flex gap-2">
          {(["all", "active", "closed"] as const).map((f) => (
            <button
              key={f}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${filter === f ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
              onClick={() => setFilter(f)}
              type="button"
            >
              {f === "all" ? "All" : f === "active" ? "Active" : "Closed"}
              <span className="ml-1 text-xs opacity-60">({counts[f]})</span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center"><p className="text-slate-500">No issues found</p></div>
          ) : (
            filtered.map((issue) => {
              const status = STATUS_CONFIG[issue.status];
              return (
                <div key={issue.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-950">{issue.title}</h3>
                        <span className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${status.color}`}>{status.label}</span>
                        {issue.units?.name && (
                          <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{issue.units.name}</span>
                        )}
                      </div>
                      {issue.description && <p className="mt-2 text-sm text-slate-600">{issue.description}</p>}
                      <p className="mt-2 text-xs text-slate-500">{issue.created_by} · {formatDate(issue.created_at)}</p>
                    </div>
                    <select
                      className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold"
                      value={issue.status}
                      disabled={updatingId === issue.id}
                      onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
