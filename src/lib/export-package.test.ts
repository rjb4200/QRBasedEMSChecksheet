import { beforeEach, describe, expect, it, vi } from "vitest";

const { createAdminClient, mockArchiveRecordToCsv, mockDetailedChecksheetsCsv, mockDiscrepancyRecordsToCsv, mockGenerateDailyChecksheetsPdf, mockGetDailyChecksheetDocument, mockGetDailyUnitRecords } = vi.hoisted(() => {
  const mockRecords = {
    groups: [],
    range: { from: "2026-05-01", to: "2026-05-02" },
    records: [
      {
        archiveId: "archive-1",
        date: "2026-05-01",
        shiftPeriod: "daily",
        operationalDate: "2026-05-01",
        shiftName: "A Shift",
        unitId: "unit-1",
        unitName: "Medic 1",
        unitStatus: "in_service",
        archived: false,
        statusNote: "",
        archiveStatus: "completed",
        checkStatus: "checked" as const,
        completedCompartments: 5,
        totalCompartments: 5,
        completionPercentage: 100,
        exceptions: [],
        restockingList: [],
        sectionComments: [],
        providerNames: "John, Jane",
        comments: "All good",
        crewLocked: true,
        startedAt: "2026-05-01T08:00:00.000Z",
        submittedAt: "2026-05-01T09:30:00.000Z",
        lastActivityAt: "2026-05-01T09:30:00.000Z",
        timeToCompleteSeconds: 5400,
        checkedByName: "John",
        hasArchive: true,
      },
      {
        archiveId: "archive-2",
        date: "2026-05-02",
        shiftPeriod: "daily",
        operationalDate: "2026-05-02",
        shiftName: "B Shift",
        unitId: "unit-2",
        unitName: "Engine 1",
        unitStatus: "in_service",
        archived: false,
        statusNote: "",
        archiveStatus: "completed",
        checkStatus: "checked" as const,
        completedCompartments: 4,
        totalCompartments: 4,
        completionPercentage: 100,
        exceptions: [],
        restockingList: [],
        sectionComments: [],
        providerNames: "Bob",
        comments: "-",
        crewLocked: true,
        startedAt: "2026-05-02T08:00:00.000Z",
        submittedAt: "2026-05-02T09:00:00.000Z",
        lastActivityAt: "2026-05-02T09:00:00.000Z",
        timeToCompleteSeconds: 3600,
        checkedByName: "Bob",
        hasArchive: true,
      },
    ],
    units: [
      { id: "unit-1", name: "Medic 1", status: "in_service", unit_compartments: [{ id: "c1" }], unit_kits: [] },
      { id: "unit-2", name: "Engine 1", status: "in_service", unit_compartments: [{ id: "c2" }], unit_kits: [] },
    ],
  };

  return {
    createAdminClient: vi.fn(),
    mockArchiveRecordToCsv: vi.fn().mockReturnValue("date,unit,status\n2026-05-01,Medic 1,checked\n"),
    mockDetailedChecksheetsCsv: vi.fn().mockReturnValue("Date,Shift,Unit,Compartment,Item,Actual,Expected\n2026-05-01,A Shift,Medic 1,Cabinet,Bandages,5,5\n"),
    mockDiscrepancyRecordsToCsv: vi.fn().mockReturnValue("Date,Unit,Compartment,Item,Issue,Actual,Expected\n"),
    mockGenerateDailyChecksheetsPdf: vi.fn().mockResolvedValue({
      filename: "daily-check-archive-2026-05-01.pdf",
      content: Buffer.from("fake-pdf-content"),
    }),
    mockGetDailyChecksheetDocument: vi.fn().mockResolvedValue({
      date: "2026-05-01",
      operationalDate: "2026-05-01",
      shiftName: "A Shift",
      shiftPeriod: "daily",
      generatedAt: "2026-05-01T12:00:00.000Z",
      units: [
        {
          id: "unit-1",
          name: "Medic 1",
          status: "in_service",
          providerNames: "John, Jane",
          comments: "All good",
          archiveStatus: "completed",
          completedCompartments: 5,
          totalCompartments: 5,
          shiftName: "A Shift",
          startedAt: "2026-05-01T08:00:00.000Z",
          submittedAt: "2026-05-01T09:30:00.000Z",
          timeToCompleteSeconds: 5400,
          checkedByName: "John",
          restockingList: [],
          compartments: [],
        },
      ],
    }),
    mockGetDailyUnitRecords: vi.fn().mockResolvedValue(mockRecords),
  };
});

vi.mock("@/lib/supabase/server-admin", () => ({
  createAdminClient,
}));

