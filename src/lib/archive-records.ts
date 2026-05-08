import { createAdminClient } from "@/lib/supabase/server-admin";
import { getShiftNameForDate } from "@/lib/shifts";

export type ArchiveSearchParams = {
  unitId?: string;
  from?: string;
  to?: string;
};

export type DailyUnitRecord = {
  archiveId: string | null;
  date: string;
  shiftPeriod: string;
  operationalDate: string;
  shiftName: string;
  unitId: string;
  unitName: string;
  unitStatus: string;
  archived: boolean;
  statusNote: string;
  archiveStatus: string;
  completedCompartments: number;
  totalCompartments: number;
  completionPercentage: number;
  providerNames: string;
  comments: string;
  crewLocked: boolean;
  startedAt: string | null;
  submittedAt: string | null;
  lastActivityAt: string | null;
  timeToCompleteSeconds: number | null;
  checkedByName: string;
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
  unit_kits?: { id: string }[] | null;
};

type LedgerRow = {
  id: string;
  shift_date: string;
  shift_period: string;
  unit_id: string;
  unit_name: string;
  unit_status: string;
  total_compartments: number;
  archived: boolean | null;
  status_note: string | null;
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
  operational_date: string | null;
  started_at: string | null;
  submitted_at: string | null;
  last_activity_at: string | null;
  time_to_complete_seconds: number | null;
  shift_calendar?: { shift_name: string } | { shift_name: string }[] | null;
  users?: { full_name: string | null; email: string | null } | { full_name: string | null; email: string | null }[] | null;
  units?: { name: string } | { name: string }[] | null;
};

type CheckRow = {
  shift_date: string;
  shift_period: string;
  unit_id: string;
  status: string;
  units?: UnitRow | UnitRow[] | null;
};

type CrewRow = {
  shift_date: string;
  shift_period: string;
  unit_id: string;
  provider_names: string | null;
  locked: boolean | null;
  units?: { name: string } | { name: string }[] | null;
};

type CommentRow = {
  shift_date: string;
  shift_period: string;
  unit_id: string;
  comment: string | null;
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

function getSingleRow<T>(row: T | T[] | null | undefined) {
  return Array.isArray(row) ? row[0] : row;
}

function getCompletionPercentage(completedCompartments: number, totalCompartments: number) {
  return totalCompartments === 0 ? 0 : Math.round((completedCompartments / totalCompartments) * 10000) / 100;
}

export function formatDuration(seconds: number | null) {
  if (seconds === null) return "";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) return `${remainingSeconds}s`;
  if (remainingSeconds === 0) return `${minutes}m`;
  return `${minutes}m ${remainingSeconds}s`;
}

function getArchiveShiftName(archive: ArchiveRow | undefined, date: string) {
  return getSingleRow(archive?.shift_calendar)?.shift_name ?? getShiftNameForDate(archive?.operational_date ?? date);
}

function getArchiveCheckedBy(archive: ArchiveRow | undefined) {
  const user = getSingleRow(archive?.users);
  return user?.full_name ?? user?.email ?? "";
}

