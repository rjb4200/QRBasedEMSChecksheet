"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Issue {
  id: string;
  title: string;
  description: string | null;
  unit_id: string | null;
  tags: string[] | null;
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
  open: { label: "Open", color: "text-red-800 bg-red-100 border-red-200" },
  in_progress: { label: "In Progress", color: "text-amber-800 bg-amber-100 border-amber-200" },
  closed: { label: "Closed", color: "text-green-800 bg-green-100 border-green-200" },
} as const;

const TAG_COLORS = [
  "bg-red-100 text-red-800 border-red-200",
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-green-100 text-green-800 border-green-200",
  "bg-amber-100 text-amber-800 border-amber-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-slate-100 text-slate-700 border-slate-300",
];

function tagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = ((hash << 5) - hash + tag.charCodeAt(i)) | 0;
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

type SortOrder = "newest" | "oldest" | "updated" | "title";

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
  const [newTags, setNewTags] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [filter, setFilter] = useState<"all" | "active" | "closed">("active");
  const [searchText, setSearchText] = useState("");
  const [unitFilter, setUnitFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

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
    } catch { /* optional */ }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault(); setError(""); setIsCreating(true);
    try {
      const tags = newTags ? newTags.split(",").map((t) => t.trim()).filter(Boolean) : [];
      const res = await fetch("/api/admin/issues", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, description: newDescription, unitId: newUnitId || undefined, tags }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuccess("Issue created");
      setNewTitle(""); setNewDescription(""); setNewUnitId(""); setNewTags(""); setFormExpanded(false);
      fetchIssues();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create issue");
    } finally { setIsCreating(false); }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  const allTags = [...new Set(issues.flatMap((i) => i.tags ?? []))].sort();

  const filtered = issues
    .filter((i) => {
      if (filter === "active") return i.status !== "closed";
      if (filter === "closed") return i.status === "closed";
      return true;
    })
    .filter((i) => {
      if (searchText) {
        const q = searchText.toLowerCase();
        return i.title.toLowerCase().includes(q) || (i.description?.toLowerCase().includes(q) ?? false);
      }
      return true;
    })
    .filter((i) => unitFilter ? i.unit_id === unitFilter : true)
    .filter((i) => tagFilter ? i.tags?.includes(tagFilter) : true);

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortOrder === "updated") return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    if (sortOrder === "title") return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const counts = { all: issues.length, active: issues.filter((i) => i.status !== "closed").length, closed: issues.filter((i) => i.status === "closed").length };

  if (loading) {
    return <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950"><div className="mx-auto max-w-7xl"><p className="text-slate-600">Loading...</p></div></main>;
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-4xl font-black">Issues</h1>
          <p className="mt-2 max-w-3xl text-slate-600">Track maintenance issues, equipment problems, and action items across the fleet.</p>
        </div>

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">{error}</div>}
        {success && <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-800">{success}</div>}

        <div className="rounded-3xl bg-white p-4 shadow-sm">
          <button className="flex w-full items-center justify-between text-left" onClick={() => setFormExpanded((v) => !v)} type="button">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Create Issue</p>
            <span className={`inline-flex items-center gap-1 rounded-2xl px-3 py-1 text-xs font-bold transition ${formExpanded ? "bg-red-100 text-red-700" : "bg-red-700 text-white hover:bg-red-800"}`}>
              {formExpanded ? "Collapse" : "New Issue"}
              <svg className={`h-3 w-3 transition ${formExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </button>
          {formExpanded && (
            <form onSubmit={handleCreate} className="mt-4 grid gap-4">
              <label className="grid gap-1 text-sm font-bold text-slate-700">Title
                <input className="rounded-2xl border border-slate-300 px-4 py-3" placeholder="What is the issue?" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
              </label>
              <label className="grid gap-1 text-sm font-bold text-slate-700">Description
                <textarea className="rounded-2xl border border-slate-300 px-4 py-3" rows={3} placeholder="Add details..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-bold text-slate-700">Unit <span className="font-normal text-slate-500">(optional)</span>
                  <select className="rounded-2xl border border-slate-300 px-4 py-3" value={newUnitId} onChange={(e) => setNewUnitId(e.target.value)}>
                    <option value="">No unit</option>
                    {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-bold text-slate-700">Tags <span className="font-normal text-slate-500">(comma-separated)</span>
                  <input className="rounded-2xl border border-slate-300 px-4 py-3" placeholder="equipment, maintenance" value={newTags} onChange={(e) => setNewTags(e.target.value)} />
                </label>
              </div>
              <div><button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white disabled:opacity-50" type="submit" disabled={isCreating || !newTitle.trim()}>{isCreating ? "Creating..." : "Create"}</button></div>
            </form>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["all", "active", "closed"] as const).map((f) => (
            <button
              key={f}
              className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${filter === f ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
              onClick={() => setFilter(f)}
              type="button"
            >
              {f === "all" ? "All" : f === "active" ? "Active" : "Closed"}
              <span className="ml-1 text-xs opacity-60">({counts[f]})</span>
            </button>
          ))}
          <div className="flex flex-1 flex-wrap items-center gap-2 ml-auto">
            <input className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm w-40" placeholder="Search..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <select className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm" value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)}>
              <option value="">All units</option>
              {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <select className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
              <option value="">All tags</option>
              {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as SortOrder)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="updated">Recently updated</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center"><p className="text-slate-500">No issues found</p></div>
        ) : (
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm overflow-hidden">
            <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.15em] text-slate-500">
              <span>Title</span><span>Unit</span><span>Status</span><span>Created</span><span />
            </div>
            {sorted.map((issue) => {
              const status = STATUS_CONFIG[issue.status];
              const displayTags = (issue.tags ?? []).slice(0, 2);
              return (
                <Link key={issue.id} href={`/admin/issues/${issue.id}`} className="block border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50 last:border-b-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-950 hover:text-red-700 transition">{issue.title}</h3>
                        {displayTags.map((tag) => (
                          <span key={tag} className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${tagColor(tag)}`}>{tag}</span>
                        ))}
                        {(issue.tags?.length ?? 0) > 2 && (
                          <span className="text-xs text-slate-400">+{issue.tags!.length - 2}</span>
                        )}
                      </div>
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${status.color}`}>{status.label}</span>
                    {issue.units?.name && (
                      <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 hidden sm:inline">{issue.units.name}</span>
                    )}
                    <span className="text-xs text-slate-500 hidden sm:inline">{formatDate(issue.created_at)}</span>
                    <span className="text-xs text-slate-400">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
