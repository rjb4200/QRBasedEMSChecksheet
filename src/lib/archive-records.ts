import { createAdminClient } from "@/lib/supabase/server-admin";

export type ArchiveSearchParams = {
  unitId?: string;
  from?: string;
  to?: string;
};

export type DailyUnitRecord = {
  archiveId: string | null;
  date: string;
  shiftPeriod: string;
  unitId: string;
  unitName: string;
  unitStatus: string;
  archiveStatus: string;
  completedCompartments: number;
  totalCompartments: number;
  completionPercentage: number;
  providerNames: string;
  crewLocked: boolean;
  hasArchive: boolean;
};

export type DailyRecordGroup = {
  date: string;
  completedInServiceUnits: number;
  totalInServiceUnits: number;
  records: DailyUnitRecord[];
};

type UnitRow = {
  id: string;
  name: string;
  status: string;
  unit_compartments?: { id: string }[] | null;
};

type LedgerRow = {
  id: string;
  shift_date: string;
  shift_period: string;
  unit_id: string;
  unit_name: string;
  unit_status: string;
  total_compartments: number;
};

type ArchiveRow = {
  id: string;
  shift_date: string;
  shift_period: string;
  unit_id: string;
  status: string;
  completion_percentage: number | null;
  completed_compartments: number | null;
  total_compartments: number | null;
};

