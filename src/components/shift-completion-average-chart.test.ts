import { describe, expect, it } from "vitest";
import { getShiftAverageLabel } from "@/components/shift-completion-average-chart";

describe("ShiftCompletionAverageChart", () => {
  it("labels available and unavailable shift bars", () => {
    expect(getShiftAverageLabel({ shiftName: "1st Shift", completedActions: 72, requiredActions: 100, percentage: 72 })).toBe("1st Shift 72% complete");
    expect(getShiftAverageLabel({ shiftName: "2nd Shift", completedActions: 0, requiredActions: 0, percentage: null })).toBe("2nd Shift unavailable");
  });
});
