import type { DailyRecordGroup, DailyUnitRecord } from "@/lib/records/types";

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
