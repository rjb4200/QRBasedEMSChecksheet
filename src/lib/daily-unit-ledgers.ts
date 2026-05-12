import { getCurrentShift } from "@/lib/shifts";

type SupabaseClient = any;

type UnitStatus = "in_service" | "out_of_service";
type ShiftPeriod = "daily";

type LedgerUnit = {
  id: string;
  name: string;
  status: UnitStatus;
  unit_compartments?: { id: string }[] | null;
  unit_kits?: { id: string }[] | null;
};

function normalizeStatusNote(value: string | null | undefined) {
  const note = value?.trim();
  return note ? note.slice(0, 240) : null;
}

export function getExpectedSectionCount(unit: Pick<LedgerUnit, "unit_compartments" | "unit_kits">) {
  return (unit.unit_compartments?.length ?? 0) + (unit.unit_kits?.length ?? 0);
}

export function buildDailyUnitLedgerRows(units: LedgerUnit[], shift: { shiftDate: string; shiftPeriod: ShiftPeriod }) {
  return units.map((unit) => ({
    shift_date: shift.shiftDate,
    shift_period: shift.shiftPeriod,
    unit_id: unit.id,
    unit_name: unit.name,
    unit_status: unit.status,
    total_compartments: getExpectedSectionCount(unit),
    archived: false,
  }));
}

export async function refreshDailyUnitLedgers(
  supabase: SupabaseClient,
  shift: { shiftDate: string; shiftPeriod: ShiftPeriod } = getCurrentShift(),
) {
  const { data: units, error: unitsError } = await supabase
    .from("units")
    .select("id, name, status, unit_compartments(id), unit_kits(id)")
    .is("deleted_at", null)
    .order("name");

  if (unitsError) throw new Error(unitsError.message);

  const ledgerRows = buildDailyUnitLedgerRows((units ?? []) as LedgerUnit[], shift);

  if (ledgerRows.length === 0) {
    return { count: 0 };
  }

  const { error: ledgerError } = await supabase
    .from("daily_unit_ledgers")
    .upsert(ledgerRows, { onConflict: "shift_date,shift_period,unit_id" });

  if (ledgerError) throw new Error(ledgerError.message);

  return { count: ledgerRows.length };
}

export async function upsertTodayUnitLedger(
  supabase: SupabaseClient,
  unitId: string,
  options: { status?: UnitStatus; archived?: boolean; statusNote?: string | null } = {},
) {
  const { shiftDate, shiftPeriod } = getCurrentShift();
  const { data: unit, error: unitError } = await supabase
    .from("units")
    .select("id, name, status, unit_compartments(id), unit_kits(id)")
    .eq("id", unitId)
    .single();

  if (unitError) throw new Error(unitError.message);

  const { error: ledgerError } = await supabase.from("daily_unit_ledgers").upsert({
    shift_date: shiftDate,
    shift_period: shiftPeriod,
    unit_id: unit.id,
    unit_name: unit.name,
    unit_status: options.status ?? unit.status,
    total_compartments: getExpectedSectionCount(unit),
    archived: options.archived ?? false,
    status_note: normalizeStatusNote(options.statusNote),
  }, { onConflict: "shift_date,shift_period,unit_id" });

  if (ledgerError) throw new Error(ledgerError.message);
}
