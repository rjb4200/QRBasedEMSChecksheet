import { refreshDailyUnitLedgers } from "@/lib/daily-unit-ledgers";
import { getCurrentShift } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { eachDate, getDefaultArchiveRange } from "@/lib/records/date-range";
import { buildLedgerBackedDailyUnitRecords } from "@/lib/records/daily-record-builder";
import { buildCommentMap, buildFallbackDailyUnitRecords, buildSectionCommentMap } from "@/lib/records/daily-record-fallback";
import { groupDailyUnitRecords } from "@/lib/records/daily-record-groups";
import type { ArchiveRow, ArchiveSearchParams, CheckRow, CommentRow, CrewRow, DailyUnitRecord, ItemRow, LedgerRow, SectionCommentRow, UnitRow } from "@/lib/records/types";

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
  const crewRows = (crews ?? []) as CrewRow[];
  const checkRows = (checks ?? []) as CheckRow[];
  const commentRows = (comments ?? []) as CommentRow[];
  const sectionCommentRows = (sectionComments ?? []) as SectionCommentRow[];
  const archiveMap = new Map(archiveRows.map((archive) => [`${archive.unit_id}:${archive.shift_date}:${archive.shift_period}`, archive]));
  const crewMap = new Map(crewRows.map((crew) => [`${crew.unit_id}:${crew.shift_date}:${crew.shift_period}`, crew]));
  const commentMap = buildCommentMap(commentRows);
  const dates = eachDate(new Date(`${range.from}T00:00:00.000Z`), new Date(`${range.to}T00:00:00.000Z`)).reverse();
  const ledgerMap = new Map<string, LedgerRow[]>();
  const checkMap = new Map<string, CheckRow[]>();
  const sectionCommentMap = buildSectionCommentMap(sectionCommentRows);
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
        crews: crewRows.filter((row) => row.shift_date === date),
        checks: checkRows.filter((row) => row.shift_date === date),
        comments: commentRows.filter((row) => row.shift_date === date),
        sectionComments: sectionCommentRows.filter((row) => row.shift_date === date),
        unitStatusMap,
      }));

      continue;
    }

    records.push(...buildFallbackDailyUnitRecords({
      date,
      archiveMap,
      crewMap,
      commentMap,
      checkMap,
      sectionCommentMap,
      checksForDate: checkRows.filter((row) => row.shift_date === date && row.shift_period === "daily"),
      archivesForDate: archiveRows.filter((row) => row.shift_date === date && row.shift_period === "daily"),
      crewsForDate: crewRows.filter((row) => row.shift_date === date && row.shift_period === "daily"),
      unitStatusMap,
    }));
  }

  return { groups: groupDailyUnitRecords(records, dates), range, records, units: unitRows };
}
