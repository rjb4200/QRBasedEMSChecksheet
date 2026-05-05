import { getCurrentShift } from "@/lib/shifts";
type SupabaseClient = any;

type UnitRow = {
  id: string;
  name: string;
  unit_kind: string;
  status: string;
  unit_compartments?: { id: string }[] | null;
  unit_kits?: { id: string }[] | null;
};

type CheckRow = {
  unit_id: string;
  status: string;
};

type CrewRow = {
  unit_id: string;
  provider_names: string | null;
  locked: boolean | null;
};

export async function getFleetStatus(supabase: SupabaseClient) {
  const shift = getCurrentShift();

  const [{ data: units }, { data: checks }, { data: crews }] = await Promise.all([
    supabase.from("units").select("id, name, unit_kind, status, unit_compartments(id), unit_kits(id)").is("deleted_at", null).order("name"),
    supabase.from("compartment_checks").select("unit_id, status").eq("shift_date", shift.shiftDate).eq("shift_period", shift.shiftPeriod),
    supabase.from("daily_unit_crews").select("unit_id, provider_names, locked").eq("shift_date", shift.shiftDate).eq("shift_period", shift.shiftPeriod),
  ]);

  const unitRows = (units ?? []) as UnitRow[];
  const checkRows = (checks ?? []) as CheckRow[];
  const crewMap = new Map(((crews ?? []) as CrewRow[]).map((crew) => [crew.unit_id, Boolean(crew.locked && crew.provider_names?.trim())]));

  return unitRows.map((unit) => {
    const total = (unit.unit_compartments?.length ?? 0) + (unit.unit_kits?.length ?? 0) + 1;
    const completed = checkRows.filter((check) => check.unit_id === unit.id && check.status === "completed").length + (crewMap.get(unit.id) ? 1 : 0);
    const inProgress = checkRows.filter((check) => check.unit_id === unit.id && check.status === "in_progress").length;
    return {
      ...unit,
      total,
      completed,
      inProgress,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  });
}