type CrewRow = {
  shift_date: string;
  shift_period: string;
  unit_id: string;
  provider_names: string | null;
  locked: boolean | null;
};

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseDateInput(value: string | undefined, fallback: Date) {
  if (!value) {
    return fallback;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function eachDate(from: Date, to: Date) {
  const dates: string[] = [];
  for (let current = from; current <= to; current = addDays(current, 1)) {
    dates.push(toDateInputValue(current));
  }
  return dates;
}

export function getDefaultArchiveRange(params: ArchiveSearchParams) {
  const today = new Date();
  const defaultTo = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const defaultFrom = addDays(defaultTo, -13);
  let from = parseDateInput(params.from, defaultFrom);
  let to = parseDateInput(params.to, defaultTo);

  if (from > to) {
    [from, to] = [to, from];
  }

  return {
    from: toDateInputValue(from),
    to: toDateInputValue(to),
  };
}

export async function getDailyUnitRecords(params: ArchiveSearchParams) {
  const range = getDefaultArchiveRange(params);
  const supabase = createAdminClient();
  let unitsQuery = supabase
    .from("units")
    .select("id, name, status, unit_compartments(id)")
    .is("deleted_at", null)
    .order("name");

  if (params.unitId) {
    unitsQuery = unitsQuery.eq("id", params.unitId);
  }

  let ledgerQuery = supabase
    .from("daily_unit_ledgers")
    .select("id, shift_date, shift_period, unit_id, unit_name, unit_status, total_compartments")
    .gte("shift_date", range.from)
    .lte("shift_date", range.to)
    .order("shift_date", { ascending: false })
    .order("unit_name");

  if (params.unitId) {
    ledgerQuery = ledgerQuery.eq("unit_id", params.unitId);
  }

  const [{ data: units }, { data: ledgers }, { data: archives }, { data: crews }] = await Promise.all([
    unitsQuery,
    ledgerQuery,
    supabase
      .from("shift_archives")
      .select("id, shift_date, shift_period, unit_id, status, completion_percentage, completed_compartments, total_compartments")
      .gte("shift_date", range.from)
      .lte("shift_date", range.to)
      .order("shift_date", { ascending: false }),
    supabase
      .from("daily_unit_crews")
      .select("shift_date, shift_period, unit_id, provider_names, locked")
      .gte("shift_date", range.from)
      .lte("shift_date", range.to),
  ]);

  const unitRows = (units ?? []) as UnitRow[];
  const ledgerRows = (ledgers ?? []) as LedgerRow[];
  const archiveRows = (archives ?? []) as ArchiveRow[];
  const archiveMap = new Map(archiveRows.map((archive) => [`${archive.unit_id}:${archive.shift_date}:${archive.shift_period}`, archive]));
  const crewMap = new Map(((crews ?? []) as CrewRow[]).map((crew) => [`${crew.unit_id}:${crew.shift_date}:${crew.shift_period}`, crew]));
  const dates = eachDate(new Date(`${range.from}T00:00:00.000Z`), new Date(`${range.to}T00:00:00.000Z`)).reverse();
  const ledgerMap = new Map<string, LedgerRow[]>();
  const records: DailyUnitRecord[] = [];

  for (const ledger of ledgerRows) {
    const key = `${ledger.shift_date}:${ledger.shift_period}`;
    ledgerMap.set(key, [...(ledgerMap.get(key) ?? []), ledger]);
  }

  for (const date of dates) {
    for (const ledger of ledgerMap.get(`${date}:daily`) ?? []) {
      const archive = archiveMap.get(`${ledger.unit_id}:${date}:daily`);
      const crew = crewMap.get(`${ledger.unit_id}:${date}:daily`);
      const crewLocked = Boolean(crew?.locked && crew.provider_names?.trim());
      const baseTotal = archive?.total_compartments ?? ledger.total_compartments;
      const baseCompleted = archive?.completed_compartments ?? 0;
      const totalCompartments = baseTotal + 1;
      const completedCompartments = baseCompleted + (crewLocked ? 1 : 0);
      const completionPercentage = totalCompartments === 0 ? 0 : Math.round((completedCompartments / totalCompartments) * 10000) / 100;

      records.push({
        archiveId: archive?.id ?? null,
        date,
        shiftPeriod: archive?.shift_period ?? "daily",
        unitId: ledger.unit_id,
        unitName: ledger.unit_name,
        unitStatus: ledger.unit_status,
        archiveStatus: archive?.status ?? "no_record",
        completedCompartments,
        totalCompartments,
        completionPercentage,
        providerNames: crew?.provider_names ?? "",
        crewLocked,
        hasArchive: Boolean(archive),
      });
    }
  }

  return { groups: groupDailyUnitRecords(records, dates), range, records, units: unitRows };
}

export function groupDailyUnitRecords(records: DailyUnitRecord[], dates?: string[]) {
  const groups = new Map<string, DailyRecordGroup>();

  for (const date of dates ?? []) {
    groups.set(date, {
      date,
      completedInServiceUnits: 0,
      totalInServiceUnits: 0,
      records: [],
    });
  }

  for (const record of records) {
    const group = groups.get(record.date) ?? {
      date: record.date,
      completedInServiceUnits: 0,
      totalInServiceUnits: 0,
      records: [],
    };

    if (record.unitStatus === "in_service") {
      group.totalInServiceUnits += 1;
      if (record.archiveStatus === "completed" || record.completionPercentage >= 100) {
        group.completedInServiceUnits += 1;
      }
    }

    group.records.push(record);
    groups.set(record.date, group);
  }

  return Array.from(groups.values());
}

export function archiveRecordToCsv(records: DailyUnitRecord[]) {
  const headers = [
    "Date",
    "Shift Period",
    "Unit",
    "Unit Status",
    "Archive Status",
    "Completed Compartments",
    "Total Compartments",
    "Completion Percentage",
    "Crew Names",
    "Crew Locked",
    "Archive ID",
  ];

  const escapeCell = (value: string | number | null) => {
    const text = String(value ?? "");
    return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };

  return [
    headers.join(","),
    ...records.map((record) => [
      record.date,
      record.shiftPeriod,
      record.unitName,
      record.unitStatus,
      record.archiveStatus,
      record.completedCompartments,
      record.totalCompartments,
      record.completionPercentage,
      record.providerNames,
      record.crewLocked ? "yes" : "no",
      record.archiveId,
    ].map(escapeCell).join(",")),
  ].join("\n");
}
