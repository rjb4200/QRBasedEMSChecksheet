import { getCurrentShift } from "@/lib/shifts";
import type { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function getFleetStatus(supabase: SupabaseClient, unitKind?: string) {
  const shift = getCurrentShift();
  let unitQuery = supabase.from("units").select("id, name, unit_kind, status, unit_compartments(id)").order("name");
  if (unitKind) unitQuery = unitQuery.eq("unit_kind", unitKind);

  const [{ data: units }, { data: checks }] = await Promise.all([
    unitQuery,
    supabase.from("compartment_checks").select("unit_id, status").eq("shift_date", shift.shiftDate).eq("shift_period", shift.shiftPeriod),
  ]);

  return (units ?? []).map((unit) => {
    const total = unit.unit_compartments?.length ?? 0;
    const completed = (checks ?? []).filter((check) => check.unit_id === unit.id && check.status === "completed").length;
    const inProgress = (checks ?? []).filter((check) => check.unit_id === unit.id && check.status === "in_progress").length;
    return {
      ...unit,
      total,
      completed,
      inProgress,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  });
}
