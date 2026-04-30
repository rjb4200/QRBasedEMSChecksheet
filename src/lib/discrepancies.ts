import { getCurrentShift } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";

export type CheckoffDiscrepancy = {
  unitId: string;
  unitName: string;
  compartmentId: string;
  compartmentName: string;
  itemId: string;
  itemName: string;
  inputType: "quantity" | "checkbox";
  expected: number | true;
  actual: number | false;
};

type CheckRow = {
  unit_id: string;
  compartment_id: string;
  item_data: Record<string, unknown> | null;
  units: { name: string } | { name: string }[] | null;
  unit_compartments: { name: string } | { name: string }[] | null;
};

type ItemRow = {
  id: string;
  compartment_id: string;
  par_level: number | null;
  input_type: "quantity" | "checkbox" | "condition";
  equipment_catalog: { name: string } | { name: string }[] | null;
};

function single<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function getCheckoffDiscrepancies(shift = getCurrentShift()) {
  const supabase = createAdminClient();
  const [{ data: checks, error: checksError }, { data: items, error: itemsError }] = await Promise.all([
    supabase
      .from("compartment_checks")
      .select("unit_id, compartment_id, item_data, units(name), unit_compartments(name)")
      .eq("shift_date", shift.shiftDate)
      .eq("shift_period", shift.shiftPeriod)
      .eq("status", "completed"),
    supabase
      .from("unit_compartment_items")
      .select("id, compartment_id, par_level, input_type, equipment_catalog(name)"),
  ]);

  if (checksError) throw new Error(checksError.message);
  if (itemsError) throw new Error(itemsError.message);

  const itemMap = new Map((items ?? []).map((item) => [item.id, item as ItemRow]));
  const discrepancies: CheckoffDiscrepancy[] = [];

  for (const check of (checks ?? []) as CheckRow[]) {
    const unit = single(check.units);
    const compartment = single(check.unit_compartments);

    for (const [itemId, value] of Object.entries(check.item_data ?? {})) {
      const item = itemMap.get(itemId);
      if (!item) continue;

      const equipment = single(item.equipment_catalog);
      const base = {
        unitId: check.unit_id,
        unitName: unit?.name ?? "Unknown unit",
        compartmentId: check.compartment_id,
        compartmentName: compartment?.name ?? "Unknown compartment",
        itemId,
        itemName: equipment?.name ?? "Unknown item",
      };

      if (item.input_type === "checkbox" && value === false) {
        discrepancies.push({ ...base, inputType: "checkbox", expected: true, actual: false });
      }

      if (item.input_type === "quantity" && item.par_level !== null && Number(value) < item.par_level) {
        discrepancies.push({ ...base, inputType: "quantity", expected: item.par_level, actual: Number(value) });
      }
    }
  }

  return discrepancies.sort((a, b) => `${a.unitName}${a.compartmentName}${a.itemName}`.localeCompare(`${b.unitName}${b.compartmentName}${b.itemName}`));
}