vi.mock("@/lib/archive-records", () => ({
  getDailyUnitRecords: mockGetDailyUnitRecords,
  archiveRecordToCsv: mockArchiveRecordToCsv,
  formatDuration: vi.fn().mockReturnValue("1h 30m"),
}));

vi.mock("@/lib/checksheet-documents", () => ({
  getDailyChecksheetDocument: mockGetDailyChecksheetDocument,
  detailedChecksheetsCsv: mockDetailedChecksheetsCsv,
}));

vi.mock("@/lib/discrepancies", () => ({
  getCheckoffDiscrepanciesForRange: vi.fn().mockResolvedValue([]),
  discrepancyRecordsToCsv: mockDiscrepancyRecordsToCsv,
}));

vi.mock("@/lib/pdf/daily-checksheets", () => ({
  generateDailyChecksheetsPdf: mockGenerateDailyChecksheetsPdf,
}));

import { generateExportPackage } from "./export-package";

describe("generateExportPackage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ZIP structure", () => {
    it("contains manifest.json, CSVs, and PDFs for a single-day range", async () => {
      const { archive, manifest } = await generateExportPackage({
        from: "2026-05-01",
        to: "2026-05-01",
      });

      const chunks: Buffer[] = [];
      for await (const chunk of archive) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const zipBuffer = Buffer.concat(chunks);

      expect(zipBuffer.length).toBeGreaterThan(0);

      expect(mockArchiveRecordToCsv).toHaveBeenCalled();
      expect(mockGetDailyChecksheetDocument).toHaveBeenCalledWith("2026-05-01");
      expect(mockGenerateDailyChecksheetsPdf).toHaveBeenCalledWith("2026-05-01");
      expect(mockDiscrepancyRecordsToCsv).toHaveBeenCalled();
    });
  });

  describe("manifest contents", () => {
    it("includes correct date range, unit listing, and record counts", async () => {
      const { archive, manifest } = await generateExportPackage({
        from: "2026-05-01",
        to: "2026-05-02",
      });

      expect(manifest.dateRange).toEqual({ from: "2026-05-01", to: "2026-05-02" });
      expect(manifest.dateCount).toBe(2);
      expect(manifest.totalRecords).toBe(2);
      expect(manifest.totalExceptions).toBe(0);
      expect(manifest.exportId).toBeDefined();
      expect(manifest.generatedAt).toBeDefined();
      expect(manifest.units).toHaveLength(2);
      expect(manifest.units[0].name).toBe("Engine 1");
      expect(manifest.units[1].name).toBe("Medic 1");
      expect(manifest.units[1].archiveIds).toContain("archive-1");
    });

    it("includes contents listing with all file names", async () => {
      const { manifest } = await generateExportPackage({
        from: "2026-05-01",
        to: "2026-05-01",
      });

      expect(manifest.contents.csv).toContain("records-simple.csv");
      expect(manifest.contents.csv).toContain("records-detailed.csv");
      expect(manifest.contents.csv).toContain("exceptions-2026-05-01-to-2026-05-01.csv");
      expect(manifest.contents.pdfs).toContain("checksheet-2026-05-01.pdf");
      expect(manifest.contents.manifest).toBe("manifest.json");
    });
  });

  describe("unit filtering", () => {
    it("filters records by unitId when provided", async () => {
      await generateExportPackage({
        from: "2026-05-01",
        to: "2026-05-02",
        unitId: "unit-1",
      });

      expect(mockGetDailyUnitRecords).toHaveBeenCalledWith({
        from: "2026-05-01",
        to: "2026-05-02",
        unitId: "unit-1",
      });
    });

    it("does not filter when unitId is omitted", async () => {
      await generateExportPackage({
        from: "2026-05-01",
        to: "2026-05-02",
      });

      expect(mockGetDailyUnitRecords).toHaveBeenCalledWith({
        from: "2026-05-01",
        to: "2026-05-02",
        unitId: undefined,
      });
    });
  });

  describe("read-only behavior", () => {
    it("does not call any mutation functions", async () => {
      const mutations = ["from", "insert", "update", "delete", "upsert"];

      await generateExportPackage({
        from: "2026-05-01",
        to: "2026-05-01",
      });

      const supabaseCalls = createAdminClient.mock.calls;
      expect(supabaseCalls.length).toBe(0);
    });
  });

  describe("filename", () => {
    it("returns the correct ZIP filename", async () => {
      const { filename } = await generateExportPackage({
        from: "2026-05-01",
        to: "2026-05-15",
      });

      expect(filename).toBe("checkoff-export-2026-05-01-to-2026-05-15.zip");
    });
  });
});