function setFallbackUnit(units: Map<string, UnitRow>, unitId: string, unitName: string | undefined) {
  if (!units.has(unitId)) {
    units.set(unitId, {
      id: unitId,
      name: unitName ?? "Unknown unit",
      status: "unknown",
    });
  }
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
    .select("id, name, status, unit_compartments(id), unit_kits(id)")
    .is("deleted_at", null)
    .order("name");

  if (params.unitId) {
    unitsQuery = unitsQuery.eq("id", params.unitId);
  }

  let ledgerQuery = supabase
    .from("daily_unit_ledgers")
    .select("id, shift_date, shift_period, unit_id, unit_name, unit_status, total_compartments, archived, status_note")
    .gte("shift_date", range.from)
    .lte("shift_date", range.to)
    .order("shift_date", { ascending: false })
    .order("unit_name");

  if (params.unitId) {
    ledgerQuery = ledgerQuery.eq("unit_id", params.unitId);
  }

  let checksQuery = supabase
    .from("compartment_checks")
    .select("shift_date, shift_period, unit_id, status, units(id, name, status, unit_compartments(id), unit_kits(id))")
    .gte("shift_date", range.from)
    .lte("shift_date", range.to);

  if (params.unitId) {
    checksQuery = checksQuery.eq("unit_id", params.unitId);
  }

  let commentsQuery = supabase
    .from("daily_unit_comments")
    .select("shift_date, shift_period, unit_id, comment")
    .gte("shift_date", range.from)
    .lte("shift_date", range.to);

  if (params.unitId) {
    commentsQuery = commentsQuery.eq("unit_id", params.unitId);
  }

  const [{ data: units }, { data: ledgers }, { data: archives }, { data: crews }, { data: checks }, { data: comments }] = await Promise.all([
    unitsQuery,
    ledgerQuery,
    supabase
      .from("shift_archives")
      .select("id, shift_date, shift_period, unit_id, status, completion_percentage, completed_compartments, total_compartments, operational_date, started_at, submitted_at, last_activity_at, time_to_complete_seconds, shift_calendar(shift_name), users(full_name, email), units(name)")
      .gte("shift_date", range.from)
      .lte("shift_date", range.to)
      .order("shift_date", { ascending: false }),
    supabase
      .from("daily_unit_crews")
      .select("shift_date, shift_period, unit_id, provider_names, locked, units(name)")
      .gte("shift_date", range.from)
      .lte("shift_date", range.to),
    checksQuery,
    commentsQuery,
  ]);

  const unitRows = (units ?? []) as UnitRow[];
  const ledgerRows = (ledgers ?? []) as LedgerRow[];
  const archiveRows = (archives ?? []) as ArchiveRow[];
  const checkRows = (checks ?? []) as CheckRow[];
  const archiveMap = new Map(archiveRows.map((archive) => [`${archive.unit_id}:${archive.shift_date}:${archive.shift_period}`, archive]));
  const crewMap = new Map(((crews ?? []) as CrewRow[]).map((crew) => [`${crew.unit_id}:${crew.shift_date}:${crew.shift_period}`, crew]));
  const commentMap = new Map(((comments ?? []) as CommentRow[]).map((comment) => [`${comment.unit_id}:${comment.shift_date}:${comment.shift_period}`, comment.comment?.trim() ?? ""]));
  const dates = eachDate(new Date(`${range.from}T00:00:00.000Z`), new Date(`${range.to}T00:00:00.000Z`)).reverse();
  const ledgerMap = new Map<string, LedgerRow[]>();
  const checkMap = new Map<string, CheckRow[]>();
  const records: DailyUnitRecord[] = [];

  for (const ledger of ledgerRows) {
    const key = `${ledger.shift_date}:${ledger.shift_period}`;
    ledgerMap.set(key, [...(ledgerMap.get(key) ?? []), ledger]);
  }

  for (const check of checkRows) {
    const key = `${check.unit_id}:${check.shift_date}:${check.shift_period}`;
    checkMap.set(key, [...(checkMap.get(key) ?? []), check]);
  }

  for (const date of dates) {
    const ledgersForDate = ledgerMap.get(`${date}:daily`) ?? [];

    if (ledgersForDate.length > 0) {
      for (const ledger of ledgersForDate) {
        const archive = archiveMap.get(`${ledger.unit_id}:${date}:daily`);
        const crew = crewMap.get(`${ledger.unit_id}:${date}:daily`);
        const comments = commentMap.get(`${ledger.unit_id}:${date}:daily`) ?? "";
        const crewLocked = Boolean(crew?.locked && crew.provider_names?.trim());
        const baseTotal = archive?.total_compartments ?? ledger.total_compartments;
        const baseCompleted = archive?.completed_compartments ?? 0;
        const totalCompartments = baseTotal + 1;
        const completedCompartments = baseCompleted + (crewLocked ? 1 : 0);
        const completionPercentage = getCompletionPercentage(completedCompartments, totalCompartments);

        records.push({
          archiveId: archive?.id ?? null,
          date,
          shiftPeriod: archive?.shift_period ?? "daily",
          operationalDate: archive?.operational_date ?? date,
          shiftName: getArchiveShiftName(archive, date),
          unitId: ledger.unit_id,
          unitName: ledger.unit_name,
          unitStatus: ledger.unit_status,
          archived: Boolean(ledger.archived),
          statusNote: ledger.status_note ?? "",
          archiveStatus: archive?.status ?? "no_record",
          completedCompartments,
          totalCompartments,
          completionPercentage,
          providerNames: crew?.provider_names ?? "",
          comments,
          crewLocked,
          startedAt: archive?.started_at ?? null,
          submittedAt: archive?.submitted_at ?? null,
          lastActivityAt: archive?.last_activity_at ?? null,
          timeToCompleteSeconds: archive?.time_to_complete_seconds ?? null,
          checkedByName: getArchiveCheckedBy(archive),
          hasArchive: Boolean(archive),
        });
      }

      continue;
    }

    const fallbackUnits = new Map<string, UnitRow>();
    const checksForDate = checkRows.filter((row) => row.shift_date === date && row.shift_period === "daily");
    const archivesForDate = archiveRows.filter((row) => row.shift_date === date && row.shift_period === "daily");
    const crewsForDate = ((crews ?? []) as CrewRow[]).filter((row) => row.shift_date === date && row.shift_period === "daily");

    for (const check of checksForDate) {
      const checkedUnit = getSingleRow(check.units);
      setFallbackUnit(fallbackUnits, check.unit_id, checkedUnit?.name);
    }

    for (const archive of archivesForDate) {
      const archivedUnit = getSingleRow(archive.units);
      setFallbackUnit(fallbackUnits, archive.unit_id, archivedUnit?.name);
    }

    for (const crew of crewsForDate) {
      const crewUnit = getSingleRow(crew.units);
      setFallbackUnit(fallbackUnits, crew.unit_id, crewUnit?.name);
    }

    for (const unit of Array.from(fallbackUnits.values()).sort((a, b) => a.name.localeCompare(b.name))) {
      const archive = archiveMap.get(`${unit.id}:${date}:daily`);
      const crew = crewMap.get(`${unit.id}:${date}:daily`);
      const comments = commentMap.get(`${unit.id}:${date}:daily`) ?? "";
      const crewLocked = Boolean(crew?.locked && crew.provider_names?.trim());
      const checksForUnit = checkMap.get(`${unit.id}:${date}:daily`) ?? [];
      const baseTotal = archive?.total_compartments ?? checksForUnit.length;
      const baseCompleted = archive?.completed_compartments ?? checksForUnit.filter((check) => check.status === "completed").length;
      const totalCompartments = baseTotal + 1;
      const completedCompartments = baseCompleted + (crewLocked ? 1 : 0);
      const completionPercentage = getCompletionPercentage(completedCompartments, totalCompartments);

      records.push({
        archiveId: archive?.id ?? null,
        date,
        shiftPeriod: archive?.shift_period ?? "daily",
        operationalDate: archive?.operational_date ?? date,
        shiftName: getArchiveShiftName(archive, date),
        unitId: unit.id,
        unitName: unit.name,
        unitStatus: unit.status,
        archived: false,
        statusNote: "",
        archiveStatus: archive?.status ?? "no_record",
        completedCompartments,
        totalCompartments,
        completionPercentage,
        providerNames: crew?.provider_names ?? "",
        comments,
        crewLocked,
        startedAt: archive?.started_at ?? null,
        submittedAt: archive?.submitted_at ?? null,
        lastActivityAt: archive?.last_activity_at ?? null,
        timeToCompleteSeconds: archive?.time_to_complete_seconds ?? null,
        checkedByName: getArchiveCheckedBy(archive),
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
      if (record.completionPercentage > 95) {
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
    "Operational Date",
    "Shift",
    "Shift Period",
    "Unit",
    "Unit Status",
    "Archived",
    "Status Note",
    "Archive Status",
    "Completed Compartments",
    "Total Compartments",
    "Completion Percentage",
    "Crew Names",
    "Comments",
    "Crew Locked",
    "Started At",
    "Submitted At",
    "Last Activity At",
    "Duration",
    "Checked By",
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
      record.operationalDate,
      record.shiftName,
      record.shiftPeriod,
      record.unitName,
      record.unitStatus,
      record.archived ? "yes" : "no",
      record.statusNote,
      record.archiveStatus,
      record.completedCompartments,
      record.totalCompartments,
      record.completionPercentage,
      record.providerNames,
      record.comments,
      record.crewLocked ? "yes" : "no",
      record.startedAt,
      record.submittedAt,
      record.lastActivityAt,
      formatDuration(record.timeToCompleteSeconds),
      record.checkedByName,
      record.archiveId,
    ].map(escapeCell).join(",")),
  ].join("\n");
}
