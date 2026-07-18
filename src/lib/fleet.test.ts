import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/shifts", () => ({
  getCurrentShift: () => ({ shiftDate: "2026-07-18", shiftPeriod: "daily" }),
}));

import { getFleetStatus, invalidateFleetStatusCache } from "@/lib/fleet";

type Rows = Record<string, unknown[]>;

function response(data: unknown[]) {
  return Promise.resolve({ data });
}

function createSupabase(rows: Rows) {
  return {
    from(table: string) {
      const data = rows[table] ?? [];

      if (table === "units") {
        return { select: () => ({ is: () => ({ order: () => response(data) }) }) };
      }

      if (table === "daily_unit_ledgers") {
        return { select: () => ({ eq: () => ({ eq: () => ({ order: () => response(data) }) }) }) };
      }

      if (["compartment_checks", "daily_unit_crews", "daily_unit_comments"].includes(table)) {
        return { select: () => ({ eq: () => ({ eq: () => response(data) }) }) };
      }

      return { select: () => response(data) };
    },
  };
}

function unit(name: string) {
  return {
    id: name.toLowerCase(),
    name,
    unit_kind: "EC",
    status: "in_service",
    oos_at: null,
    oos_by_name: null,
    unit_compartments: [],
    unit_kits: [],
  };
}

afterEach(() => {
  invalidateFleetStatusCache();
});

describe("getFleetStatus", () => {
  it("keeps EC1 through EC7 ordered when only EC4 has a current-shift ledger", async () => {
    const units = Array.from({ length: 7 }, (_, index) => unit(`EC${index + 1}`));
    const ec4 = units[3];
    const supabase = createSupabase({
      units,
      daily_unit_ledgers: [{
        unit_id: ec4.id,
        unit_name: ec4.name,
        unit_status: "in_service",
        total_compartments: 0,
        archived: false,
        status_note: null,
      }],
    });

    const fleet = await getFleetStatus(supabase);

    expect(fleet.map((currentUnit) => currentUnit.name)).toEqual(["EC1", "EC2", "EC3", "EC4", "EC5", "EC6", "EC7"]);
    expect(fleet.find((currentUnit) => currentUnit.name === "EC4")?.status).toBe("in_service");
  });

  it("orders numbered unit names naturally", async () => {
    const fleet = await getFleetStatus(createSupabase({
      units: [unit("EC10"), unit("EC2")],
    }));

    expect(fleet.map((currentUnit) => currentUnit.name)).toEqual(["EC2", "EC10"]);
  });
});
