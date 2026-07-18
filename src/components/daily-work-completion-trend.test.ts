import { describe, expect, it } from "vitest";
import { getCompletionPercentage } from "@/components/daily-work-completion-trend";

describe("DailyWorkCompletionTrend", () => {
  it("calculates the completed height from required actions", () => {
    expect(getCompletionPercentage({ date: "2026-07-01", state: "live", completedActions: 51, requiredActions: 58, completedUnits: 4, requiredUnits: 6 })).toBe(88);
  });

  it("keeps zero completion distinct from unavailable work", () => {
    expect(getCompletionPercentage({ date: "2026-07-02", state: "live", completedActions: 0, requiredActions: 58, completedUnits: 0, requiredUnits: 6 })).toBe(0);
    expect(getCompletionPercentage({ date: "2026-07-03", state: "unavailable", completedActions: 0, requiredActions: 0, completedUnits: 0, requiredUnits: 0 })).toBeNull();
  });
});
