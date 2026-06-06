"use client";

import { useState, useEffect } from "react";

interface IssueNote {
  id: string;
  text: string;
  created_by: string;
  created_at: string;
}

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
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [unitFilter, setUnitFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, IssueNote[]>>({});
  const [newNoteText, setNewNoteText] = useState<Record<string, string>>({});
  const [addingNote, setAddingNote] = useState<string | null>(null);

  const [editingTags, setEditingTags] = useState<string | null>(null);
  const [editingTagsText, setEditingTagsText] = useState("");

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

  async function fetchNotes(issueId: string) {
    try {
      const res = await fetch(`/api/admin/issues/${issueId}/notes`);
      const data = await res.json();
      if (data.notes) setNotes((prev) => ({ ...prev, [issueId]: data.notes }));
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

  async function handleSaveTags(issueId: string) {
    setError("");
    const tags = editingTagsText ? editingTagsText.split(",").map((t) => t.trim()).filter(Boolean) : [];
    try {
      const res = await fetch(`/api/admin/issues/${issueId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuccess("Tags updated");
      setEditingTags(null);
      fetchIssues();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update tags");
    }
  }

  async function handleAddNote(issueId: string) {
    const text = newNoteText[issueId]?.trim();
    if (!text) return;
    setError(""); setAddingNote(issueId);
    try {
      const res = await fetch(`/api/admin/issues/${issueId}/notes`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setNewNoteText((prev) => ({ ...prev, [issueId]: "" }));
      fetchNotes(issueId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add note");
    } finally { setAddingNote(null); }
  }

  function toggleNotes(issueId: string) {
    if (expandedNotes === issueId) {
      setExpandedNotes(null);
    } else {
      setExpandedNotes(issueId);
      if (!notes[issueId]) fetchNotes(issueId);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  const allTags = [...new Set(issues.flatMap((i) => i.tags ?? []))].sort();

  // Apply filtering
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
    .filter((i) => {
      if (unitFilter) return i.unit_id === unitFilter;
      return true;
    })
    .filter((i) => {
      if (tagFilter) return i.tags?.includes(tagFilter);
      return true;
    });

  // Apply sorting
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
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-bold text-slate-700">Unit <span className="font-normal text-slate-500">(optional)</span>
                  <select className="rounded-xl border border-slate-300 px-4 py-3" value={newUnitId} onChange={(e) => setNewUnitId(e.target.value)}>
                    <option value="">No unit</option>
                    {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-bold text-slate-700">Tags <span className="font-normal text-slate-500">(comma-separated)</span>
                  <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="equipment, maintenance" value={newTags} onChange={(e) => setNewTags(e.target.value)} />
                </label>
              </div>
              <div><button className="rounded-xl bg-red-700 px-5 py-3 font-bold text-white disabled:opacity-50" type="submit" disabled={isCreating || !newTitle.trim()}>{isCreating ? "Creating..." : "Create"}</button></div>
            </form>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
          <div className="flex flex-1 flex-wrap items-center gap-2 ml-auto">
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm w-44" placeholder="Search..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)}>
              <option value="">All units</option>
              {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
              <option value="">All tags</option>
              {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as SortOrder)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="updated">Recently updated</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="space-y-4">
          {sorted.length === 0 ? (
            <div className="p-8 text-center"><p className="text-slate-500">No issues found</p></div>
          ) : (
            sorted.map((issue) => {
              const status = STATUS_CONFIG[issue.status];
              const issueNotes = notes[issue.id] ?? [];
              const showNotes = expandedNotes === issue.id;
              return (
                <div key={issue.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900">{issue.title}</h3>
                      {issue.units?.name && (
                        <span className="mt-1 inline-block text-xs font-semibold text-slate-500">{issue.units.name}</span>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${status.color}`}>{status.label}</span>
                        {issue.tags?.map((tag) => (
                          <span key={tag} className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${tagColor(tag)}`}>{tag}</span>
                        ))}
                      </div>
                      {issue.description && <p className="mt-2 text-sm text-slate-600">{issue.description}</p>}
                      <p className="mt-2 text-xs text-slate-400">{issue.created_by} · {formatDate(issue.created_at)}</p>
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

                  <div className="mt-3 border-t border-slate-100 pt-3">
                    {editingTags === issue.id ? (
                      <div className="flex items-center gap-2">
                        <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm flex-1" placeholder="equipment, maintenance" value={editingTagsText} onChange={(e) => setEditingTagsText(e.target.value)} />
                        <button className="rounded-lg bg-red-700 px-3 py-1 text-xs font-bold text-white" onClick={() => handleSaveTags(issue.id)} type="button">Save</button>
                        <button className="text-xs text-slate-500" onClick={() => setEditingTags(null)} type="button">Cancel</button>
                      </div>
                    ) : (
                      <button className="text-xs font-semibold text-slate-500 hover:text-red-700" onClick={() => { setEditingTags(issue.id); setEditingTagsText((issue.tags ?? []).join(", ")); }} type="button">
                        {(issue.tags?.length ?? 0) > 0 ? `${issue.tags!.length} tags · edit` : "Add tags"}
                      </button>
                    )}
                  </div>

                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <button className="text-xs font-semibold text-slate-500 hover:text-red-700" onClick={() => toggleNotes(issue.id)} type="button">
                      {issueNotes.length > 0 ? `${issueNotes.length} note${issueNotes.length === 1 ? "" : "s"}` : "Add note"}
                      <span className="ml-1">{showNotes ? "▲" : "▼"}</span>
                    </button>
                    {showNotes && (
                      <div className="mt-3 space-y-3">
                        {issueNotes.map((note) => (
                          <div key={note.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                            <p className="whitespace-pre-wrap text-sm text-slate-700">{note.text}</p>
                            <p className="mt-1 text-xs text-slate-500">{note.created_by} · {formatDate(note.created_at)}</p>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <textarea
                            className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                            rows={2}
                            placeholder="Add a note..."
                            value={newNoteText[issue.id] ?? ""}
                            onChange={(e) => setNewNoteText((prev) => ({ ...prev, [issue.id]: e.target.value }))}
                          />
                          <button className="rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50 self-end" onClick={() => handleAddNote(issue.id)} disabled={addingNote === issue.id || !(newNoteText[issue.id]?.trim())} type="button">{addingNote === issue.id ? "..." : "Add"}</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          </div>
        </div>
      </section>
    </main>
  );
}
