import { getCurrentShift } from "@/lib/shifts";

type SupabaseClient = any;

type UnitStatus = "in_service" | "out_of_service";

function normalizeStatusNote(value: string | null | undefined) {
  const note = value?.trim();
  return note ? note.slice(0, 240) : null;
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
    total_compartments: (unit.unit_compartments?.length ?? 0) + (unit.unit_kits?.length ?? 0),
    archived: options.archived ?? false,
    status_note: normalizeStatusNote(options.statusNote),
  }, { onConflict: "shift_date,shift_period,unit_id" });

  if (ledgerError) throw new Error(ledgerError.message);
}
