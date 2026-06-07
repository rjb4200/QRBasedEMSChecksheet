import { createAdminClient } from "@/lib/supabase/server-admin";
import { refreshDailyUnitLedgers } from "@/lib/daily-unit-ledgers";
import { getCurrentShift, getShiftNameForDate } from "@/lib/shifts";
import { buildRestockingList, restockingListText, type RestockingGroup, type RestockingTarget } from "@/lib/restocking-list";

export type DailyUnitCheckStatus = "checked" | "incomplete" | "not_started" | "not_required";

export type DailyUnitException = {
  targetName: string;
  itemName: string;
  issue: string;
  actual: string;
  expected: string;
};

export type ArchiveSearchParams = {
  unitId?: string;
  from?: string;
  to?: string;
};

export type SectionComment = {
  sourceName: string;
  comment: string;
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
  checkStatus: DailyUnitCheckStatus;
  completedCompartments: number;
  totalCompartments: number;
  completionPercentage: number;
  exceptions: DailyUnitException[];
  restockingList: RestockingGroup[];
  sectionComments: SectionComment[];
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

export type DailyArchiveReport = {
  date: string;
  generatedAt: string;
  records: DailyUnitRecord[];
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
  compartment_id?: string | null;
  unit_kit_id?: string | null;
  status: string;
  completed_at?: string | null;
  updated_at?: string | null;
  item_data?: Record<string, unknown> | null;
  units?: UnitRow | UnitRow[] | null;
  unit_compartments?: { name: string } | { name: string }[] | null;
  unit_kits?: { kits: { name: string } | { name: string }[] | null } | { kits: { name: string } | { name: string }[] | null }[] | null;
};

type ItemRow = {
  id: string;
  par_level: number | null;
  input_type: "quantity" | "checkbox" | "condition";
  equipment_catalog: { name: string } | { name: string }[] | null;
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

type SectionCommentRow = {
  shift_date: string;
  shift_period: string;
  unit_id: string;
  source_name: string;
  comment: string;
};

type DailyRecordReadModelInput = {
  date: string;
  ledgers: LedgerRow[];
  archives: ArchiveRow[];
  crews: CrewRow[];
  checks: CheckRow[];
  comments: CommentRow[];
  sectionComments?: SectionCommentRow[];
  itemMap?: Map<string, ItemRow>;
  unitStatusMap?: Map<string, string>;
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

function latestCheckTimestamp(checks: CheckRow[]) {
  const timestamps = checks.flatMap((check) => [check.completed_at, check.updated_at]).filter(Boolean).map((value) => new Date(value as string).getTime()).filter(Number.isFinite);
  return timestamps.length > 0 ? new Date(Math.max(...timestamps)).toISOString() : null;
}

function getCheckStatus(record: { unitStatus: string; archived: boolean; completionPercentage: number; hasActivity: boolean }): DailyUnitCheckStatus {
  if (record.archived || record.unitStatus !== "in_service") return "not_required";
  if (record.completionPercentage > 95) return "checked";
  return record.hasActivity ? "incomplete" : "not_started";
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

function setFallbackUnit(units: Map<string, UnitRow>, unitId: string, unitName: string | undefined, unitStatus?: string) {
  if (!units.has(unitId)) {
    units.set(unitId, {
      id: unitId,
      name: unitName ?? "Unknown unit",
      status: unitStatus ?? "unknown",
    });
  }
}

function getCheckRestockingGroups(checks: CheckRow[], itemMap: Map<string, ItemRow>) {
  const targets: RestockingTarget[] = checks.map((check) => {
    const compartment = getSingleRow(check.unit_compartments);
    const unitKit = getSingleRow(check.unit_kits);
    const kit = getSingleRow(unitKit?.kits);
    const targetName = compartment?.name ?? (kit?.name ? `${kit.name} (Kit)` : "Unknown target");
    const itemIds = Object.keys(check.item_data ?? {});

    return {
      id: check.compartment_id ?? check.unit_kit_id ?? targetName,
      name: targetName,
      itemData: check.item_data ?? null,
      items: itemIds.flatMap((itemId) => {
        const item = itemMap.get(itemId);
        return item ? [{ ...item, id: itemId }] : [];
      }),
    };
  });

  return buildRestockingList(targets);
}

export function buildLedgerBackedDailyUnitRecords({ date, ledgers, archives, crews, checks, comments, sectionComments = [], itemMap = new Map(), unitStatusMap = new Map() }: DailyRecordReadModelInput) {
  const archiveMap = new Map(archives.map((archive) => [`${archive.unit_id}:${archive.shift_date}:${archive.shift_period}`, archive]));
  const crewMap = new Map(crews.map((crew) => [`${crew.unit_id}:${crew.shift_date}:${crew.shift_period}`, crew]));
  const commentMap = new Map(comments.map((comment) => [`${comment.unit_id}:${comment.shift_date}:${comment.shift_period}`, comment.comment?.trim() ?? ""]));
  const sectionCommentMap = new Map<string, SectionComment[]>();
  for (const sc of sectionComments) {
    const key = `${sc.unit_id}:${sc.shift_date}:${sc.shift_period}`;
    sectionCommentMap.set(key, [...(sectionCommentMap.get(key) ?? []), { sourceName: sc.source_name, comment: sc.comment }]);
  }
  const checkMap = new Map<string, CheckRow[]>();

  for (const check of checks) {
    const key = `${check.unit_id}:${check.shift_date}:${check.shift_period}`;
    checkMap.set(key, [...(checkMap.get(key) ?? []), check]);
  }

  return ledgers.map((ledger) => {
    const key = `${ledger.unit_id}:${date}:${ledger.shift_period}`;
    const archive = archiveMap.get(key);
    const crew = crewMap.get(key);
    const unitChecks = checkMap.get(key) ?? [];
    const comments = commentMap.get(key) ?? "";
    const crewLocked = Boolean(crew?.locked && crew.provider_names?.trim());
    const baseTotal = archive?.total_compartments ?? ledger.total_compartments;
    const baseCompleted = archive?.completed_compartments ?? unitChecks.filter((check) => check.status === "completed").length;
    const totalCompartments = baseTotal + 1;
    const completedCompartments = baseCompleted + (crewLocked ? 1 : 0);
    const completionPercentage = getCompletionPercentage(completedCompartments, totalCompartments);
    const unitStatus = ledger.unit_status || unitStatusMap.get(ledger.unit_id) || "unknown";
    const restockingList = getCheckRestockingGroups(unitChecks, itemMap);
    const exceptions = restockingList.flatMap((group) => group.entries.map((entry) => ({
      targetName: group.sourceName,
      itemName: entry.itemName,
      issue: entry.issue,
      actual: entry.actual,
      expected: entry.expected,
    })));
    const checkTimestamp = latestCheckTimestamp(unitChecks);
    const hasActivity = Boolean(archive || crewLocked || unitChecks.length > 0);
    const archived = Boolean(ledger.archived);
    const checkStatus = getCheckStatus({ unitStatus, archived, hasActivity, completionPercentage });

    return {
      archiveId: archive?.id ?? null,
      date,
      shiftPeriod: ledger.shift_period,
      operationalDate: archive?.operational_date ?? date,
      shiftName: getArchiveShiftName(archive, date),
      unitId: ledger.unit_id,
      unitName: ledger.unit_name,
      unitStatus,
      archived,
      statusNote: ledger.status_note ?? "",
      archiveStatus: archive?.status ?? (unitChecks.length > 0 ? "current" : "no_record"),
      checkStatus,
      completedCompartments,
      totalCompartments,
      completionPercentage,
      exceptions,
      restockingList,
      sectionComments: sectionCommentMap.get(key) ?? [],
      providerNames: crew?.provider_names ?? "",
      comments,
      crewLocked,
      startedAt: archive?.started_at ?? null,
      submittedAt: archive?.submitted_at ?? checkTimestamp,
      lastActivityAt: archive?.last_activity_at ?? checkTimestamp,
      timeToCompleteSeconds: archive?.time_to_complete_seconds ?? null,
      checkedByName: getArchiveCheckedBy(archive),
      hasArchive: Boolean(archive),
    } satisfies DailyUnitRecord;
  });
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

export async function getLedgerBackedDailyUnitRecordsForDate(params: { date: string; unitId?: string }) {
  const supabase = createAdminClient();
  const currentShift = getCurrentShift();

  if (params.date === currentShift.shiftDate) {
    await refreshDailyUnitLedgers(supabase, currentShift);
  }

  let ledgerQuery = supabase
    .from("daily_unit_ledgers")
    .select("id, shift_date, shift_period, unit_id, unit_name, unit_status, total_compartments, archived, status_note")
    .eq("shift_date", params.date)
    .eq("shift_period", "daily")
    .order("unit_name");

  let checksQuery = supabase
    .from("compartment_checks")
    .select("shift_date, shift_period, unit_id, compartment_id, unit_kit_id, status, completed_at, updated_at, item_data, unit_compartments(name), unit_kits(kits(name))")
    .eq("shift_date", params.date)
    .eq("shift_period", "daily");

  let crewsQuery = supabase
    .from("daily_unit_crews")
    .select("shift_date, shift_period, unit_id, provider_names, locked")
    .eq("shift_date", params.date)
    .eq("shift_period", "daily");

  let commentsQuery = supabase
    .from("daily_unit_comments")
    .select("shift_date, shift_period, unit_id, comment")
    .eq("shift_date", params.date)
    .eq("shift_period", "daily");

  let sectionCommentsQuery = supabase
    .from("daily_section_comments")
    .select("shift_date, shift_period, unit_id, source_name, comment")
    .eq("shift_date", params.date)
    .eq("shift_period", "daily")
    .order("source_name");

  let archivesQuery = supabase
    .from("shift_archives")
    .select("id, shift_date, shift_period, unit_id, status, completion_percentage, completed_compartments, total_compartments, operational_date, started_at, submitted_at, last_activity_at, time_to_complete_seconds, shift_calendar(shift_name), users(full_name, email), units(name)")
    .eq("shift_date", params.date)
    .eq("shift_period", "daily");

  if (params.unitId) {
    ledgerQuery = ledgerQuery.eq("unit_id", params.unitId);
    checksQuery = checksQuery.eq("unit_id", params.unitId);
    crewsQuery = crewsQuery.eq("unit_id", params.unitId);
    commentsQuery = commentsQuery.eq("unit_id", params.unitId);
    sectionCommentsQuery = sectionCommentsQuery.eq("unit_id", params.unitId);
    archivesQuery = archivesQuery.eq("unit_id", params.unitId);
  }

  const [{ data: ledgers }, { data: archives }, { data: crews }, { data: checks }, { data: comments }, { data: sectionComments }, { data: compartmentItems }, { data: kitItems }] = await Promise.all([
    ledgerQuery,
    archivesQuery,
    crewsQuery,
    checksQuery,
    commentsQuery,
    sectionCommentsQuery,
    supabase.from("unit_compartment_items").select("id, par_level, input_type, equipment_catalog(name)"),
    supabase.from("kit_items").select("id, par_level, input_type, equipment_catalog(name)"),
  ]);
  const itemMap = new Map([...(compartmentItems ?? []), ...(kitItems ?? [])].map((item) => [item.id, item as ItemRow]));

  return buildLedgerBackedDailyUnitRecords({
    date: params.date,
    ledgers: (ledgers ?? []) as LedgerRow[],
    archives: (archives ?? []) as ArchiveRow[],
    crews: (crews ?? []) as CrewRow[],
    checks: (checks ?? []) as CheckRow[],
    comments: (comments ?? []) as CommentRow[],
    sectionComments: (sectionComments ?? []) as SectionCommentRow[],
    itemMap,
  });
}

export async function getDailyUnitRecords(params: ArchiveSearchParams) {
  const range = getDefaultArchiveRange(params);
  const supabase = createAdminClient();
  const currentShift = getCurrentShift();

  if (range.from === range.to) {
    const records = await getLedgerBackedDailyUnitRecordsForDate({ date: range.from, unitId: params.unitId });
    const { data: units } = await supabase
      .from("units")
      .select("id, name, status, unit_compartments(id), unit_kits(id)")
      .is("deleted_at", null)
      .order("name");

    return { groups: groupDailyUnitRecords(records, [range.from]), range, records, units: (units ?? []) as UnitRow[] };
  }

  if (range.from <= currentShift.shiftDate && currentShift.shiftDate <= range.to) {
    await refreshDailyUnitLedgers(supabase, currentShift);
  }

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

  let sectionCommentsQuery = supabase
    .from("daily_section_comments")
    .select("shift_date, shift_period, unit_id, source_name, comment")
    .gte("shift_date", range.from)
    .lte("shift_date", range.to)
    .order("source_name");

  if (params.unitId) {
    sectionCommentsQuery = sectionCommentsQuery.eq("unit_id", params.unitId);
  }

  const [{ data: units }, { data: ledgers }, { data: archives }, { data: crews }, { data: checks }, { data: comments }, { data: sectionComments }] = await Promise.all([
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
    sectionCommentsQuery,
  ]);

  const unitRows = (units ?? []) as UnitRow[];
  const unitStatusMap = new Map(unitRows.map((u) => [u.id, u.status]));
  const ledgerRows = (ledgers ?? []) as LedgerRow[];
  const archiveRows = (archives ?? []) as ArchiveRow[];
  const checkRows = (checks ?? []) as CheckRow[];
  const archiveMap = new Map(archiveRows.map((archive) => [`${archive.unit_id}:${archive.shift_date}:${archive.shift_period}`, archive]));
  const crewMap = new Map(((crews ?? []) as CrewRow[]).map((crew) => [`${crew.unit_id}:${crew.shift_date}:${crew.shift_period}`, crew]));
  const commentMap = new Map(((comments ?? []) as CommentRow[]).map((comment) => [`${comment.unit_id}:${comment.shift_date}:${comment.shift_period}`, comment.comment?.trim() ?? ""]));
  const dates = eachDate(new Date(`${range.from}T00:00:00.000Z`), new Date(`${range.to}T00:00:00.000Z`)).reverse();
  const ledgerMap = new Map<string, LedgerRow[]>();
  const checkMap = new Map<string, CheckRow[]>();
  const sectionCommentMap = new Map<string, SectionComment[]>();
  for (const sc of (sectionComments ?? []) as SectionCommentRow[]) {
    const key = `${sc.unit_id}:${sc.shift_date}:${sc.shift_period}`;
    sectionCommentMap.set(key, [...(sectionCommentMap.get(key) ?? []), { sourceName: sc.source_name, comment: sc.comment }]);
  }
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
      records.push(...buildLedgerBackedDailyUnitRecords({
        date,
        ledgers: ledgersForDate,
        archives: archiveRows.filter((row) => row.shift_date === date),
        crews: ((crews ?? []) as CrewRow[]).filter((row) => row.shift_date === date),
        checks: checkRows.filter((row) => row.shift_date === date),
        comments: ((comments ?? []) as CommentRow[]).filter((row) => row.shift_date === date),
        sectionComments: ((sectionComments ?? []) as SectionCommentRow[]).filter((row) => row.shift_date === date),
        unitStatusMap,
      }));

      continue;
    }

    const fallbackUnits = new Map<string, UnitRow>();
    const checksForDate = checkRows.filter((row) => row.shift_date === date && row.shift_period === "daily");
    const archivesForDate = archiveRows.filter((row) => row.shift_date === date && row.shift_period === "daily");
    const crewsForDate = ((crews ?? []) as CrewRow[]).filter((row) => row.shift_date === date && row.shift_period === "daily");

    for (const check of checksForDate) {
      const checkedUnit = getSingleRow(check.units);
      setFallbackUnit(fallbackUnits, check.unit_id, checkedUnit?.name, unitStatusMap.get(check.unit_id));
    }

    for (const archive of archivesForDate) {
      const archivedUnit = getSingleRow(archive.units);
      setFallbackUnit(fallbackUnits, archive.unit_id, archivedUnit?.name, unitStatusMap.get(archive.unit_id));
    }

    for (const crew of crewsForDate) {
      const crewUnit = getSingleRow(crew.units);
      setFallbackUnit(fallbackUnits, crew.unit_id, crewUnit?.name, unitStatusMap.get(crew.unit_id));
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
        checkStatus: unit.status === "in_service" ? (completionPercentage > 95 ? "checked" : checksForUnit.length > 0 || crewLocked || archive ? "incomplete" : "not_started") : "not_required",
        completedCompartments,
        totalCompartments,
        completionPercentage,
        exceptions: [],
        restockingList: [],
        sectionComments: sectionCommentMap.get(`${unit.id}:${date}:daily`) ?? [],
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

export async function getTrendGroups() {
  const supabase = createAdminClient();
  const range = getDefaultArchiveRange({});
  const currentShift = getCurrentShift();

  if (range.from <= currentShift.shiftDate && currentShift.shiftDate <= range.to) {
    await refreshDailyUnitLedgers(supabase, currentShift);
  }

  const dates = eachDate(new Date(`${range.from}T00:00:00.000Z`), new Date(`${range.to}T00:00:00.000Z`)).reverse();

  const [{ data: ledgers }, { data: checks }, { data: crews }] = await Promise.all([
    supabase.from("daily_unit_ledgers").select("shift_date, unit_id, unit_status, total_compartments").gte("shift_date", range.from).lte("shift_date", range.to).eq("shift_period", "daily"),
    supabase.from("compartment_checks").select("shift_date, unit_id, status").gte("shift_date", range.from).lte("shift_date", range.to).eq("shift_period", "daily"),
    supabase.from("daily_unit_crews").select("shift_date, unit_id, provider_names, locked").gte("shift_date", range.from).lte("shift_date", range.to).eq("shift_period", "daily"),
  ]);

  const checkMap = new Map<string, { total: number; completed: number }>();
  for (const check of (checks ?? []) as { unit_id: string; shift_date: string; status: string }[]) {
    const key = `${check.unit_id}:${check.shift_date}`;
    const entry = checkMap.get(key) ?? { total: 0, completed: 0 };
    entry.total += 1;
    if (check.status === "completed") entry.completed += 1;
    checkMap.set(key, entry);
  }

  const crewMap = new Map<string, boolean>();
  for (const crew of (crews ?? []) as { unit_id: string; shift_date: string; provider_names: string | null; locked: boolean | null }[]) {
    const key = `${crew.unit_id}:${crew.shift_date}`;
    crewMap.set(key, Boolean(crew.locked && crew.provider_names?.trim()));
  }

  return dates.map((date) => {
    let completedInServiceUnits = 0;
    let totalInServiceUnits = 0;

    for (const ledger of (ledgers ?? []) as { shift_date: string; unit_id: string; unit_status: string; total_compartments: number }[]) {
      if (ledger.shift_date !== date || ledger.unit_status !== "in_service") continue;

      totalInServiceUnits += 1;

      const checkCounts = checkMap.get(`${ledger.unit_id}:${date}`) ?? { total: 0, completed: 0 };
      const crewLocked = crewMap.get(`${ledger.unit_id}:${date}`) ?? false;

      const totalCompartments = ledger.total_compartments + 1;
      const completedCompartments = checkCounts.completed + (crewLocked ? 1 : 0);
      const pct = totalCompartments === 0 ? 0 : Math.round((completedCompartments / totalCompartments) * 10000) / 100;

      if (pct > 95) completedInServiceUnits += 1;
    }

    return { date, completedInServiceUnits, totalInServiceUnits, records: [] };
  }) satisfies DailyRecordGroup[];
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
    "Restocking List",
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
      restockingListText(record.restockingList),
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
