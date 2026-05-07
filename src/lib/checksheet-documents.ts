import { formatDuration } from "@/lib/archive-records";
import { getCurrentShift, getShiftNameForDate } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";

export type ChecksheetItem = {
  name: string;
  inputType: string;
  expected: number | string | null;
  actual: unknown;
  status: "ok" | "missing" | "below_par" | "condition_issue" | "not_recorded";
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
  comments: string;
  archiveStatus: string;
  completedCompartments: number;
  totalCompartments: number;
  shiftName: string;
  startedAt: string | null;
  submittedAt: string | null;
  timeToCompleteSeconds: number | null;
  checkedByName: string;
  compartments: ChecksheetCompartment[];
};

export type DailyChecksheetDocument = {
  date: string;
  operationalDate: string;
  shiftName: string;
  shiftPeriod: string;
  generatedAt: string;
  units: ChecksheetUnit[];
};

type UnitRow = {
  id: string;
  name: string;
  status: string;
  created_at: string;
  deleted_at: string | null;
  unit_compartments?: CompartmentRow[] | null;
  unit_kits?: UnitKitRow[] | null;
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

type UnitKitRow = {
  id: string;
  sort_order: number | null;
  kits: { name: string; kit_items?: UnitItemRow[] | null } | { name: string; kit_items?: UnitItemRow[] | null }[] | null;
};

type CheckRow = {
  compartment_id: string | null;
  unit_kit_id: string | null;
  status: string;
  completed_at: string | null;
  item_data: Record<string, unknown> | null;
};

type ArchiveRow = {
  unit_id: string;
  status: string;
  completed_compartments: number | null;
  total_compartments: number | null;
  operational_date: string | null;
  started_at: string | null;
  submitted_at: string | null;
  time_to_complete_seconds: number | null;
  check_data: unknown;
  shift_calendar?: { shift_name: string } | { shift_name: string }[] | null;
  users?: { full_name: string | null; email: string | null } | { full_name: string | null; email: string | null }[] | null;
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
  locked: boolean | null;
};

type CommentRow = {
  unit_id: string;
  comment: string | null;
};

function single<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function itemStatus(item: UnitItemRow, actual: unknown): ChecksheetItem["status"] {
  if (actual === undefined || actual === null || actual === "") return "not_recorded";
  if (item.input_type === "checkbox") return actual === false ? "missing" : "ok";
  if (item.input_type === "quantity" && item.par_level !== null) return Number(actual) < item.par_level ? "below_par" : "ok";
  if (item.input_type === "condition" && typeof actual === "object" && actual !== null) {
    return (actual as { status?: string }).status === "OK" ? "ok" : "condition_issue";
  }
  return "ok";
}

function itemExpected(item: UnitItemRow) {
  if (item.input_type === "quantity") return item.par_level;
  if (item.input_type === "condition") return "OK";
  return null;
}

export function formatChecksheetValue(value: unknown) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  if (value === undefined || value === null || value === "") return "-";
  if (typeof value === "object") {
    const condition = value as { status?: string; value?: string };
    return condition.value ? `${condition.status ?? "Unknown"}: ${condition.value}` : condition.status ?? "Unknown";
  }
  return String(value);
}

function getArchiveShiftName(archive: ArchiveRow | undefined, date: string) {
  return single(archive?.shift_calendar)?.shift_name ?? getShiftNameForDate(archive?.operational_date ?? date);
}

function getArchiveCheckedBy(archive: ArchiveRow | undefined) {
  const user = single(archive?.users);
  return user?.full_name ?? user?.email ?? "";
}

export function formatChecksheetTimestamp(value: string | null) {
  return value ? new Date(value).toLocaleString("en-US", { timeZone: "America/New_York" }) : "Not recorded";
}

