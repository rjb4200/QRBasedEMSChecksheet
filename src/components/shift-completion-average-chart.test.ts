import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ShiftCompletionAverageChart, { getLeadingShiftNames, getShiftAverageLabel } from "@/components/shift-completion-average-chart";

describe("ShiftCompletionAverageChart", () => {
  it("labels available and unavailable shift bars", () => {
    expect(getShiftAverageLabel({ shiftName: "1st Shift", completedActions: 72, requiredActions: 100, percentage: 72 })).toBe("1st Shift 72% complete");
    expect(getShiftAverageLabel({ shiftName: "2nd Shift", completedActions: 0, requiredActions: 0, percentage: null })).toBe("2nd Shift unavailable");
  });

  it("identifies a sole leading shift and tied leaders", () => {
    expect(getLeadingShiftNames([
      { shiftName: "1st Shift", completedActions: 72, requiredActions: 100, percentage: 72 },
      { shiftName: "2nd Shift", completedActions: 80, requiredActions: 100, percentage: 80 },
      { shiftName: "3rd Shift", completedActions: 75, requiredActions: 100, percentage: 75 },
    ])).toEqual(["2nd Shift"]);
    expect(getLeadingShiftNames([
      { shiftName: "1st Shift", completedActions: 80, requiredActions: 100, percentage: 80 },
      { shiftName: "2nd Shift", completedActions: 70, requiredActions: 100, percentage: 70 },
      { shiftName: "3rd Shift", completedActions: 80, requiredActions: 100, percentage: 80 },
    ])).toEqual(["1st Shift", "3rd Shift"]);
  });

  it("excludes unavailable shifts from leaders and renders the updated chart presentation", () => {
    const unavailable = [
      { shiftName: "1st Shift" as const, completedActions: 0, requiredActions: 0, percentage: null },
      { shiftName: "2nd Shift" as const, completedActions: 0, requiredActions: 0, percentage: null },
      { shiftName: "3rd Shift" as const, completedActions: 0, requiredActions: 0, percentage: null },
    ];
    expect(getLeadingShiftNames(unavailable)).toEqual([]);

    const markup = renderToStaticMarkup(createElement(ShiftCompletionAverageChart, {
      averages: [
        { shiftName: "1st Shift", completedActions: 80, requiredActions: 100, percentage: 80 },
        { shiftName: "2nd Shift", completedActions: 0, requiredActions: 0, percentage: null },
        { shiftName: "3rd Shift", completedActions: 80, requiredActions: 100, percentage: 80 },
      ],
    }));
    expect(markup).toContain("30 Day Average");
    expect(markup).not.toContain("Last 30 operational days");
    expect(markup).toContain("h-48");
    expect(markup).toContain("rounded-2xl");
    expect(markup).toContain(">80%</span>");
    expect(markup.match(/Highest completion/g)).toHaveLength(2);
  });
});
