import { beforeEach, describe, expect, it, vi } from "vitest";
import { Readable } from "node:stream";

const {
  createAdminClient,
  mockRpc,
  mockFrom,
  mockFromResults,
  mockLogSystemEvent,
  mockGetCurrentShift,
  mockGenerateExportPackage,
} = vi.hoisted(() => {
  const mockRpc = vi.fn();
  const mockFromResults: Array<{ data: unknown[] | null; error: { message: string } | null }> = [];
  const mockFrom = vi.fn((table: string) => {
    const query = {
      table,
      select: vi.fn(() => query),
      lt: vi.fn(() => query),
      order: vi.fn(() => query),
      limit: vi.fn(() => query),
      eq: vi.fn(() => query),
      then: (resolve: (value: { data: unknown[] | null; error: { message: string } | null }) => void) => {
        resolve(mockFromResults.shift() ?? { data: [], error: null });
      },
    };
    return query;
  });
  const mockLogSystemEvent = vi.fn().mockResolvedValue(undefined);
  const mockGetCurrentShift = vi.fn().mockReturnValue({ shiftDate: "2026-05-29", shiftPeriod: "daily" as const });
  const mockGenerateExportPackage = vi.fn();
  return {
    createAdminClient: vi.fn().mockReturnValue({ rpc: mockRpc, from: mockFrom }),
    mockRpc,
    mockFrom,
    mockFromResults,
    mockLogSystemEvent,
    mockGetCurrentShift,
    mockGenerateExportPackage,
  };
});

vi.mock("@/lib/supabase/server-admin", () => ({
  createAdminClient,
}));

vi.mock("@/lib/shifts", () => ({
  getCurrentShift: mockGetCurrentShift,
}));

vi.mock("@/lib/export-package", () => ({
  generateExportPackage: mockGenerateExportPackage,
}));

vi.mock("@/lib/system-log", () => ({
  logSystemEvent: mockLogSystemEvent,
}));

import {
  clearOperationalRecords,
  getDefaultRotationRange,
  getRotationDateAvailability,
  previewRotationCounts,
  rotateRecords,
  validateRotationRange,
} from "./data-rotation";

const mockCounts = {
  compartment_checks: 10,
  shift_archives: 2,
  daily_unit_ledgers: 5,
  daily_unit_crews: 3,
  daily_unit_comments: 4,
  daily_section_comments: 1,
  daily_restock_items: 2,
  daily_email_report_runs: 0,
};

describe("validateRotationRange", () => {
  it("rejects ranges exceeding 60 days", () => {
    const result = validateRotationRange("2026-01-01", "2026-05-01");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("60 days"))).toBe(true);
  });

  it("accepts ranges of 60 days or fewer", () => {
    const result = validateRotationRange("2026-04-01", "2026-05-01");
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it("rejects ranges including today's shift date", () => {
    mockGetCurrentShift.mockReturnValue({ shiftDate: "2026-05-15", shiftPeriod: "daily" });
    const result = validateRotationRange("2026-05-01", "2026-05-15");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Today"))).toBe(true);
  });

  it("accepts ranges ending before today", () => {
    mockGetCurrentShift.mockReturnValue({ shiftDate: "2026-05-29", shiftPeriod: "daily" });
    const result = validateRotationRange("2026-05-01", "2026-05-28");
    expect(result.valid).toBe(true);
  });

  it("rejects reversed date range", () => {
    const result = validateRotationRange("2026-05-15", "2026-05-01");
    expect(result.valid).toBe(false);
  });
});

describe("previewRotationCounts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentShift.mockReturnValue({ shiftDate: "2026-05-29", shiftPeriod: "daily" });
  });

  it("returns per-table counts from the stored procedure", async () => {
    mockRpc.mockResolvedValueOnce({ data: mockCounts, error: null });

    const result = await previewRotationCounts("2026-05-01", "2026-05-15");

    expect(result).toEqual(mockCounts);
    expect(mockRpc).toHaveBeenCalledWith("preview_operational_counts", {
      from_date: "2026-05-01",
      to_date: "2026-05-15",
      unit_id: null,
    });
  });

  it("passes unitId to the stored procedure when provided", async () => {
    mockRpc.mockResolvedValueOnce({ data: mockCounts, error: null });

    await previewRotationCounts("2026-05-01", "2026-05-15", "unit-1");

    expect(mockRpc).toHaveBeenCalledWith("preview_operational_counts", {
      from_date: "2026-05-01",
      to_date: "2026-05-15",
      unit_id: "unit-1",
    });
  });

  it("throws on RPC error", async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: { message: "DB error" } });

    await expect(
      previewRotationCounts("2026-05-01", "2026-05-15"),
    ).rejects.toThrow("Failed to preview rotation counts");
  });
});

