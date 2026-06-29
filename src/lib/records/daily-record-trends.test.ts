import { describe, expect, it } from "vitest";
import { buildTrendGroupsFromRows } from "@/lib/records/daily-record-trends";

describe("Daily Readiness trend groups", () => {
  it("uses the same strict completion threshold as records grouping", () => {
    const date = "2026-06-07";
    const groups = buildTrendGroupsFromRows({
      dates: [date],
      ledgers: [
        { shift_date: date, unit_id: "unit-1", unit_status: "in_service", total_compartments: 5 },
        { shift_date: date, unit_id: "unit-2", unit_status: "in_service", total_compartments: 5 },
      ],
      checks: [
        ...Array.from({ length: 5 }, () => ({ shift_date: date, unit_id: "unit-1", status: "completed" })),
        ...Array.from({ length: 4 }, () => ({ shift_date: date, unit_id: "unit-2", status: "completed" })),
      ],
      crews: [
        { shift_date: date, unit_id: "unit-1", provider_names: "Smith / Jones", locked: true },
        { shift_date: date, unit_id: "unit-2", provider_names: "Smith / Jones", locked: true },
      ],
    });

    expect(groups).toEqual([{ date, completedInServiceUnits: 1, totalInServiceUnits: 2, records: [] }]);
  });

  it("excludes not-required units from trend denominators", () => {
    const date = "2026-06-08";
    const groups = buildTrendGroupsFromRows({
      dates: [date],
      ledgers: [
        { shift_date: date, unit_id: "unit-1", unit_status: "in_service", total_compartments: 1 },
        { shift_date: date, unit_id: "unit-2", unit_status: "out_of_service", total_compartments: 1 },
      ],
      checks: [
        { shift_date: date, unit_id: "unit-1", status: "completed" },
        { shift_date: date, unit_id: "unit-2", status: "completed" },
      ],
      crews: [
        { shift_date: date, unit_id: "unit-1", provider_names: "Smith / Jones", locked: true },
        { shift_date: date, unit_id: "unit-2", provider_names: "Smith / Jones", locked: true },
      ],
    });

    expect(groups).toEqual([{ date, completedInServiceUnits: 1, totalInServiceUnits: 1, records: [] }]);
  });
});
