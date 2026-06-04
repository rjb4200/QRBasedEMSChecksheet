import { createClient } from "@/lib/supabase/server";
import { formatDuration } from "@/lib/archive-records";
import { buildRestockingList } from "@/lib/restocking-list";

function formatTimestamp(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString("en-US", { timeZone: "America/New_York" }) : "Unavailable";
}

function MetadataField({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-black uppercase text-slate-500">{label}</p><p className="font-bold">{value}</p></div>;
}

export default async function ArchiveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: archive } = await supabase.from("shift_archives").select("*, units(name), shift_calendar(shift_name), users(full_name, email)").eq("id", id).single();
  const [{ data: comment }, { data: unitTargets }] = archive ? await Promise.all([supabase
    .from("daily_unit_comments")
    .select("comment")
    .eq("unit_id", archive.unit_id)
    .eq("shift_date", archive.shift_date)
    .eq("shift_period", archive.shift_period)
    .maybeSingle(),
  supabase
    .from("units")
    .select("unit_compartments(id, name, sort_order, unit_compartment_items(id, par_level, input_type, equipment_catalog(name))), unit_kits(id, sort_order, kits(name, kit_items(id, par_level, input_type, equipment_catalog(name))))")
    .eq("id", archive.unit_id)
    .single()]) : [{ data: null }, { data: null }];
  const unit = Array.isArray(archive?.units) ? archive?.units[0] : archive?.units;
  const shift = Array.isArray(archive?.shift_calendar) ? archive?.shift_calendar[0] : archive?.shift_calendar;
  const checkedBy = Array.isArray(archive?.users) ? archive?.users[0] : archive?.users;
  const checkedByName = checkedBy?.full_name ?? checkedBy?.email ?? "";
  const duration = formatDuration(archive?.time_to_complete_seconds ?? null);
  const checks = Array.isArray(archive?.check_data) ? archive.check_data : [];
  const checkDataMap = new Map(checks.map((check: any) => [check.compartment_id ?? check.unit_kit_id, check.item_data ?? null]));
  const restockingTargets = [
    ...(unitTargets?.unit_compartments ?? []).map((compartment: any) => ({ id: compartment.id, name: compartment.name, sortOrder: compartment.sort_order ?? 0, items: compartment.unit_compartment_items ?? [] })),
    ...(unitTargets?.unit_kits ?? []).map((assignment: any) => {
      const kit = Array.isArray(assignment.kits) ? assignment.kits[0] : assignment.kits;
      return { id: assignment.id, name: `${kit?.name ?? "Shared Kit"} (Kit)`, sortOrder: assignment.sort_order ?? 0, items: kit?.kit_items ?? [] };
    }),
  ].sort((a, b) => a.sortOrder - b.sortOrder).map((target) => ({ ...target, itemData: (checkDataMap.get(target.id) as Record<string, unknown> | null) ?? null }));
  const restockingList = buildRestockingList(restockingTargets);

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Archive</p>
          <h1 className="mt-2 text-4xl font-black">{unit?.name} | {archive?.shift_date} {archive?.shift_period}</h1>
          <p className="mt-2 font-semibold capitalize">{archive?.status?.replace("_", " ")} ({archive?.completed_compartments}/{archive?.total_compartments}, {archive?.completion_percentage}%)</p>
        </div>
        <section className="grid gap-3 rounded-3xl bg-white p-5 shadow-sm md:grid-cols-3">
          <MetadataField label="Shift" value={shift?.shift_name ?? "Unknown shift"} />
          {archive?.started_at ? <MetadataField label="Started" value={formatTimestamp(archive.started_at)} /> : null}
          <MetadataField label="Archived At" value={formatTimestamp(archive?.submitted_at)} />
          {duration ? <MetadataField label="Duration" value={duration} /> : null}
          {checkedByName ? <MetadataField label="Checked By" value={checkedByName} /> : null}
          <MetadataField label="Operational Date" value={archive?.operational_date ?? archive?.shift_date ?? "Unknown date"} />
        </section>
        {comment?.comment?.trim() ? (
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase text-slate-500">Unit Comments</p>
            <p className="mt-2 whitespace-pre-wrap font-semibold text-slate-700">{comment.comment.trim()}</p>
          </section>
        ) : null}
        {restockingList.length > 0 ? (
          <section className="rounded-3xl border border-red-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase text-red-700">Restocking List</p>
            <div className="mt-3 space-y-3">
              {restockingList.map((group) => (
                <div key={group.sourceId} className="rounded-2xl bg-red-50 px-4 py-3 text-red-950">
                  <p className="font-black">{group.sourceName}</p>
                  {group.entries.map((entry) => <p key={`${group.sourceId}-${entry.itemId}`} className="mt-1 text-sm font-semibold">{entry.itemName} - {entry.detail}</p>)}
                </div>
              ))}
            </div>
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