describe("getRotationDateAvailability", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFromResults.length = 0;
    mockGetCurrentShift.mockReturnValue({ shiftDate: "2026-05-29", shiftPeriod: "daily" });
  });

  it("returns oldest and newest dates across rotation tables before today", async () => {
    mockFromResults.push(
      { data: [{ shift_date: "2026-05-05" }], error: null },
      { data: [{ shift_date: "2026-05-28" }], error: null },
      { data: [{ shift_date: "2026-05-08" }], error: null },
      { data: [{ shift_date: "2026-05-27" }], error: null },
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null },
      { data: [{ report_date: "2026-05-10" }], error: null },
      { data: [{ report_date: "2026-05-28" }], error: null },
    );

    const result = await getRotationDateAvailability();

    expect(result).toEqual({ oldestDate: "2026-05-05", newestDate: "2026-05-28" });
    expect(mockFrom).toHaveBeenCalledWith("compartment_checks");
    expect(mockFrom).toHaveBeenCalledWith("daily_email_report_runs");
    const firstQuery = mockFrom.mock.results[0]?.value;
    expect(firstQuery.lt).toHaveBeenCalledWith("shift_date", "2026-05-29");
  });

  it("returns null when no eligible dates exist", async () => {
    mockFromResults.push(...Array.from({ length: 16 }, () => ({ data: [], error: null })));

    await expect(getRotationDateAvailability()).resolves.toBeNull();
  });

  it("applies unit filter only to unit-scoped tables", async () => {
    mockFromResults.push(...Array.from({ length: 16 }, () => ({ data: [], error: null })));

    await getRotationDateAvailability("unit-1");

    const firstQuery = mockFrom.mock.results[0]?.value;
    const emailQuery = mockFrom.mock.results[14]?.value;
    expect(firstQuery.eq).toHaveBeenCalledWith("unit_id", "unit-1");
    expect(emailQuery.eq).not.toHaveBeenCalled();
  });
});

describe("getDefaultRotationRange", () => {
  it("falls back to the selected date when no availability exists", () => {
    expect(getDefaultRotationRange(null, "2026-05-20")).toEqual({ from: "2026-05-20", to: "2026-05-20" });
  });

  it("uses the full available range when it is within 60 days", () => {
    expect(getDefaultRotationRange({ oldestDate: "2026-05-05", newestDate: "2026-05-28" }, "2026-05-29")).toEqual({
      from: "2026-05-05",
      to: "2026-05-28",
    });
  });

  it("caps the default range at 60 days from the oldest date", () => {
    expect(getDefaultRotationRange({ oldestDate: "2026-01-01", newestDate: "2026-05-28" }, "2026-05-29")).toEqual({
      from: "2026-01-01",
      to: "2026-03-02",
    });
  });
});

describe("clearOperationalRecords", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns deletion counts from the stored procedure", async () => {
    mockRpc.mockResolvedValueOnce({ data: mockCounts, error: null });

    const result = await clearOperationalRecords("2026-05-01", "2026-05-15");

    expect(result).toEqual(mockCounts);
    expect(mockRpc).toHaveBeenCalledWith("clear_operational_records", {
      from_date: "2026-05-01",
      to_date: "2026-05-15",
      unit_id: null,
    });
  });

  it("throws on RPC error", async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: { message: "Delete failed" } });

    await expect(
      clearOperationalRecords("2026-05-01", "2026-05-15"),
    ).rejects.toThrow("Failed to clear operational records");
  });
});

describe("rotateRecords", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentShift.mockReturnValue({ shiftDate: "2026-05-29", shiftPeriod: "daily" });
  });

  function mockZipStream(content = "zip-data") {
    const buffer = Buffer.from(content);
    return {
      archive: new Readable({
        read() {
          this.push(buffer);
          this.push(null);
        },
      }),
      manifest: {},
      filename: "checkoff-export-2026-05-01-to-2026-05-15.zip",
    };
  }

  it("exports, clears, and logs on success", async () => {
    mockGenerateExportPackage.mockResolvedValue(mockZipStream());
    mockRpc.mockResolvedValueOnce({ data: mockCounts, error: null });

    const result = await rotateRecords("2026-05-01", "2026-05-15");

    expect(mockGenerateExportPackage).toHaveBeenCalledWith({
      from: "2026-05-01",
      to: "2026-05-15",
      unitId: undefined,
    });
    expect(mockRpc).toHaveBeenCalledWith("clear_operational_records", {
      from_date: "2026-05-01",
      to_date: "2026-05-15",
      unit_id: null,
    });
    expect(mockLogSystemEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "rotate_records",
        area: "data_rotation",
        result: "success",
      }),
    );
    expect(result.totalCleared).toBe(27);
  });

  it("blocks clear when export produces empty ZIP", async () => {
    mockGenerateExportPackage.mockResolvedValue(mockZipStream(""));

    await expect(
      rotateRecords("2026-05-01", "2026-05-15"),
    ).rejects.toThrow("Export package is empty");

    expect(mockRpc).not.toHaveBeenCalled();
  });

  it("throws on invalid date range", async () => {
    mockGetCurrentShift.mockReturnValue({ shiftDate: "2026-05-01", shiftPeriod: "daily" });

    await expect(
      rotateRecords("2026-05-01", "2026-05-01"),
    ).rejects.toThrow("Today");
  });

  it("passes unitId through to export and clear", async () => {
    mockGenerateExportPackage.mockResolvedValue(mockZipStream());
    mockRpc.mockResolvedValueOnce({ data: mockCounts, error: null });

    await rotateRecords("2026-05-01", "2026-05-15", "unit-1");

    expect(mockGenerateExportPackage).toHaveBeenCalledWith({
      from: "2026-05-01",
      to: "2026-05-15",
      unitId: "unit-1",
    });
    expect(mockRpc).toHaveBeenCalledWith("clear_operational_records", {
      from_date: "2026-05-01",
      to_date: "2026-05-15",
      unit_id: "unit-1",
    });
  });
});
