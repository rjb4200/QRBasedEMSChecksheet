import { createClient } from "@/lib/supabase/server";
import { formatDuration } from "@/lib/archive-records";

function formatTimestamp(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString("en-US", { timeZone: "America/New_York" }) : "Not recorded";
}

export default async function ArchiveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: archive } = await supabase.from("shift_archives").select("*, units(name), shift_calendar(shift_name), users(full_name, email)").eq("id", id).single();
  const { data: comment } = archive ? await supabase
    .from("daily_unit_comments")
    .select("comment")
    .eq("unit_id", archive.unit_id)
    .eq("shift_date", archive.shift_date)
    .eq("shift_period", archive.shift_period)
    .maybeSingle() : { data: null };
  const unit = Array.isArray(archive?.units) ? archive?.units[0] : archive?.units;
  const shift = Array.isArray(archive?.shift_calendar) ? archive?.shift_calendar[0] : archive?.shift_calendar;
  const checkedBy = Array.isArray(archive?.users) ? archive?.users[0] : archive?.users;
  const checks = Array.isArray(archive?.check_data) ? archive.check_data : [];

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Archive</p>
          <h1 className="mt-2 text-4xl font-black">{unit?.name} | {archive?.shift_date} {archive?.shift_period}</h1>
          <p className="mt-2 font-semibold capitalize">{archive?.status?.replace("_", " ")} ({archive?.completed_compartments}/{archive?.total_compartments}, {archive?.completion_percentage}%)</p>
        </div>
        <section className="grid gap-3 rounded-3xl bg-white p-5 shadow-sm md:grid-cols-3">
          <div><p className="text-xs font-black uppercase text-slate-500">Shift</p><p className="font-bold">{shift?.shift_name ?? "Not recorded"}</p></div>
          <div><p className="text-xs font-black uppercase text-slate-500">Started</p><p className="font-bold">{formatTimestamp(archive?.started_at)}</p></div>
          <div><p className="text-xs font-black uppercase text-slate-500">Submitted</p><p className="font-bold">{formatTimestamp(archive?.submitted_at)}</p></div>
          <div><p className="text-xs font-black uppercase text-slate-500">Duration</p><p className="font-bold">{formatDuration(archive?.time_to_complete_seconds ?? null) || "Not recorded"}</p></div>
          <div><p className="text-xs font-black uppercase text-slate-500">Checked By</p><p className="font-bold">{checkedBy?.full_name ?? checkedBy?.email ?? "Not recorded"}</p></div>
          <div><p className="text-xs font-black uppercase text-slate-500">Operational Date</p><p className="font-bold">{archive?.operational_date ?? archive?.shift_date ?? "Not recorded"}</p></div>
        </section>
        {comment?.comment?.trim() ? (
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase text-slate-500">Unit Comments</p>
            <p className="mt-2 whitespace-pre-wrap font-semibold text-slate-700">{comment.comment.trim()}</p>
          </section>
        ) : null}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">Compartment Data</h2>
          <pre className="mt-4 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-white">{JSON.stringify(checks, null, 2)}</pre>
        </section>
      </section>
    </main>
  );
}
