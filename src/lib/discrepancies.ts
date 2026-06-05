import { getCurrentShift } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";

export type CheckoffDiscrepancy = {
  shiftDate: string;
  unitId: string;
  unitName: string;
  compartmentId: string;
  compartmentName: string;
  itemId: string;
  itemName: string;
  inputType: "quantity" | "checkbox" | "condition";
  expected: number | true | "OK";
  actual: number | false | string;
};

type CheckRow = {
  shift_date: string;
  unit_id: string;
  compartment_id: string | null;
  unit_kit_id: string | null;
  item_data: Record<string, unknown> | null;
  units: { name: string } | { name: string }[] | null;
  unit_compartments: { name: string } | { name: string }[] | null;
  unit_kits: { kits: { name: string } | { name: string }[] | null } | { kits: { name: string } | { name: string }[] | null }[] | null;
};

type ItemRow = {
  id: string;
  par_level: number | null;
  input_type: "quantity" | "checkbox" | "condition";
  equipment_catalog: { name: string } | { name: string }[] | null;
};

function single<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function getDefaultDiscrepancyRange() {
  const { shiftDate } = getCurrentShift();
  const to = new Date(`${shiftDate}T00:00:00.000Z`);
  const from = addDays(to, -6);
  return { from: toDateInputValue(from), to: shiftDate };
}

function parseDateInput(value: string | undefined, fallback: string) {
  if (!value) return fallback;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? fallback : toDateInputValue(parsed);
}

export function getDiscrepancyRange(params: { from?: string; to?: string }) {
  const defaults = getDefaultDiscrepancyRange();
  let from = parseDateInput(params.from, defaults.from);
  let to = parseDateInput(params.to, defaults.to);

  if (from > to) {
    [from, to] = [to, from];
  }

  return { from, to };
}

function eachDate(from: string, to: string) {
  const dates: string[] = [];
  for (let current = new Date(`${from}T00:00:00.000Z`); current <= new Date(`${to}T00:00:00.000Z`); current = addDays(current, 1)) {
    dates.push(toDateInputValue(current));
  }
  return dates.reverse();
}

export async function getCheckoffDiscrepanciesForRange(from: string, to: string, shiftPeriod = "daily" as const) {
  const supabase = createAdminClient();
  const [{ data: checks, error: checksError }, { data: items, error: itemsError }, { data: kitItems, error: kitItemsError }] = await Promise.all([
    supabase
      .from("compartment_checks")
      .select("shift_date, unit_id, compartment_id, unit_kit_id, item_data, units(name), unit_compartments(name), unit_kits(kits(name))")
      .gte("shift_date", from)
      .lte("shift_date", to)
      .eq("shift_period", shiftPeriod)
      .eq("status", "completed"),
    supabase
      .from("unit_compartment_items")
      .select("id, par_level, input_type, equipment_catalog(name)"),
    supabase
      .from("kit_items")
      .select("id, par_level, input_type, equipment_catalog(name)"),
  ]);

  if (checksError) throw new Error(checksError.message);
  if (itemsError) throw new Error(itemsError.message);
  if (kitItemsError) throw new Error(kitItemsError.message);

  const itemMap = new Map([...(items ?? []), ...(kitItems ?? [])].map((item) => [item.id, item as ItemRow]));
  const discrepancies: CheckoffDiscrepancy[] = [];

  for (const check of (checks ?? []) as CheckRow[]) {
    const unit = single(check.units);
    const compartment = single(check.unit_compartments);
    const unitKit = single(check.unit_kits);
    const kit = single(unitKit?.kits);
    const targetId = check.compartment_id ?? check.unit_kit_id ?? "";
    const targetName = compartment?.name ?? (kit?.name ? `${kit.name} (Kit)` : "Unknown target");

    for (const [itemId, value] of Object.entries(check.item_data ?? {})) {
      const item = itemMap.get(itemId);
      if (!item) continue;

      const equipment = single(item.equipment_catalog);
      const base = {
        shiftDate: check.shift_date,
        unitId: check.unit_id,
        unitName: unit?.name ?? "Unknown unit",
        compartmentId: targetId,
        compartmentName: targetName,
        itemId,
        itemName: equipment?.name ?? "Unknown item",
      };

      if (item.input_type === "checkbox" && value === false) {
        discrepancies.push({ ...base, inputType: "checkbox", expected: true, actual: false });
      }

      if (item.input_type === "quantity" && item.par_level !== null && Number(value) < item.par_level) {
        discrepancies.push({ ...base, inputType: "quantity", expected: item.par_level, actual: Number(value) });
      }

      if (item.input_type === "condition" && typeof value === "object" && value !== null && (value as { status?: string }).status !== "OK") {
        discrepancies.push({
          ...base,
          inputType: "condition",
          expected: "OK",
          actual: (value as { status?: string }).status ?? "Unknown",
        });
      }
    }
  }

  return discrepancies.sort((a, b) => `${b.shiftDate}${a.unitName}${a.compartmentName}${a.itemName}`.localeCompare(`${a.shiftDate}${b.unitName}${b.compartmentName}${b.itemName}`));
}

export function groupDiscrepanciesByDate(discrepancies: CheckoffDiscrepancy[], range?: { from: string; to: string }) {
  const groups = new Map<string, CheckoffDiscrepancy[]>();
  for (const date of range ? eachDate(range.from, range.to) : []) {
    groups.set(date, []);
  }
  for (const discrepancy of discrepancies) {
    groups.set(discrepancy.shiftDate, [...(groups.get(discrepancy.shiftDate) ?? []), discrepancy]);
  }
  return Array.from(groups.entries()).map(([date, items]) => ({ date, items }));
}

export function discrepancyRecordsToCsv(discrepancies: CheckoffDiscrepancy[]) {
  const headers = ["Date", "Unit", "Compartment", "Item", "Issue", "Actual", "Expected"];
  const escapeCell = (value: string | number | boolean) => {
    const text = String(value);
    return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };

  return [
    headers.join(","),
    ...discrepancies.map((item) => [
      item.shiftDate,
      item.unitName,
      item.compartmentName,
      item.itemName,
      item.inputType === "checkbox" ? "Missing" : item.inputType === "condition" ? "Condition issue" : "Below par",
      item.actual,
      item.expected,
    ].map(escapeCell).join(",")),
  ].join("\n");
}
