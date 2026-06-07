import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { SubmitButton } from "@/components/submit-button";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { IconSave } from "@/components/icons";
import { updateIssue, deleteIssue, addIssueNote } from "../actions";

const STATUS_CONFIG = {
  open: { label: "Open", color: "text-red-700 bg-red-50 border-red-200" },
  in_progress: { label: "In Progress", color: "text-amber-700 bg-amber-50 border-amber-200" },
  closed: { label: "Closed", color: "text-green-700 bg-green-50 border-green-200" },
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
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

interface Note {
  id: string;
  text: string;
  created_by: string;
  created_at: string;
}

interface Unit {
  id: string;
  name: string;
}

export default async function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: issue }, { data: notes }, { data: units }] = await Promise.all([
    supabase
      .from("issues")
      .select("id, title, description, unit_id, tags, status, created_by, created_at, updated_at, units(name)")
      .eq("id", id)
      .single<Issue>(),
    supabase
      .from("issue_notes")
      .select("id, text, created_by, created_at")
      .eq("issue_id", id)
      .order("created_at", { ascending: true }),
    supabase.from("units").select("id, name").order("name"),
  ]);

  if (!issue) {
    return (
      <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
        <div className="mx-auto max-w-4xl">
          <p className="font-bold text-red-800">Issue not found</p>
          <Link className="mt-4 inline-block text-sm font-bold text-red-700 underline" href="/admin/issues">← Back to Issues</Link>
        </div>
      </main>
    );
  }

  const status = STATUS_CONFIG[issue.status];
  const unitName = issue.units?.name ?? null;

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-4xl space-y-6">
        <Link className="text-sm font-bold text-red-700 underline" href="/admin/issues">← Back to Issues</Link>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-slate-950">{issue.title}</h1>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${status.color}`}>{status.label}</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {unitName && <>{unitName} · </>}
                {issue.created_by} · {formatDate(issue.created_at)}
              </p>
            </div>
            <DeleteConfirmButton
              formAction={deleteIssue}
              hiddenInputs={[{ name: "id", value: issue.id }]}
            />
          </div>

          {issue.tags && issue.tags.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="flex flex-wrap items-center gap-2">
                {issue.tags.map((tag, i) => (
                  <span key={i} className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${tagColor(tag)}`}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          {issue.description && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700 mb-2">Description</p>
              <p className="whitespace-pre-wrap text-sm text-slate-700">{issue.description}</p>
            </div>
          )}
        </div>

        <form action={updateIssue} className="rounded-3xl bg-white p-6 shadow-sm grid gap-4">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-red-700">Edit Issue</p>
          <input name="id" type="hidden" value={issue.id} />
          <label className="grid gap-1 text-sm font-bold text-slate-700">Title
            <input className="rounded-2xl border border-slate-300 px-4 py-3" name="title" defaultValue={issue.title} required />
          </label>
          <label className="grid gap-1 text-sm font-bold text-slate-700">Description
            <textarea className="rounded-2xl border border-slate-300 px-4 py-3" name="description" rows={3} defaultValue={issue.description ?? ""} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-bold text-slate-700">Status
              <select className="rounded-2xl border border-slate-300 px-4 py-3" name="status" defaultValue={issue.status}>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm font-bold text-slate-700">Unit
              <select className="rounded-2xl border border-slate-300 px-4 py-3" name="unitId" defaultValue={issue.unit_id ?? ""}>
                <option value="">No unit</option>
                {(units ?? []).map((u: Unit) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="grid gap-1 text-sm font-bold text-slate-700">Tags <span className="font-normal text-slate-500">(comma-separated)</span>
            <input className="rounded-2xl border border-slate-300 px-4 py-3" name="tags" defaultValue={(issue.tags ?? []).join(", ")} placeholder="equipment, maintenance" />
          </label>
          <div>
            <SubmitButton className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white disabled:opacity-50 inline-flex items-center gap-2" title="Save changes">
              <IconSave /> Save Changes
            </SubmitButton>
          </div>
        </form>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-red-700">Notes ({(notes ?? []).length})</p>

          <div className="mt-4 space-y-4">
            {(notes ?? []).length === 0 ? (
              <p className="text-sm text-slate-500">No notes yet.</p>
            ) : (
              (notes ?? []).map((note: Note) => (
                <div key={note.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500">{note.created_by} · {formatDate(note.created_at)}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{note.text}</p>
                </div>
              ))
            )}
          </div>

          <form action={addIssueNote} className="mt-4 flex gap-2">
            <input name="issueId" type="hidden" value={issue.id} />
            <textarea
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm"
              rows={2}
              name="text"
              placeholder="Add a note..."
              required
            />
            <SubmitButton className="rounded-xl bg-red-700 px-5 py-2 text-sm font-bold text-white disabled:opacity-50 self-end" title="Add note">
              Add
            </SubmitButton>
          </form>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-red-700">Status</p>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${status.color}`}>{status.label}</span>
            <span className="text-xs text-slate-500">Use the Edit Issue form above to change status</span>
          </div>
        </div>
      </section>
    </main>
  );
}
