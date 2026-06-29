import { getArchiveCheckedBy, getArchiveShiftName, getCompletionPercentage } from "@/lib/records/daily-record-builder";
import { getSingleRow } from "@/lib/records/row-utils";
import type { ArchiveRow, CheckRow, CommentRow, CrewRow, DailyUnitRecord, SectionComment, SectionCommentRow, UnitRow } from "@/lib/records/types";

function setFallbackUnit(units: Map<string, UnitRow>, unitId: string, unitName: string | undefined, unitStatus?: string) {
  if (!units.has(unitId)) {
    units.set(unitId, {
      id: unitId,
      name: unitName ?? "Unknown unit",
      status: unitStatus ?? "unknown",
    });
  }
}

export function buildFallbackDailyUnitRecords(params: {
  date: string;
  archiveMap: Map<string, ArchiveRow>;
  crewMap: Map<string, CrewRow>;
  commentMap: Map<string, string>;
  checkMap: Map<string, CheckRow[]>;
  sectionCommentMap: Map<string, SectionComment[]>;
  checksForDate: CheckRow[];
  archivesForDate: ArchiveRow[];
  crewsForDate: CrewRow[];
  unitStatusMap: Map<string, string>;
}) {
  const { date, archiveMap, crewMap, commentMap, checkMap, sectionCommentMap, checksForDate, archivesForDate, crewsForDate, unitStatusMap } = params;
  const fallbackUnits = new Map<string, UnitRow>();

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

  const records: DailyUnitRecord[] = [];

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

  return records;
}

export function buildSectionCommentMap(sectionComments: SectionCommentRow[]) {
  const sectionCommentMap = new Map<string, SectionComment[]>();
  for (const sc of sectionComments) {
    const key = `${sc.unit_id}:${sc.shift_date}:${sc.shift_period}`;
    sectionCommentMap.set(key, [...(sectionCommentMap.get(key) ?? []), { sourceName: sc.source_name, comment: sc.comment }]);
  }
  return sectionCommentMap;
}

export function buildCommentMap(comments: CommentRow[]) {
  return new Map(comments.map((comment) => [`${comment.unit_id}:${comment.shift_date}:${comment.shift_period}`, comment.comment?.trim() ?? ""]));
}
