import { describe, expect, it } from "vitest";
import { formatWorkCompletionLabel } from "@/components/daily-work-completion-trend";

describe("DailyWorkCompletionTrend", () => {
  it("labels available days with action counts", () => {
    expect(formatWorkCompletionLabel({ date: "2026-07-01", state: "available", completedWork: 51, requiredWork: 58, percentage: 88 })).toBe("51/58 actions");
  });

  it("labels unavailable and not-applicable days distinctly", () => {
    expect(formatWorkCompletionLabel({ date: "2026-07-02", state: "unavailable", completedWork: 0, requiredWork: 0, percentage: null })).toBe("Unavailable");
    expect(formatWorkCompletionLabel({ date: "2026-07-03", state: "not_applicable", completedWork: 0, requiredWork: 0, percentage: null })).toBe("N/A");
  });
});
