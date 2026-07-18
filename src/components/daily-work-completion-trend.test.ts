import { describe, expect, it } from "vitest";
import { formatWorkCompletionLabel } from "@/components/daily-work-completion-trend";

describe("DailyWorkCompletionTrend", () => {
  it("labels available days with action counts", () => {
    expect(formatWorkCompletionLabel({ date: "2026-07-01", state: "live", completedActions: 51, requiredActions: 58, completedUnits: 4, requiredUnits: 6 })).toBe("51/58 actions");
  });

  it("labels unavailable days distinctly", () => {
    expect(formatWorkCompletionLabel({ date: "2026-07-02", state: "unavailable", completedActions: 0, requiredActions: 0, completedUnits: 0, requiredUnits: 0 })).toBe("Unavailable");
  });
});
