import Link from "next/link";
import { CrewNameLock } from "./crew-name-lock";
import { ShiftResetWarning } from "./shift-reset-warning";
import { saveDailyUnitComment, getRestockAddressed, getManualRestockItems } from "./actions";
import { getCurrentShift, getShiftLabel } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { shouldShowMonthlyCheckReminder } from "@/lib/monthly-check";
import { MonthlyCheckReminderBanner } from "@/components/monthly-check-banner";
import { buildRestockingList, type ManualRestockItem } from "@/lib/restocking-list";
import { RestockingListSection } from "@/components/restocking-list-section";
import { CheckoffPrefetch } from "@/components/checkoff-prefetch";

const statusStyles = {
  grey: "border-slate-300 bg-slate-200 text-slate-800",
  yellow: "border-yellow-300 bg-yellow-100 text-yellow-900",
  green: "border-green-300 bg-green-100 text-green-900",
};


export default async function UnitDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const currentShift = getCurrentShift();
  const [{ data: unit }, { data: checks }, { data: crew }, { data: comment }, { data: sectionComments }, addressedRows, manualItemsData] = await Promise.all([
    supabase.from("units").select("id, name, status, monthly_check_day, unit_compartments(id, name, sort_order, unit_compartment_items(id, equipment_id, par_level, input_type)), unit_kits(id, sort_order, kits(id, name, kit_items(id, equipment_id, par_level, input_type)))").eq("id", id).is("deleted_at", null).single(),
    supabase.from("compartment_checks").select("compartment_id, unit_kit_id, status, item_data").eq("unit_id", id).eq("shift_date", currentShift.shiftDate).eq("shift_period", currentShift.shiftPeriod),
    supabase.from("daily_unit_crews").select("provider_names, locked").eq("unit_id", id).eq("shift_date", currentShift.shiftDate).eq("shift_period", currentShift.shiftPeriod).maybeSingle(),
    supabase.from("daily_unit_comments").select("comment").eq("unit_id", id).eq("shift_date", currentShift.shiftDate).eq("shift_period", currentShift.shiftPeriod).maybeSingle(),
    supabase.from("daily_section_comments").select("id, source_name, comment, created_at").eq("unit_id", id).eq("shift_date", currentShift.shiftDate).eq("shift_period", currentShift.shiftPeriod).order("source_name", { ascending: true }).order("created_at", { ascending: false }),
    getRestockAddressed(id, currentShift.shiftDate, currentShift.shiftPeriod),
    getManualRestockItems(id, currentShift.shiftDate, currentShift.shiftPeriod),
  ]);

  // Collect all equipment IDs from compartment and kit items
  const equipmentIds = new Set<string>();
  for (const comp of (unit?.unit_compartments ?? []) as any[]) {
    for (const item of (comp.unit_compartment_items ?? []) as any[]) {
      if (item.equipment_id) equipmentIds.add(item.equipment_id);
    }
  }
  for (const assignment of (unit?.unit_kits ?? []) as any[]) {
    const kit = Array.isArray(assignment.kits) ? assignment.kits[0] : assignment.kits;
    for (const item of (kit?.kit_items ?? []) as any[]) {
      if (item.equipment_id) equipmentIds.add(item.equipment_id);
    }
  }

  // Fetch equipment catalog names in a single flat query
  const equipmentNameMap = new Map<string, string>();
  if (equipmentIds.size > 0) {
    const { data: catalogRows } = await supabase
      .from("equipment_catalog")
      .select("id, name")
      .in("id", Array.from(equipmentIds));
    for (const row of (catalogRows ?? []) as { id: string; name: string }[]) {
      equipmentNameMap.set(row.id, row.name);
    }
  }
  const compartments = (unit?.unit_compartments ?? []).map((compartment: any) => ({
    id: compartment.id,
    name: compartment.name,
    type: "compartment" as const,
    sortOrder: compartment.sort_order ?? 0,
    items: (compartment.unit_compartment_items ?? []).map((item: any) => ({
      ...item,
      name: equipmentNameMap.get(item.equipment_id) ?? item.name ?? "Unknown item",
    })),
  }));
  const kits = (unit?.unit_kits ?? []).map((assignment: any) => {
    const kit = Array.isArray(assignment.kits) ? assignment.kits[0] : assignment.kits;
    return {
      id: assignment.id,
      name: kit?.name ?? "Shared kit",
      type: "kit" as const,
      sortOrder: assignment.sort_order ?? 0,
      items: (kit?.kit_items ?? []).map((item: any) => ({
        ...item,
        name: equipmentNameMap.get(item.equipment_id) ?? item.name ?? "Unknown item",
      })),
    };
  });
  const targets = [...compartments, ...kits].sort((a, b) => a.sortOrder - b.sortOrder);
  const checkMap = new Map((checks ?? []).map((check: any) => [check.compartment_id ?? check.unit_kit_id, check.status]));
  const checkDataMap = new Map((checks ?? []).map((check: any) => [check.compartment_id ?? check.unit_kit_id, check.item_data ?? null]));
  const restockingList = buildRestockingList(targets.map((target) => ({
    id: target.id,
    name: target.name,
    items: target.items,
    itemData: checkDataMap.get(target.id) ?? null,
  })));
  const addressedKeySet = new Set((addressedRows ?? []).map((row) => `${row.target_id}:${row.item_id}`));
  // Merge manual addressed state into the key set with manual: prefix (server-side initialization)
  (manualItemsData ?? []).forEach((item) => {
    if (item.addressed) addressedKeySet.add(`manual:${item.id}`);
  });
  const manualItems: ManualRestockItem[] = (manualItemsData ?? []).map((item) => ({
    id: item.id,
    itemName: item.item_name,
    note: item.note,
    sourceName: item.source_name,
    addressed: item.addressed,
  }));
  const crewComplete = Boolean(crew?.locked && crew.provider_names?.trim());
  const completedCompartments = checks?.filter((check) => check.status === "completed").length ?? 0;
  const total = targets.length + 1;

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-6 text-slate-950">
      <section className="mx-auto max-w-5xl space-y-5">
        <div className="sticky top-0 z-10 -mx-5 border-b border-slate-200 bg-white/95 px-5 py-4 shadow-sm backdrop-blur">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">{getShiftLabel()}</p>
              <h1 className="text-3xl font-black">{unit?.name}</h1>
            </div>
            <Link className="rounded-2xl bg-red-700 px-5 py-3 text-center font-bold text-white" href="/scan">Scan</Link>
          </div>
        </div>

        {unit?.status !== "in_service" ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-5 font-bold text-red-800">This unit is out of service.</div>
        ) : null}

        {shouldShowMonthlyCheckReminder(unit?.monthly_check_day ?? null) ? <MonthlyCheckReminderBanner /> : null}

        <ShiftResetWarning />

        {restockingList.length > 0 || manualItems.length > 0 ? (
          <RestockingListSection
            addressedKeySet={addressedKeySet}
            manualItems={manualItems}
            restockingList={restockingList}
            shiftDate={currentShift.shiftDate}
            shiftPeriod={currentShift.shiftPeriod}
            unitId={id}
            unitName={unit?.name}
          />
        ) : null}

        <CrewNameLock completedCompartments={completedCompartments} initialLocked={crewComplete} initialProviderNames={crew?.provider_names ?? ""} totalChecks={total} unitId={id} />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {targets.map((target) => {
            const dbStatus = checkMap.get(target.id);
            const status = dbStatus === "completed" ? "green" : dbStatus === "in_progress" ? "yellow" : "grey";
            return (
              <article key={target.id} aria-label={`${target.name}: ${status}`} className={`rounded-3xl border-2 p-5 ${statusStyles[status]}`} role="status">
                <p className="text-xl font-black">{target.name}</p>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em]">{status === "grey" ? "Not Started" : status === "yellow" ? "In Progress" : "Completed"}</p>
              </article>
            );
          })}
        </div>

        {sectionComments && sectionComments.length > 0 ? (
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-700">Section Comments</p>
            <ul className="mt-4 space-y-3">
              {sectionComments.map((sectionComment) => (
                <li key={sectionComment.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="font-black text-slate-950">{sectionComment.source_name}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm font-semibold text-slate-700">{sectionComment.comment}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <form action={saveDailyUnitComment} className="rounded-3xl bg-white p-5 shadow-sm">
          <input name="unitId" type="hidden" value={id} />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-700">Daily Unit Comments</p>
          </div>
          <textarea
            className="mt-4 min-h-32 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none ring-red-500 focus:ring-4"
            defaultValue={comment?.comment ?? ""}
            maxLength={2000}
            name="comment"
            placeholder="Add daily unit notes..."
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Save Comment</button>
            <button className="rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-700" name="intent" type="submit" value="clear">Clear Comment</button>
            <span className="text-xs font-semibold text-slate-500">Maximum 2,000 characters.</span>
          </div>
        </form>
      </section>
      <CheckoffPrefetch
        targets={targets.map((t) => ({
          id: t.id,
          type: t.type,
        }))}
        unitId={id}
      />
    </main>
  );
}
