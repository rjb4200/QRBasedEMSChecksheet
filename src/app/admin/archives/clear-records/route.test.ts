import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

const { mockVerifyAdminSession, mockRotateRecords, mockPreviewRotationCounts, mockValidateRotationRange } = vi.hoisted(() => ({
  mockVerifyAdminSession: vi.fn(),
  mockRotateRecords: vi.fn(),
  mockPreviewRotationCounts: vi.fn(),
  mockValidateRotationRange: vi.fn(),
}));

vi.mock("@/lib/auth/admin-session", () => ({
  ADMIN_COOKIE_NAME: "ec_admin_session",
  verifyAdminSession: mockVerifyAdminSession,
}));

vi.mock("@/lib/data-rotation", () => ({
  rotateRecords: mockRotateRecords,
  previewRotationCounts: mockPreviewRotationCounts,
  validateRotationRange: mockValidateRotationRange,
}));

function mockGetRequest(searchParams: URLSearchParams) {
  return {
    nextUrl: { searchParams },
    headers: new Headers(),
  } as unknown as NextRequest;
}

describe("GET /admin/archives/clear-records", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockValidateRotationRange.mockReturnValue({ valid: true, errors: [] });
  });

  it("returns 401 when admin is not authenticated", async () => {
    mockVerifyAdminSession.mockResolvedValue(false);

    const { GET } = await import("./route");
    const params = new URLSearchParams();
    params.set("from", "2026-05-01");
    params.set("to", "2026-05-15");

    const response = await GET(mockGetRequest(params));
    expect(response.status).toBe(401);
  });

  it("returns 400 when from or to is missing", async () => {
    mockVerifyAdminSession.mockResolvedValue({ username: "admin" });

    const { GET } = await import("./route");
    const params = new URLSearchParams();
    params.set("from", "2026-05-01");

    const response = await GET(mockGetRequest(params));
    expect(response.status).toBe(400);
  });

  it("returns preview counts when authenticated with valid params", async () => {
    mockVerifyAdminSession.mockResolvedValue({ username: "admin" });
    mockPreviewRotationCounts.mockResolvedValue({ compartment_checks: 10, shift_archives: 2, daily_unit_ledgers: 5, daily_unit_crews: 3, daily_unit_comments: 4, daily_section_comments: 1, daily_restock_items: 2, daily_email_report_runs: 0 });

    const { GET } = await import("./route");
    const params = new URLSearchParams();
    params.set("from", "2026-05-01");
    params.set("to", "2026-05-15");

    const response = await GET(mockGetRequest(params));
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.counts.compartment_checks).toBe(10);
  });
});

describe("POST /admin/archives/clear-records", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockValidateRotationRange.mockReturnValue({ valid: true, errors: [] });
  });

  function postRequest(body: Record<string, unknown>) {
    return new Request("http://localhost/admin/archives/clear-records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }) as unknown as NextRequest;
  }

  it("returns 401 when admin is not authenticated", async () => {
    mockVerifyAdminSession.mockResolvedValue(false);

    const { POST } = await import("./route");
    const response = await POST(postRequest({ from: "2026-05-01", to: "2026-05-15" }));
    expect(response.status).toBe(401);
  });

  it("returns 400 when body has no from/to", async () => {
    mockVerifyAdminSession.mockResolvedValue({ username: "admin" });

    const { POST } = await import("./route");
    const response = await POST(postRequest({ from: "2026-05-01" }));
    expect(response.status).toBe(400);
  });

  it("returns 422 when date range is invalid", async () => {
    mockVerifyAdminSession.mockResolvedValue({ username: "admin" });
    mockValidateRotationRange.mockReturnValue({ valid: false, errors: ["Range too large"] });

    const { POST } = await import("./route");
    const response = await POST(postRequest({ from: "2026-01-01", to: "2026-06-01" }));
    expect(response.status).toBe(422);
  });

  it("returns success with counts when rotation completes", async () => {
    mockVerifyAdminSession.mockResolvedValue({ username: "admin" });
    mockRotateRecords.mockResolvedValue({
      counts: { compartment_checks: 10, shift_archives: 2, daily_unit_ledgers: 5, daily_unit_crews: 3, daily_unit_comments: 4, daily_section_comments: 1, daily_restock_items: 2, daily_email_report_runs: 0 },
      totalCleared: 27,
      exportFilename: "checkoff-export-2026-05-01-to-2026-05-15.zip",
    });

    const { POST } = await import("./route");
    const response = await POST(postRequest({ from: "2026-05-01", to: "2026-05-15" }));
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.totalCleared).toBe(27);
  });

  it("returns 500 when rotation throws", async () => {
    mockVerifyAdminSession.mockResolvedValue({ username: "admin" });
    mockRotateRecords.mockRejectedValue(new Error("Export failed"));

    const { POST } = await import("./route");
    const response = await POST(postRequest({ from: "2026-05-01", to: "2026-05-15" }));
    expect(response.status).toBe(500);
  });
});
