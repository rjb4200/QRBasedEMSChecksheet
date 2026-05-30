import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { createAdminClient, getAdminSessionPrincipal } = vi.hoisted(() => ({
  createAdminClient: vi.fn(),
  getAdminSessionPrincipal: vi.fn(),
}));

vi.mock("@/lib/auth/admin-session", () => ({
  ADMIN_COOKIE_NAME: "ec_admin_session",
  getAdminSessionPrincipal,
}));

vi.mock("@/lib/supabase/server-admin", () => ({
  createAdminClient,
}));

import { GET } from "./route";

function authenticatedRequest(url: string) {
  return new NextRequest(url, {
    headers: { cookie: "ec_admin_session=test" },
  });
}

function createQuery(data: unknown[] = []) {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    in: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    gte: vi.fn(() => query),
    then: (resolve: (value: { data: unknown[]; error: null }) => void) => resolve({ data, error: null }),
  };
  return query;
}

function mockRecentCommentsQueries(sectionComments: unknown[] = [], generalComments: unknown[] = [], crews: unknown[] = []) {
  const sectionQuery = createQuery(sectionComments);
  const generalQuery = createQuery(generalComments);
  const crewsQuery = createQuery(crews);
  const from = vi.fn((table: string) => {
    if (table === "daily_unit_comments") return generalQuery;
    if (table === "daily_unit_crews") return crewsQuery;
    return sectionQuery;
  });
  createAdminClient.mockReturnValue({ from });
  return { from, sectionQuery, generalQuery, crewsQuery };
}

describe("recent comments route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAdminSessionPrincipal.mockResolvedValue({ id: "admin-1", source: "admin_user", username: "chief" });
  });

  it("rejects unauthenticated requests", async () => {
    getAdminSessionPrincipal.mockResolvedValue(null);

    const response = await GET(new NextRequest("http://localhost/api/admin/recent-comments"));

    expect(response.status).toBe(401);
  });

  it("loads the three newest merged comments for compact mode", async () => {
    const { sectionQuery, generalQuery } = mockRecentCommentsQueries([
      { id: "s-1", shift_date: "2026-05-29", shift_period: "daily", unit_id: "unit-1", source_name: "Cab", comment: "Needs restock", created_at: "2026-05-29T12:00:00Z", units: { name: "EC1" } },
    ], [
      { id: "g-1", shift_date: "2026-05-29", shift_period: "daily", unit_id: "unit-1", comment: "Unit cleaned", created_at: "2026-05-29T11:00:00Z", units: { name: "EC1" } },
    ], [
      { unit_id: "unit-1", shift_date: "2026-05-29", shift_period: "daily", provider_names: "Smith / Jones" },
    ]);

    const response = await GET(authenticatedRequest("http://localhost/api/admin/recent-comments?mode=compact"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(sectionQuery.limit).toHaveBeenCalledWith(3);
    expect(generalQuery.limit).toHaveBeenCalledWith(3);
    expect(sectionQuery.gte).not.toHaveBeenCalled();
    expect(generalQuery.gte).not.toHaveBeenCalled();
    expect(body.comments).toHaveLength(2);
  });

  it("labels general unit comments with source 'General'", async () => {
    mockRecentCommentsQueries([], [
      { id: "g-1", shift_date: "2026-05-29", shift_period: "daily", unit_id: "unit-1", comment: "Unit cleaned", created_at: "2026-05-29T11:00:00Z", units: { name: "EC1" } },
    ]);

    const response = await GET(authenticatedRequest("http://localhost/api/admin/recent-comments?mode=compact"));
    const body = await response.json();

    expect(body.comments[0]).toMatchObject({ sourceName: "General", comment: "Unit cleaned", unitName: "EC1" });
  });

  it("orders merged comments newest first", async () => {
    mockRecentCommentsQueries([
      { id: "s-1", shift_date: "2026-05-29", shift_period: "daily", unit_id: "unit-1", source_name: "Cab", comment: "Section comment", created_at: "2026-05-29T11:00:00Z", units: { name: "EC1" } },
    ], [
      { id: "g-1", shift_date: "2026-05-29", shift_period: "daily", unit_id: "unit-1", comment: "General comment", created_at: "2026-05-29T12:00:00Z", units: { name: "EC1" } },
    ]);

    const response = await GET(authenticatedRequest("http://localhost/api/admin/recent-comments?mode=compact"));
    const body = await response.json();

    expect(body.comments[0].comment).toBe("General comment");
    expect(body.comments[1].comment).toBe("Section comment");
  });

  it("applies compact limit after merging both sources", async () => {
    mockRecentCommentsQueries([
      { id: "s-1", shift_date: "2026-05-29", shift_period: "daily", unit_id: "unit-1", source_name: "Cab", comment: "S1", created_at: "2026-05-29T12:00:00Z", units: { name: "EC1" } },
      { id: "s-2", shift_date: "2026-05-29", shift_period: "daily", unit_id: "unit-1", source_name: "Pump", comment: "S2", created_at: "2026-05-29T11:00:00Z", units: { name: "EC1" } },
    ], [
      { id: "g-1", shift_date: "2026-05-29", shift_period: "daily", unit_id: "unit-1", comment: "G1", created_at: "2026-05-29T10:00:00Z", units: { name: "EC1" } },
      { id: "g-2", shift_date: "2026-05-29", shift_period: "daily", unit_id: "unit-1", comment: "G2", created_at: "2026-05-29T09:00:00Z", units: { name: "EC1" } },
    ]);

    const response = await GET(authenticatedRequest("http://localhost/api/admin/recent-comments?mode=compact"));
    const body = await response.json();

    expect(body.comments).toHaveLength(3);
    expect(body.comments[0].comment).toBe("S1");
    expect(body.comments[1].comment).toBe("S2");
    expect(body.comments[2].comment).toBe("G1");
  });

  it("loads last 10 days with a 50 row limit for expanded mode", async () => {
    const { sectionQuery, generalQuery } = mockRecentCommentsQueries();

    const response = await GET(authenticatedRequest("http://localhost/api/admin/recent-comments?mode=expanded"));

    expect(response.status).toBe(200);
    expect(sectionQuery.limit).toHaveBeenCalledWith(50);
    expect(generalQuery.limit).toHaveBeenCalledWith(50);
    expect(sectionQuery.gte).toHaveBeenCalledWith("shift_date", expect.any(String));
    expect(generalQuery.gte).toHaveBeenCalledWith("shift_date", expect.any(String));
  });

  it("omits crew names when no matching non-blank crew exists", async () => {
    mockRecentCommentsQueries([
      { id: "comment-1", shift_date: "2026-05-29", shift_period: "daily", unit_id: "unit-1", source_name: "Cab", comment: "Needs restock", created_at: "2026-05-29T12:00:00Z", units: { name: "EC1" } },
    ], [], [
      { unit_id: "unit-1", shift_date: "2026-05-29", shift_period: "daily", provider_names: "  " },
    ]);

    const response = await GET(authenticatedRequest("http://localhost/api/admin/recent-comments?mode=compact"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.comments[0]).not.toHaveProperty("crewNames");
  });
});
