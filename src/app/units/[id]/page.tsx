import Link from "next/link";
import { saveUnitCrew } from "./actions";
import { ShiftResetWarning } from "./shift-reset-warning";
import { getCurrentShift, getPreviousShift, getShiftLabel } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";

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

function findPreviousExceptions(compartments: { id: string; name: string; unit_compartment_items?: UnitItem[] | null }[], checkData: unknown) {
  if (!Array.isArray(checkData)) return [];
  const checkMap = new Map(checkData.map((check: any) => [check.compartment_id, check.item_data ?? {}]));

  return compartments.flatMap((compartment) => (compartment.unit_compartment_items ?? []).flatMap((item) => {
    const value = checkMap.get(compartment.id)?.[item.id];
    if (item.input_type === "checkbox" && value === false) {
      return [{ compartment: compartment.name, item: equipmentName(item) ?? "Unknown item", issue: "Missing" }];
    }
    if (item.input_type === "quantity" && item.par_level !== null && Number(value) < item.par_level) {
      return [{ compartment: compartment.name, item: equipmentName(item) ?? "Unknown item", issue: `Below par (${value ?? "-"}/${item.par_level})` }];
    }
    return [];
  }));
}

export default async function UnitDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const currentShift = getCurrentShift();
  const previousShift = getPreviousShift();
  const [{ data: unit }, { data: checks }, { data: previousArchive }, { data: crew }] = await Promise.all([
    supabase.from("units").select("id, name, status, unit_compartments(id, name, sort_order, unit_compartment_items(id, par_level, input_type, equipment_catalog(name)))").eq("id", id).single(),
    supabase.from("compartment_checks").select("compartment_id, status").eq("unit_id", id).eq("shift_date", currentShift.shiftDate).eq("shift_period", currentShift.shiftPeriod),
    supabase.from("shift_archives").select("completed_compartments, total_compartments, completion_percentage, check_data").eq("unit_id", id).eq("shift_date", previousShift.shiftDate).eq("shift_period", previousShift.shiftPeriod).maybeSingle(),
    supabase.from("daily_unit_crews").select("provider_names").eq("unit_id", id).eq("shift_date", currentShift.shiftDate).eq("shift_period", currentShift.shiftPeriod).maybeSingle(),
  ]);
  const compartments = (unit?.unit_compartments ?? []).sort((a, b) => a.sort_order - b.sort_order);
  const checkMap = new Map((checks ?? []).map((check) => [check.compartment_id, check.status]));
  const completed = checks?.filter((check) => check.status === "completed").length ?? 0;
  const total = compartments.length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const previousExceptions = findPreviousExceptions(compartments, previousArchive?.check_data);

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

        <ShiftResetWarning />

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-600">Current progress</p>
              <p className="text-2xl font-black">{completed} of {total} compartments ({percentage}%)</p>
            </div>
            <div className="h-16 w-16 rounded-full bg-slate-950 p-2 text-center text-sm font-black text-white">
              <span className="flex h-full items-center justify-center">{percentage}%</span>
            </div>
          </div>
          <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-red-700" style={{ width: `${percentage}%` }} />
          </div>
        </div>

        <form action={saveUnitCrew} className="rounded-3xl bg-white p-5 shadow-sm">
          <input name="unitId" type="hidden" value={id} />
          <label className="text-sm font-semibold text-slate-600" htmlFor="providerNames">Crew / Providers checking this unit</label>
          <textarea className="mt-2 min-h-24 w-full rounded-2xl border border-slate-300 px-4 py-3 font-semibold" defaultValue={crew?.provider_names ?? ""} id="providerNames" name="providerNames" placeholder="Enter provider names" />
          <button className="mt-3 rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Save Crew Names</button>
        </form>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {compartments.map((compartment) => {
            const dbStatus = checkMap.get(compartment.id);
            const status = dbStatus === "completed" ? "green" : dbStatus === "in_progress" ? "yellow" : "grey";
            return (
              <div key={compartment.id} aria-label={`${compartment.name}: ${status}`} className={`rounded-3xl border-2 p-5 ${statusStyles[status]}`} role="status">
                <p className="text-xl font-black">{compartment.name}</p>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em]">{status === "grey" ? "Not Started" : status === "yellow" ? "In Progress" : "Completed"}</p>
              </div>
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
            {previousArchive ? `${previousArchive.completed_compartments} of ${previousArchive.total_compartments} done (${previousArchive.completion_percentage}%)` : "No previous shift archive found"}
          </p>
        </div>
      </section>
    </main>
  );
}
