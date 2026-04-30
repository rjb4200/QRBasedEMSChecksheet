import { getCurrentShift } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";

export type ChecksheetItem = {
  name: string;
  inputType: string;
  expected: number | true | null;
  actual: unknown;
  status: "ok" | "missing" | "below_par" | "not_recorded";
};

export type ChecksheetCompartment = {
  id: string;
  name: string;
  checkStatus: string;
  completedAt: string | null;
  items: ChecksheetItem[];
};

export type ChecksheetUnit = {
  id: string;
  name: string;
  status: string;
  providerNames: string;
  archiveStatus: string;
  completedCompartments: number;
  totalCompartments: number;
  compartments: ChecksheetCompartment[];
};

export type DailyChecksheetDocument = {
  date: string;
  shiftPeriod: string;
  generatedAt: string;
  units: ChecksheetUnit[];
};

type UnitRow = {
  id: string;
  name: string;
  status: string;
  unit_compartments?: CompartmentRow[] | null;
};

type CompartmentRow = {
  id: string;
  name: string;
  sort_order: number | null;
  unit_compartment_items?: UnitItemRow[] | null;
};

type UnitItemRow = {
  id: string;
  par_level: number | null;
  input_type: "quantity" | "checkbox" | "condition";
  equipment_catalog: { name: string } | { name: string }[] | null;
};

type CheckRow = {
  compartment_id: string;
  status: string;
  completed_at: string | null;
  item_data: Record<string, unknown> | null;
};

type ArchiveRow = {
  unit_id: string;
  status: string;
  completed_compartments: number | null;
  total_compartments: number | null;
  check_data: unknown;
};

type LedgerRow = {
  unit_id: string;
  unit_name: string;
  unit_status: string;
  total_compartments: number;
};

type CrewRow = {
  unit_id: string;
  provider_names: string;
};

function single<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function itemStatus(item: UnitItemRow, actual: unknown): ChecksheetItem["status"] {
  if (actual === undefined || actual === null || actual === "") return "not_recorded";
  if (item.input_type === "checkbox") return actual === false ? "missing" : "ok";
  if (item.input_type === "quantity" && item.par_level !== null) return Number(actual) < item.par_level ? "below_par" : "ok";
  return "ok";
}

function itemExpected(item: UnitItemRow) {
  if (item.input_type === "checkbox") return true;
  if (item.input_type === "quantity") return item.par_level;
  return null;
}

export async function getDailyChecksheetDocument(date = getCurrentShift().shiftDate): Promise<DailyChecksheetDocument> {
  const supabase = createAdminClient();
  const [{ data: units }, { data: ledgers }, { data: archives }, { data: checks }, { data: crews }] = await Promise.all([
    supabase
      .from("units")
      .select("id, name, status, unit_compartments(id, name, sort_order, unit_compartment_items(id, par_level, input_type, equipment_catalog(name)))")
      .order("name"),
    supabase
      .from("daily_unit_ledgers")
      .select("unit_id, unit_name, unit_status, total_compartments")
      .eq("shift_date", date)
      .eq("shift_period", "daily")
      .order("unit_name"),
    supabase
      .from("shift_archives")
      .select("unit_id, status, completed_compartments, total_compartments, check_data")
      .eq("shift_date", date)
      .eq("shift_period", "daily"),
    supabase
      .from("compartment_checks")
      .select("unit_id, compartment_id, status, completed_at, item_data")
      .eq("shift_date", date)
      .eq("shift_period", "daily"),
    supabase
      .from("daily_unit_crews")
      .select("unit_id, provider_names")
      .eq("shift_date", date)
      .eq("shift_period", "daily"),
  ]);

  const unitRows = (units ?? []) as UnitRow[];
  const unitMap = new Map(unitRows.map((unit) => [unit.id, unit]));
  const ledgerRows = (ledgers ?? []) as LedgerRow[];
  const archiveMap = new Map(((archives ?? []) as ArchiveRow[]).map((archive) => [archive.unit_id, archive]));
  const crewMap = new Map(((crews ?? []) as CrewRow[]).map((crew) => [crew.unit_id, crew.provider_names]));
  const currentCheckMap = new Map<string, CheckRow[]>();

  for (const check of (checks ?? []) as (CheckRow & { unit_id: string })[]) {
    currentCheckMap.set(check.unit_id, [...(currentCheckMap.get(check.unit_id) ?? []), check]);
  }

  const unitSources = ledgerRows.length > 0
    ? ledgerRows.map((ledger) => ({ id: ledger.unit_id, name: ledger.unit_name, status: ledger.unit_status, totalCompartments: ledger.total_compartments }))
    : unitRows.map((unit) => ({ id: unit.id, name: unit.name, status: unit.status, totalCompartments: unit.unit_compartments?.length ?? 0 }));

  return {
    date,
    shiftPeriod: "daily",
    generatedAt: new Date().toISOString(),
    units: unitSources.map((source) => {
      const unit = unitMap.get(source.id);
      const archive = archiveMap.get(source.id);
      const savedChecks = Array.isArray(archive?.check_data) ? archive.check_data as CheckRow[] : currentCheckMap.get(source.id) ?? [];
      const checkMap = new Map(savedChecks.map((check) => [check.compartment_id, check]));
      const compartments = [...(unit?.unit_compartments ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

      return {
        id: source.id,
        name: source.name,
        status: source.status,
        providerNames: crewMap.get(source.id) ?? "",
        archiveStatus: archive?.status ?? (savedChecks.length > 0 ? "current" : "no_record"),
        completedCompartments: archive?.completed_compartments ?? savedChecks.filter((check) => check.status === "completed").length,
        totalCompartments: archive?.total_compartments ?? source.totalCompartments,
        compartments: compartments.map((compartment) => {
          const check = checkMap.get(compartment.id);
          const itemData = check?.item_data ?? {};
          return {
            id: compartment.id,
            name: compartment.name,
            checkStatus: check?.status ?? "not_started",
            completedAt: check?.completed_at ?? null,
            items: (compartment.unit_compartment_items ?? []).map((item) => {
              const equipment = single(item.equipment_catalog);
              const actual = itemData[item.id];
              return {
                name: equipment?.name ?? "Unknown item",
                inputType: item.input_type,
                expected: itemExpected(item),
                actual,
                status: itemStatus(item, actual),
              };
            }),
          };
        }),
      };
    }),
  };
}

export function detailedChecksheetsCsv(documents: DailyChecksheetDocument[]) {
  const headers = ["Date", "Unit", "Unit Status", "Compartment", "Check Status", "Item", "Input Type", "Actual", "Expected", "Item Status", "Completed At"];
  const escapeCell = (value: unknown) => {
    const text = String(value ?? "");
    return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };

  return [
    headers.join(","),
    ...documents.flatMap((document) => document.units.flatMap((unit) => unit.compartments.flatMap((compartment) => compartment.items.map((item) => [
      document.date,
      unit.name,
      unit.status,
      compartment.name,
      compartment.checkStatus,
      item.name,
      item.inputType,
      item.actual,
      item.expected,
      item.status,
      compartment.completedAt,
    ].map(escapeCell).join(","))))),
  ].join("\n");
}

export function detailedChecksheetCsv(document: DailyChecksheetDocument) {
  return detailedChecksheetsCsv([document]);
}