export async function getDailyChecksheetDocument(date = getCurrentShift().shiftDate): Promise<DailyChecksheetDocument> {
  const supabase = createAdminClient();
  const requestedStart = new Date(`${date}T00:00:00.000Z`);
  const requestedEnd = new Date(`${date}T23:59:59.999Z`);
  const [{ data: units }, { data: ledgers }, { data: archives }, { data: checks }, { data: crews }, { data: comments }] = await Promise.all([
    supabase
      .from("units")
      .select("id, name, status, created_at, deleted_at, unit_compartments(id, name, sort_order, unit_compartment_items(id, par_level, input_type, equipment_catalog(name))), unit_kits(id, sort_order, kits(name, kit_items(id, par_level, input_type, equipment_catalog(name))))")
      .order("name"),
    supabase
      .from("daily_unit_ledgers")
      .select("unit_id, unit_name, unit_status, total_compartments")
      .eq("shift_date", date)
      .eq("shift_period", "daily")
      .order("unit_name"),
    supabase
      .from("shift_archives")
      .select("unit_id, status, completed_compartments, total_compartments, operational_date, started_at, submitted_at, time_to_complete_seconds, check_data, shift_calendar(shift_name), users(full_name, email)")
      .eq("shift_date", date)
      .eq("shift_period", "daily"),
    supabase
      .from("compartment_checks")
      .select("unit_id, compartment_id, unit_kit_id, status, completed_at, item_data")
      .eq("shift_date", date)
      .eq("shift_period", "daily"),
    supabase
      .from("daily_unit_crews")
      .select("unit_id, provider_names, locked")
      .eq("shift_date", date)
      .eq("shift_period", "daily"),
    supabase
      .from("daily_unit_comments")
      .select("unit_id, comment")
      .eq("shift_date", date)
      .eq("shift_period", "daily"),
  ]);

  const unitRows = (units ?? []) as UnitRow[];
  const unitMap = new Map(unitRows.map((unit) => [unit.id, unit]));
  const ledgerRows = (ledgers ?? []) as LedgerRow[];
  const archiveMap = new Map(((archives ?? []) as ArchiveRow[]).map((archive) => [archive.unit_id, archive]));
  const crewMap = new Map(((crews ?? []) as CrewRow[]).map((crew) => [crew.unit_id, crew]));
  const commentMap = new Map(((comments ?? []) as CommentRow[]).map((comment) => [comment.unit_id, comment.comment?.trim() ?? ""]));
  const currentCheckMap = new Map<string, CheckRow[]>();

  for (const check of (checks ?? []) as (CheckRow & { unit_id: string })[]) {
    currentCheckMap.set(check.unit_id, [...(currentCheckMap.get(check.unit_id) ?? []), check]);
  }

  const unitsAvailableOnDate = unitRows.filter((unit) => new Date(unit.created_at) <= requestedEnd && (!unit.deleted_at || new Date(unit.deleted_at) >= requestedStart));
  const unitSources = ledgerRows.length > 0
    ? ledgerRows.map((ledger) => ({ id: ledger.unit_id, name: ledger.unit_name, status: ledger.unit_status, totalCompartments: ledger.total_compartments }))
    : unitsAvailableOnDate.map((unit) => ({ id: unit.id, name: unit.name, status: unit.status, totalCompartments: (unit.unit_compartments?.length ?? 0) + (unit.unit_kits?.length ?? 0) }));

  return {
    date,
    operationalDate: date,
    shiftName: getShiftNameForDate(date),
    shiftPeriod: "daily",
    generatedAt: new Date().toISOString(),
    units: unitSources.map((source) => {
      const unit = unitMap.get(source.id);
      const archive = archiveMap.get(source.id);
      const savedChecks = Array.isArray(archive?.check_data) ? archive.check_data as CheckRow[] : currentCheckMap.get(source.id) ?? [];
      const checkMap = new Map(savedChecks.map((check) => [check.compartment_id ?? check.unit_kit_id, check]));
      const targets = [
        ...(unit?.unit_compartments ?? []).map((compartment) => ({ id: compartment.id, name: compartment.name, sort_order: compartment.sort_order, items: compartment.unit_compartment_items ?? [] })),
        ...(unit?.unit_kits ?? []).map((assignment) => {
          const kit = single(assignment.kits);
          return { id: assignment.id, name: `${kit?.name ?? "Shared Kit"} (Kit)`, sort_order: assignment.sort_order, items: kit?.kit_items ?? [] };
        }),
      ].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

      return {
        id: source.id,
        name: source.name,
        status: source.status,
        providerNames: crewMap.get(source.id)?.provider_names ?? "",
        comments: commentMap.get(source.id) ?? "",
        archiveStatus: archive?.status ?? (savedChecks.length > 0 ? "current" : "no_record"),
        completedCompartments: archive?.completed_compartments ?? savedChecks.filter((check) => check.status === "completed").length,
        totalCompartments: archive?.total_compartments ?? source.totalCompartments,
        shiftName: getArchiveShiftName(archive, date),
        startedAt: archive?.started_at ?? null,
        submittedAt: archive?.submitted_at ?? null,
        timeToCompleteSeconds: archive?.time_to_complete_seconds ?? null,
        checkedByName: getArchiveCheckedBy(archive),
        compartments: targets.map((target) => {
          const check = checkMap.get(target.id);
          const itemData = check?.item_data ?? {};
          return {
            id: target.id,
            name: target.name,
            checkStatus: check?.status ?? "not_started",
            completedAt: check?.completed_at ?? null,
            items: (target.items ?? []).map((item) => {
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
  const headers = ["Date", "Shift", "Unit", "Unit Status", "Crew Names", "Comments", "Started At", "Submitted At", "Duration", "Checked By", "Compartment", "Check Status", "Item", "Input Type", "Actual", "Expected", "Item Status", "Completed At"];
  const escapeCell = (value: unknown) => {
    const text = String(value ?? "");
    return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };

  return [
    headers.join(","),
    ...documents.flatMap((document) => document.units.flatMap((unit) => unit.compartments.flatMap((compartment) => compartment.items.map((item) => [
      document.date,
      unit.shiftName,
      unit.name,
      unit.status,
      unit.providerNames,
      unit.comments,
      unit.startedAt,
      unit.submittedAt,
      formatDuration(unit.timeToCompleteSeconds),
      unit.checkedByName,
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
