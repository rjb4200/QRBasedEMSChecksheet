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
  hasArchive: boolean;
};

type UnitRow = {
  id: string;
  name: string;
  status: string;
  unit_compartments?: { id: string }[] | null;
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
  const defaultFrom = addDays(defaultTo, -364);
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
    .order("name");

  if (params.unitId) {
    unitsQuery = unitsQuery.eq("id", params.unitId);
  }

  const [{ data: units }, { data: archives }] = await Promise.all([
    unitsQuery,
    supabase
      .from("shift_archives")
      .select("id, shift_date, shift_period, unit_id, status, completion_percentage, completed_compartments, total_compartments")
      .gte("shift_date", range.from)
      .lte("shift_date", range.to)
      .order("shift_date", { ascending: false }),
  ]);

  const unitRows = (units ?? []) as UnitRow[];
  const archiveRows = (archives ?? []) as ArchiveRow[];
  const archiveMap = new Map(archiveRows.map((archive) => [`${archive.unit_id}:${archive.shift_date}:${archive.shift_period}`, archive]));
  const dates = eachDate(new Date(`${range.from}T00:00:00.000Z`), new Date(`${range.to}T00:00:00.000Z`)).reverse();
  const records: DailyUnitRecord[] = [];

  for (const date of dates) {
    for (const unit of unitRows) {
      const archive = archiveMap.get(`${unit.id}:${date}:daily`);
      const totalCompartments = archive?.total_compartments ?? unit.unit_compartments?.length ?? 0;
      const completedCompartments = archive?.completed_compartments ?? 0;

      records.push({
        archiveId: archive?.id ?? null,
        date,
        shiftPeriod: archive?.shift_period ?? "daily",
        unitId: unit.id,
        unitName: unit.name,
        unitStatus: unit.status,
        archiveStatus: archive?.status ?? "no_record",
        completedCompartments,
        totalCompartments,
        completionPercentage: archive?.completion_percentage ?? 0,
        hasArchive: Boolean(archive),
      });
    }
  }

  return { range, records, units: unitRows };
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
      record.archiveId,
    ].map(escapeCell).join(",")),
  ].join("\n");
}
