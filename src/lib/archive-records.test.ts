import { describe, expect, it } from "vitest";
import { buildLedgerBackedDailyUnitRecords, groupDailyUnitRecords, type DailyUnitRecord } from "@/lib/archive-records";

const SHIFT_PERIOD = "daily";

function ledger(date: string, unitNumber: number, totalCompartments = 5, unitStatus = "in_service", archived = false) {
  return {
    id: `ledger-${date}-${unitNumber}`,
    shift_date: date,
    shift_period: SHIFT_PERIOD,
    unit_id: `unit-${unitNumber}`,
    unit_name: `Unit ${unitNumber}`,
    unit_status: unitStatus,
    total_compartments: totalCompartments,
    archived,
    status_note: null,
  };
}

function completedChecks(date: string, unitNumber: number, count: number) {
  return Array.from({ length: count }, (_, index) => ({
    shift_date: date,
    shift_period: SHIFT_PERIOD,
    unit_id: `unit-${unitNumber}`,
    compartment_id: `compartment-${unitNumber}-${index}`,
    unit_kit_id: null,
    status: "completed",
    completed_at: `${date}T12:${String(index).padStart(2, "0")}:00.000Z`,
    updated_at: `${date}T12:${String(index).padStart(2, "0")}:00.000Z`,
    item_data: null,
  }));
}

function crew(date: string, unitNumber: number, locked = true, providerNames = "Smith / Jones") {
  return {
    shift_date: date,
    shift_period: SHIFT_PERIOD,
    unit_id: `unit-${unitNumber}`,
    provider_names: providerNames,
    locked,
  };
}

function buildRecords(date: string, ledgers: ReturnType<typeof ledger>[], checks: ReturnType<typeof completedChecks>[number][], crews: ReturnType<typeof crew>[] = []) {
  return buildLedgerBackedDailyUnitRecords({
    date,
    ledgers,
    archives: [],
    crews,
    checks,
    comments: [],
  });
}

function groupFor(date: string, records: DailyUnitRecord[]) {
  return groupDailyUnitRecords(records, [date]).find((group) => group.date === date);
}

describe("Daily Readiness completion records", () => {
  it("groups the 2026-06-07 fixture as 5/6 under the strict completion rule", () => {
    const date = "2026-06-07";
    const ledgers = Array.from({ length: 6 }, (_, index) => ledger(date, index + 1));
    const checks = [
      ...completedChecks(date, 1, 5),
      ...completedChecks(date, 2, 5),
      ...completedChecks(date, 3, 5),
      ...completedChecks(date, 4, 5),
      ...completedChecks(date, 5, 5),
      ...completedChecks(date, 6, 4),
    ];
    const crews = Array.from({ length: 6 }, (_, index) => crew(date, index + 1));

    const records = buildRecords(date, ledgers, checks, crews);
    const group = groupFor(date, records);

    expect(records).toHaveLength(6);
    expect(records.find((record) => record.unitId === "unit-1")).toMatchObject({ completedCompartments: 6, totalCompartments: 6, completionPercentage: 100, checkStatus: "checked" });
    expect(records.find((record) => record.unitId === "unit-6")).toMatchObject({ completedCompartments: 5, totalCompartments: 6, completionPercentage: 83.33, checkStatus: "incomplete" });
    expect(group).toMatchObject({ completedInServiceUnits: 5, totalInServiceUnits: 6 });
  });

  it("groups the 2026-06-06 fixture as 2/6 under the strict completion rule", () => {
    const date = "2026-06-06";
    const ledgers = Array.from({ length: 6 }, (_, index) => ledger(date, index + 1));
    const checks = [
      ...completedChecks(date, 1, 5),
      ...completedChecks(date, 2, 5),
      ...completedChecks(date, 3, 3),
      ...completedChecks(date, 4, 2),
      ...completedChecks(date, 5, 1),
    ];
    const crews = [crew(date, 1), crew(date, 2), crew(date, 3), crew(date, 4), crew(date, 5)];

    const records = buildRecords(date, ledgers, checks, crews);
    const group = groupFor(date, records);

    expect(records.filter((record) => record.checkStatus === "checked")).toHaveLength(2);
    expect(records.find((record) => record.unitId === "unit-6")).toMatchObject({ completedCompartments: 0, completionPercentage: 0, checkStatus: "not_started" });
    expect(group).toMatchObject({ completedInServiceUnits: 2, totalInServiceUnits: 6 });
  });

  it("does not count out-of-service or archived units as required in-service units", () => {
    const date = "2026-06-08";
    const records = buildRecords(
      date,
      [ledger(date, 1), ledger(date, 2, 5, "out_of_service"), ledger(date, 3, 5, "archived", true)],
      [...completedChecks(date, 1, 5), ...completedChecks(date, 2, 5), ...completedChecks(date, 3, 5)],
      [crew(date, 1), crew(date, 2), crew(date, 3)],
    );
    const group = groupFor(date, records);

    expect(records.find((record) => record.unitId === "unit-2")?.checkStatus).toBe("not_required");
    expect(records.find((record) => record.unitId === "unit-3")?.checkStatus).toBe("not_required");
    expect(group).toMatchObject({ completedInServiceUnits: 1, totalInServiceUnits: 1 });
  });

  it("treats crew lock as one required completion section", () => {
    const date = "2026-06-09";
    const records = buildRecords(date, [ledger(date, 1, 4), ledger(date, 2, 4)], [...completedChecks(date, 1, 4), ...completedChecks(date, 2, 4)], [crew(date, 1)]);

    expect(records.find((record) => record.unitId === "unit-1")).toMatchObject({ completedCompartments: 5, totalCompartments: 5, completionPercentage: 100, checkStatus: "checked" });
    expect(records.find((record) => record.unitId === "unit-2")).toMatchObject({ completedCompartments: 4, totalCompartments: 5, completionPercentage: 80, checkStatus: "incomplete" });
  });

  it("returns safe zero groups for dates with no records", () => {
    expect(groupDailyUnitRecords([], ["2026-06-10"])).toEqual([{ date: "2026-06-10", completedInServiceUnits: 0, totalInServiceUnits: 0, records: [] }]);
  });
});
