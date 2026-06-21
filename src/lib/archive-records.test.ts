import { describe, expect, it } from "vitest";
import { groupDailyUnitRecords, type DailyUnitRecord } from "@/lib/archive-records";

function record(date: string, unitNumber: number, completionPercentage: number, unitStatus = "in_service"): DailyUnitRecord {
  return {
    archiveId: null,
    date,
    shiftPeriod: "daily",
    operationalDate: date,
    shiftName: "A Shift",
    unitId: `unit-${unitNumber}`,
    unitName: `Unit ${unitNumber}`,
    unitStatus,
    archived: false,
    statusNote: "",
    archiveStatus: "current",
    checkStatus: completionPercentage > 95 ? "checked" : "incomplete",
    completedCompartments: completionPercentage > 95 ? 6 : 5,
    totalCompartments: 6,
    completionPercentage,
    exceptions: [],
    restockingList: [],
    sectionComments: [],
    providerNames: "Smith / Jones",
    comments: "",
    crewLocked: true,
    startedAt: null,
    submittedAt: null,
    lastActivityAt: null,
    timeToCompleteSeconds: null,
    checkedByName: "",
    hasArchive: false,
  };
}

describe("groupDailyUnitRecords", () => {
  it("counts the issue 117 near-complete day as 6/6", () => {
    const date = "2026-06-07";
    const records = [
      record(date, 1, 100),
      record(date, 2, 100),
      record(date, 3, 100),
      record(date, 4, 100),
      record(date, 5, 100),
      record(date, 6, 96),
      record(date, 7, 0, "out_of_service"),
    ];

    expect(groupDailyUnitRecords(records, [date])).toEqual([
      expect.objectContaining({
        date,
        completedInServiceUnits: 6,
        totalInServiceUnits: 6,
      }),
    ]);
  });
});
