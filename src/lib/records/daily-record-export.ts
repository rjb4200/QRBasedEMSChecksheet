import { restockingListText } from "@/lib/restocking-list";
import { formatDuration } from "@/lib/records/date-range";
import type { DailyUnitRecord } from "@/lib/records/types";

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
