import { beforeEach, describe, expect, it, vi } from "vitest";

const { createAdminClient, getCurrentShift, mockFrom, mockRpc, queryResults } = vi.hoisted(() => {
  const queryResults: Array<{ data: unknown[] | null; error: { message: string } | null }> = [];
  const mockFrom = vi.fn((table: string) => {
    const query = {
      table,
      select: vi.fn(() => query),
      in: vi.fn(() => query),
      eq: vi.fn(() => query),
      then: (resolve: (value: { data: unknown[] | null; error: { message: string } | null }) => void) => {
        resolve(queryResults.shift() ?? { data: [], error: null });
      },
    };
    return query;
  });
  return {
    createAdminClient: vi.fn(() => ({ from: mockFrom, rpc: vi.fn() })),
    getCurrentShift: vi.fn(() => ({ shiftDate: "2026-07-20", shiftPeriod: "daily" as const })),
    mockFrom,
    mockRpc: vi.fn(),
    queryResults,
  };
});

vi.mock("@/lib/supabase/server-admin", () => ({ createAdminClient }));
vi.mock("@/lib/shifts", () => ({
  getCurrentShift,
  getShiftNameForDate: vi.fn(),
}));

import { getDailyCheckoffSummaries } from "@/lib/records/daily-checkoff-summary";

describe("getDailyCheckoffSummaries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryResults.length = 0;
    createAdminClient.mockReturnValue({ from: mockFrom, rpc: mockRpc });
    mockRpc.mockResolvedValue({ error: null });
  });

  it("reads the Records trend from daily summaries rather than operational tables", async () => {
    queryResults.push({
      data: [{
        shift_date: "2026-07-20",
        summary_state: "live",
        completed_actions: 5,
        required_actions: 6,
        completed_units: 1,
        required_units: 2,
      }],
      error: null,
    });

    await expect(getDailyCheckoffSummaries(2)).resolves.toEqual([
      { date: "2026-07-20", state: "live", completedActions: 5, requiredActions: 6, completedUnits: 1, requiredUnits: 2 },
      { date: "2026-07-19", state: "unavailable", completedActions: 0, requiredActions: 0, completedUnits: 0, requiredUnits: 0 },
    ]);

    expect(mockRpc).toHaveBeenCalledWith("start_daily_checkoff_summary", {
      p_shift_date: "2026-07-20",
      p_shift_period: "daily",
    });
    expect(mockFrom).toHaveBeenCalledTimes(1);
    expect(mockFrom).toHaveBeenCalledWith("daily_checkoff_summaries");
    expect(mockFrom).not.toHaveBeenCalledWith("daily_unit_ledgers");
    expect(mockFrom).not.toHaveBeenCalledWith("compartment_checks");
    expect(mockFrom).not.toHaveBeenCalledWith("daily_unit_crews");
  });
});
