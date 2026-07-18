import { describe, expect, it } from "vitest";
import { buildDailyWorkCompletionTrend } from "@/lib/records/daily-work-completion-trend";

describe("Daily Check Work Completion trend", () => {
  it("reports 100% when every required action is complete", () => {
    const date = "2026-06-30";
    const result = buildDailyWorkCompletionTrend({
      dates: [date],
      ledgers: [{ shift_date: date, unit_id: "unit-1", unit_status: "in_service", total_compartments: 1 }],
      checks: [{ shift_date: date, unit_id: "unit-1", compartment_id: "target-1", unit_kit_id: null, status: "completed" }],
      crews: [{ shift_date: date, unit_id: "unit-1", provider_names: "Crew", locked: true }],
    });

    expect(result).toEqual([{ date, state: "available", completedWork: 2, requiredWork: 2, percentage: 100 }]);
  });

  it("counts completed targets and crew locks against required work", () => {
    const date = "2026-07-01";
    const result = buildDailyWorkCompletionTrend({
      dates: [date],
      ledgers: [
        { shift_date: date, unit_id: "unit-1", unit_status: "in_service", total_compartments: 28 },
        { shift_date: date, unit_id: "unit-2", unit_status: "in_service", total_compartments: 28 },
      ],
      checks: Array.from({ length: 49 }, (_, index) => ({ shift_date: date, unit_id: index < 28 ? "unit-1" : "unit-2", compartment_id: `target-${index}`, unit_kit_id: null, status: "completed" })),
      crews: [
        { shift_date: date, unit_id: "unit-1", provider_names: "Crew One", locked: true },
        { shift_date: date, unit_id: "unit-2", provider_names: "Crew Two", locked: true },
      ],
    });

    expect(result).toEqual([{ date, state: "available", completedWork: 51, requiredWork: 58, percentage: 88 }]);
  });

  it("deduplicates completed targets and excludes out-of-service units", () => {
    const date = "2026-07-02";
    const result = buildDailyWorkCompletionTrend({
      dates: [date],
      ledgers: [
        { shift_date: date, unit_id: "in-service", unit_status: "in_service", total_compartments: 1 },
        { shift_date: date, unit_id: "out-of-service", unit_status: "out_of_service", total_compartments: 20 },
      ],
      checks: [
        { shift_date: date, unit_id: "in-service", compartment_id: "target-1", unit_kit_id: null, status: "completed" },
        { shift_date: date, unit_id: "in-service", compartment_id: "target-1", unit_kit_id: null, status: "completed" },
        { shift_date: date, unit_id: "out-of-service", compartment_id: "target-2", unit_kit_id: null, status: "completed" },
      ],
      crews: [{ shift_date: date, unit_id: "out-of-service", provider_names: "Crew", locked: true }],
    });

    expect(result).toEqual([{ date, state: "available", completedWork: 1, requiredWork: 2, percentage: 50 }]);
  });

  it("counts normalized target identities when legacy target columns are unavailable", () => {
    const date = "2026-07-02";
    const result = buildDailyWorkCompletionTrend({
      dates: [date],
      ledgers: [{ shift_date: date, unit_id: "unit-1", unit_status: "in_service", total_compartments: 1 }],
      checks: [{ shift_date: date, unit_id: "unit-1", target_type: "compartment", target_id: "target-1", compartment_id: null, unit_kit_id: null, status: "completed" }],
      crews: [{ shift_date: date, unit_id: "unit-1", provider_names: "Crew", locked: true }],
    });

    expect(result).toEqual([{ date, state: "available", completedWork: 2, requiredWork: 2, percentage: 100 }]);
  });

  it("distinguishes unavailable, zero-completion, and not-applicable days", () => {
    const result = buildDailyWorkCompletionTrend({
      dates: ["2026-07-03", "2026-07-04", "2026-07-05"],
      ledgers: [
        { shift_date: "2026-07-04", unit_id: "unit-1", unit_status: "in_service", total_compartments: 2 },
        { shift_date: "2026-07-05", unit_id: "unit-2", unit_status: "out_of_service", total_compartments: 2 },
      ],
      checks: [],
      crews: [],
    });

    expect(result).toEqual([
      { date: "2026-07-03", state: "unavailable", completedWork: 0, requiredWork: 0, percentage: null },
      { date: "2026-07-04", state: "available", completedWork: 0, requiredWork: 3, percentage: 0 },
      { date: "2026-07-05", state: "not_applicable", completedWork: 0, requiredWork: 0, percentage: null },
    ]);
  });
});
