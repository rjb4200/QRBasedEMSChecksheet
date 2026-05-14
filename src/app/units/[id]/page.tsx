import Link from "next/link";
import { CrewNameLock } from "./crew-name-lock";
import { ShiftResetWarning } from "./shift-reset-warning";
import { saveDailyUnitComment } from "./actions";
import { getCurrentShift, getPreviousShift, getShiftLabel } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { shouldShowMonthlyCheckReminder } from "@/lib/monthly-check";
import { MonthlyCheckReminderBanner } from "@/components/monthly-check-banner";

const statusStyles = {
  grey: "border-slate-300 bg-slate-200 text-slate-800",
  yellow: "border-yellow-300 bg-yellow-100 text-yellow-900",
  green: "border-green-300 bg-green-100 text-green-900",
};

type UnitItem = {
  id: string;
  par_level: number | null;
  input_type: "quantity" | "checkbox" | "condition";
  equipment_catalog: { name: string } | { name: string }[] | null;
};

function equipmentName(item: UnitItem) {
  return Array.isArray(item.equipment_catalog) ? item.equipment_catalog[0]?.name : item.equipment_catalog?.name;
}

function findPreviousExceptions(targets: { id: string; name: string; items?: UnitItem[] | null }[], checkData: unknown) {
  if (!Array.isArray(checkData)) return [];
  const checkMap = new Map(checkData.map((check: any) => [check.compartment_id ?? check.unit_kit_id, check.item_data ?? {}]));

  return targets.flatMap((target) => (target.items ?? []).flatMap((item) => {
    const value = checkMap.get(target.id)?.[item.id];
    if (item.input_type === "checkbox" && value === false) {
      return [{ compartment: target.name, item: equipmentName(item) ?? "Unknown item", issue: "Missing" }];
    }
    if (item.input_type === "quantity" && item.par_level !== null && Number(value) < item.par_level) {
      return [{ compartment: target.name, item: equipmentName(item) ?? "Unknown item", issue: `Below par (${value ?? "-"}/${item.par_level})` }];
    }
    if (item.input_type === "condition" && typeof value === "object" && value !== null && (value as { status?: string }).status !== "OK") {
      return [{ compartment: target.name, item: equipmentName(item) ?? "Unknown item", issue: `Condition: ${(value as { status?: string }).status ?? "Unknown"}` }];
    }
    return [];
  }));
}

export default async function UnitDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const currentShift = getCurrentShift();
  const previousShift = getPreviousShift();
  const [{ data: unit }, { data: checks }, { data: previousArchive }, { data: crew }, { data: comment }, { data: previousCrew }, { data: sectionComments }] = await Promise.all([
    supabase.from("units").select("id, name, status, monthly_check_day, unit_compartments(id, name, sort_order, unit_compartment_items(id, par_level, input_type, equipment_catalog(name))), unit_kits(id, sort_order, kits(id, name, kit_items(id, par_level, input_type, equipment_catalog(name))))").eq("id", id).is("deleted_at", null).single(),
    supabase.from("compartment_checks").select("compartment_id, unit_kit_id, status").eq("unit_id", id).eq("shift_date", currentShift.shiftDate).eq("shift_period", currentShift.shiftPeriod),
    supabase.from("shift_archives").select("completed_compartments, total_compartments, completion_percentage, check_data").eq("unit_id", id).eq("shift_date", previousShift.shiftDate).eq("shift_period", previousShift.shiftPeriod).maybeSingle(),
    supabase.from("daily_unit_crews").select("provider_names, locked").eq("unit_id", id).eq("shift_date", currentShift.shiftDate).eq("shift_period", currentShift.shiftPeriod).maybeSingle(),
    supabase.from("daily_unit_comments").select("comment").eq("unit_id", id).eq("shift_date", currentShift.shiftDate).eq("shift_period", currentShift.shiftPeriod).maybeSingle(),
    supabase.from("daily_unit_crews").select("provider_names, locked").eq("unit_id", id).eq("shift_date", previousShift.shiftDate).eq("shift_period", previousShift.shiftPeriod).maybeSingle(),
    supabase.from("daily_section_comments").select("id, source_name, comment, created_at").eq("unit_id", id).eq("shift_date", currentShift.shiftDate).eq("shift_period", currentShift.shiftPeriod).order("source_name", { ascending: true }).order("created_at", { ascending: false }),
  ]);
  const compartments = (unit?.unit_compartments ?? []).map((compartment: any) => ({
    id: compartment.id,
    name: compartment.name,
    sortOrder: compartment.sort_order ?? 0,
    items: compartment.unit_compartment_items ?? [],
  }));
  const kits = (unit?.unit_kits ?? []).map((assignment: any) => {
    const kit = Array.isArray(assignment.kits) ? assignment.kits[0] : assignment.kits;
    return {
      id: assignment.id,
      name: kit?.name ?? "Shared kit",
      sortOrder: assignment.sort_order ?? 0,
      items: kit?.kit_items ?? [],
    };
  });
  const targets = [...compartments, ...kits].sort((a, b) => a.sortOrder - b.sortOrder);
  const checkMap = new Map((checks ?? []).map((check: any) => [check.compartment_id ?? check.unit_kit_id, check.status]));
  const crewComplete = Boolean(crew?.locked && crew.provider_names?.trim());
  const completedCompartments = checks?.filter((check) => check.status === "completed").length ?? 0;
  const total = targets.length + 1;
  const previousCrewLocked = Boolean(previousCrew?.locked && previousCrew.provider_names?.trim());
  const previousExceptions = findPreviousExceptions(targets, previousArchive?.check_data);
  const previousArchiveIsOldFormat = previousArchive ? previousArchive.total_compartments <= targets.length : false;
  const previousTotal = previousArchive ? previousArchive.total_compartments + (previousArchiveIsOldFormat ? 1 : 0) : null;
  const previousCompleted = previousArchive ? previousArchive.completed_compartments + (previousArchiveIsOldFormat && previousCrewLocked ? 1 : 0) : null;

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

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-600">Exceptions for past check</p>
          {previousExceptions.length === 0 ? <p className="mt-1 font-bold text-green-700">No previous missing or below-par items found.</p> : null}
          {previousExceptions.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {previousExceptions.map((exception) => (
                <li key={`${exception.compartment}-${exception.item}`} className="rounded-2xl bg-red-50 px-4 py-3 font-semibold text-red-800">{exception.compartment} - {exception.item}: {exception.issue}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-600">Previous shift</p>
          <p className="mt-1 text-lg font-black">
            {previousArchive ? `${previousCompleted} of ${previousTotal} done (${previousArchive.completion_percentage}%)` : "No previous shift archive found"}
          </p>
        </div>

        {sectionComments && sectionComments.length > 0 ? (
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-700">Section Comments</p>
            <h2 className="mt-1 text-2xl font-black">Compartment & Kit Notes</h2>
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
            <h2 className="mt-1 text-2xl font-black">Unit Comments</h2>
            <p className="mt-2 text-sm text-slate-600">Optional notes for this unit checkoff. Only saved comments will appear on records and printed checksheets.</p>
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
    </main>
  );
}
