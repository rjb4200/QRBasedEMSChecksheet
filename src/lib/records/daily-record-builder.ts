import { getShiftNameForDate } from "@/lib/shifts";
import { getCheckRestockingGroups } from "@/lib/records/daily-record-restocking";
import { getSingleRow } from "@/lib/records/row-utils";
import type { ArchiveRow, CheckRow, DailyRecordReadModelInput, DailyUnitCheckStatus, DailyUnitRecord, SectionComment } from "@/lib/records/types";

export function getCompletionPercentage(completedCompartments: number, totalCompartments: number) {
  return totalCompartments === 0 ? 0 : Math.round((completedCompartments / totalCompartments) * 10000) / 100;
}

export function latestCheckTimestamp(checks: CheckRow[]) {
  const timestamps = checks.flatMap((check) => [check.completed_at, check.updated_at]).filter(Boolean).map((value) => new Date(value as string).getTime()).filter(Number.isFinite);
  return timestamps.length > 0 ? new Date(Math.max(...timestamps)).toISOString() : null;
}

export function getCheckStatus(record: { unitStatus: string; archived: boolean; completionPercentage: number; hasActivity: boolean }): DailyUnitCheckStatus {
  if (record.archived || record.unitStatus !== "in_service") return "not_required";
  if (record.completionPercentage > 95) return "checked";
  return record.hasActivity ? "incomplete" : "not_started";
}

export function getArchiveShiftName(archive: ArchiveRow | undefined, date: string) {
  return getSingleRow(archive?.shift_calendar)?.shift_name ?? getShiftNameForDate(archive?.operational_date ?? date);
}

export function getArchiveCheckedBy(archive: ArchiveRow | undefined) {
  const user = getSingleRow(archive?.users);
  return user?.full_name ?? user?.email ?? "";
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
