"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const issueId = params.id as string;

  const [issue, setIssue] = useState<Issue | null>(null);
  const [notes, setNotes] = useState<IssueNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newNoteText, setNewNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [editingTagsList, setEditingTagsList] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");

  const [editingDetails, setEditingDetails] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingDetails, setSavingDetails] = useState(false);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchIssue(); fetchNotes(); }, [issueId]);
  useEffect(() => { setEditingTagsList(issue?.tags ?? []); }, [issue?.tags]);

  async function fetchIssue() {
    try {
      const res = await fetch("/api/admin/issues");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const found = (data.issues ?? []).find((i: Issue) => i.id === issueId);
      if (found) setIssue(found);
      else setError("Issue not found");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load issue");
    } finally { setLoading(false); }
  }

  async function fetchNotes() {
    try {
      const res = await fetch(`/api/admin/issues/${issueId}/notes`);
      const data = await res.json();
      if (data.notes) setNotes(data.notes);
    } catch { /* optional */ }
  }

  async function handleStatusChange(newStatus: string) {
    setError(""); setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/issues/${issueId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.issue) setIssue(data.issue);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally { setUpdatingStatus(false); }
  }

  async function handleAddNote() {
    const text = newNoteText.trim();
    if (!text) return;
    setError(""); setAddingNote(true);
    try {
      const res = await fetch(`/api/admin/issues/${issueId}/notes`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setNewNoteText("");
      fetchNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add note");
    } finally { setAddingNote(false); }
  }

async function saveTags(tagsList: string[]) {
    try {
      const res = await fetch(`/api/admin/issues/${issueId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: tagsList }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.issue) setIssue(data.issue);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update tags");
    }
  }

  function addTag() {
    const t = newTagInput.trim().toLowerCase();
    if (!t || editingTagsList.includes(t)) return;
    const updated = [...editingTagsList, t];
    setEditingTagsList(updated);
    setNewTagInput("");
    saveTags(updated);
  }

  function removeTag(index: number) {
    const updated = editingTagsList.filter((_, i) => i !== index);
    setEditingTagsList(updated);
    saveTags(updated);
  }

  async function handleSaveDetails() {
    setError(""); setSavingDetails(true);
    try {
      const res = await fetch(`/api/admin/issues/${issueId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.issue) setIssue(data.issue);
      setEditingDetails(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally { setSavingDetails(false); }
  }

  async function handleDelete() {
    setError(""); setDeleting(true);
    try {
      const res = await fetch(`/api/admin/issues/${issueId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      router.push("/admin/issues");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete issue");
      setDeleting(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  if (loading) {
    return <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950"><div className="mx-auto max-w-4xl"><p className="text-slate-600">Loading...</p></div></main>;
  }

  if (error && !issue) {
    return <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950"><div className="mx-auto max-w-4xl"><div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">{error}</div><Link className="mt-4 inline-block text-sm font-bold text-red-700 underline" href="/admin/issues">← Back to Issues</Link></div></main>;
  }

  if (!issue) return null;

  const status = STATUS_CONFIG[issue.status];

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-4xl space-y-6">
        <Link className="text-sm font-bold text-red-700 underline" href="/admin/issues">← Back to Issues</Link>

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">{error}</div>}

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {editingDetails ? (
                <div className="grid gap-3">
                  <input className="rounded-xl border border-slate-300 px-4 py-3 text-2xl font-black text-slate-950" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  <textarea className="rounded-xl border border-slate-300 px-4 py-3 text-sm" rows={4} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg bg-red-700 px-3 py-1 text-xs font-bold text-white disabled:opacity-50" onClick={handleSaveDetails} disabled={savingDetails || !editTitle.trim()} type="button">{savingDetails ? "Saving..." : "Save"}</button>
                    <button className="text-xs text-slate-500" onClick={() => setEditingDetails(false)} type="button">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-black text-slate-950">{issue.title}</h1>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${status.color}`}>{status.label}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {issue.units?.name && <>{issue.units.name} · </>}
                    {issue.created_by} · {formatDate(issue.created_at)}
                  </p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!editingDetails && (
                <button className="text-xs font-semibold text-slate-400 hover:text-red-700" onClick={() => { setEditingDetails(true); setEditTitle(issue.title); setEditDescription(issue.description ?? ""); }} type="button">Edit</button>
              )}
              {deleting ? (
                <>
                  <span className="text-xs font-bold text-red-700">Delete?</span>
                  <button className="rounded-lg bg-red-700 px-2 py-0.5 text-xs font-bold text-white" onClick={handleDelete} type="button">Confirm</button>
                  <button className="text-xs text-slate-500" onClick={() => setDeleting(false)} type="button">Cancel</button>
                </>
              ) : (
                !editingDetails && <button className="text-xs font-semibold text-red-400 hover:text-red-700" onClick={() => setDeleting(true)} type="button">Delete</button>
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              {editingTagsList.map((tag, i) => (
                <span key={i} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${tagColor(tag)}`}>
                  {tag}
                  <button className="ml-0.5 opacity-60 hover:opacity-100" onClick={() => removeTag(i)} type="button">×</button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm w-40" placeholder="Add a tag" value={newTagInput} onChange={(e) => setNewTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
              <button className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700" onClick={addTag} type="button">Add</button>
            </div>
          </div>

          {!editingDetails && issue.description && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700 mb-2">Description</p>
              <p className="whitespace-pre-wrap text-sm text-slate-700">{issue.description}</p>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-red-700">Notes ({notes.length})</p>

          <div className="mt-4 space-y-4">
            {notes.length === 0 ? (
              <p className="text-sm text-slate-500">No notes yet.</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500">{note.created_by} · {formatDate(note.created_at)}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{note.text}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <textarea
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm"
              rows={2}
              placeholder="Add a note..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
            />
            <button className="rounded-xl bg-red-700 px-5 py-2 text-sm font-bold text-white disabled:opacity-50 self-end" onClick={handleAddNote} disabled={addingNote || !newNoteText.trim()} type="button">{addingNote ? "..." : "Add"}</button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-red-700">Status</p>
            <select
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold"
              value={issue.status}
              disabled={updatingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </section>
    </main>
  );
}
