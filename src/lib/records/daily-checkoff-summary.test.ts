import { describe, expect, it } from "vitest";
import { buildShiftCompletionAverages } from "@/lib/records/daily-checkoff-summary";

describe("buildShiftCompletionAverages", () => {
  it("uses the calendar assignment and action-weighted totals", () => {
    const averages = buildShiftCompletionAverages([
      { date: "2026-05-08", completedActions: 80, requiredActions: 100 },
      { date: "2026-05-11", completedActions: 9, requiredActions: 10 },
    ], new Map([["2026-05-08", "2nd Shift"]]));

    expect(averages).toEqual([
      { shiftName: "1st Shift", completedActions: 9, requiredActions: 10, percentage: 90 },
      { shiftName: "2nd Shift", completedActions: 80, requiredActions: 100, percentage: 80 },
      { shiftName: "3rd Shift", completedActions: 0, requiredActions: 0, percentage: null },
    ]);
  });

  it("falls back to the configured rotation and excludes no-work days", () => {
    const averages = buildShiftCompletionAverages([
      { date: "2026-05-09", completedActions: 0, requiredActions: 0 },
      { date: "2026-05-10", completedActions: 50, requiredActions: 100 },
    ], new Map());

    expect(averages.find((average) => average.shiftName === "3rd Shift")).toMatchObject({ completedActions: 50, requiredActions: 100, percentage: 50 });
    expect(averages.find((average) => average.shiftName === "2nd Shift")?.percentage).toBeNull();
  });
});
