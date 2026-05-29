import { describe, expect, it, vi } from "vitest";
import { Readable } from "node:stream";
import type { NextRequest } from "next/server";

const mockGenerateExportPackage = vi.fn();

vi.mock("@/lib/export-package", () => ({
  generateExportPackage: mockGenerateExportPackage,
}));

describe("GET /admin/archives/export-package", () => {
  function createMockNodeReadable() {
    return new Readable({
      read() {
        this.push(Buffer.from([0x50, 0x4B]));
        this.push(null);
      },
    });
  }

  function mockRequest(searchParams: URLSearchParams): NextRequest {
    return { nextUrl: { searchParams } } as NextRequest;
  }

  describe("Content-Type and Content-Disposition headers", () => {
    it("returns application/zip Content-Type", async () => {
      mockGenerateExportPackage.mockResolvedValue({
        archive: createMockNodeReadable(),
        manifest: {},
        filename: "checkoff-export-2026-05-01-to-2026-05-02.zip",
      });

      const { GET } = await import("./route");

      const params = new URLSearchParams();
      params.set("from", "2026-05-01");
      params.set("to", "2026-05-02");

      const response = await GET(mockRequest(params));
      expect(response.headers.get("Content-Type")).toBe("application/zip");
    });

    it("includes Content-Disposition header with correct filename", async () => {
      mockGenerateExportPackage.mockResolvedValue({
        archive: createMockNodeReadable(),
        manifest: {},
        filename: "checkoff-export-2026-05-01-to-2026-05-15.zip",
      });

      const { GET } = await import("./route");

      const params = new URLSearchParams();
      params.set("from", "2026-05-01");
      params.set("to", "2026-05-15");

      const response = await GET(mockRequest(params));
      expect(response.headers.get("Content-Disposition")).toBe(
        'attachment; filename="checkoff-export-2026-05-01-to-2026-05-15.zip"',
      );
    });
  });

  describe("validation", () => {
    it("rejects requests missing 'from' parameter", async () => {
      const { GET } = await import("./route");

      const params = new URLSearchParams();
      params.set("to", "2026-05-15");

      const response = await GET(mockRequest(params));
      expect(response.status).toBe(400);
    });

    it("rejects requests missing 'to' parameter", async () => {
      const { GET } = await import("./route");

      const params = new URLSearchParams();
      params.set("from", "2026-05-01");

      const response = await GET(mockRequest(params));
      expect(response.status).toBe(400);
    });
  });
});
