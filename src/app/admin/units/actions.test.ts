import { beforeEach, describe, expect, it, vi } from "vitest";

const { createAdminClient, getCurrentAdminLogActor, invalidateFleetStatusCache, logSystemEvent, revalidatePath, upsertTodayUnitLedger } = vi.hoisted(() => ({
  createAdminClient: vi.fn(),
  getCurrentAdminLogActor: vi.fn(),
  invalidateFleetStatusCache: vi.fn(),
  logSystemEvent: vi.fn(),
  revalidatePath: vi.fn(),
  upsertTodayUnitLedger: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("@/lib/supabase/server-admin", () => ({ createAdminClient }));
vi.mock("@/lib/system-log", () => ({ getCurrentAdminLogActor, logSystemEvent }));
vi.mock("@/lib/daily-unit-ledgers", () => ({ refreshDailyUnitLedgers: vi.fn(), upsertTodayUnitLedger }));
vi.mock("@/lib/fleet", () => ({ invalidateFleetStatusCache }));

import { toggleUnitStatus } from "./actions";

describe("toggleUnitStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCurrentAdminLogActor.mockResolvedValue({ actorName: "Chief" });
    upsertTodayUnitLedger.mockResolvedValue(undefined);
    logSystemEvent.mockResolvedValue(undefined);
  });

  it("invalidates Fleet Matrix data after a successful service-status update", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { name: "EC4", status: "out_of_service", oos_at: "2026-07-18T12:00:00.000Z", oos_by_name: "Chief" },
    });
    const update = vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) }));
    createAdminClient.mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle })) })),
        update,
      })),
    });
    const formData = new FormData();
    formData.set("id", "e4e3c4f0-4e32-4a69-bdc5-3f815c4a6aa1");
    formData.set("status", "in_service");

    await toggleUnitStatus(formData);

    expect(upsertTodayUnitLedger).toHaveBeenCalledWith(expect.anything(), "e4e3c4f0-4e32-4a69-bdc5-3f815c4a6aa1", { status: "in_service", statusNote: null });
    expect(invalidateFleetStatusCache).toHaveBeenCalledOnce();
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });
});
