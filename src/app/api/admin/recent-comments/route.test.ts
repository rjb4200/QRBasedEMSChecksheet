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

function mockRecentCommentsQueries(comments: unknown[] = [], crews: unknown[] = []) {
  const commentsQuery = createQuery(comments);
  const crewsQuery = createQuery(crews);
  const from = vi.fn((table: string) => table === "daily_unit_crews" ? crewsQuery : commentsQuery);
  createAdminClient.mockReturnValue({ from });
  return { from, commentsQuery, crewsQuery };
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

  it("loads the three newest comments for compact mode", async () => {
    const { commentsQuery, crewsQuery } = mockRecentCommentsQueries([
      { id: "comment-1", shift_date: "2026-05-29", shift_period: "daily", unit_id: "unit-1", source_name: "Cab", comment: "Needs restock", created_at: "2026-05-29T12:00:00Z", units: { name: "EC1" } },
    ], [
      { unit_id: "unit-1", shift_date: "2026-05-29", shift_period: "daily", provider_names: "Smith / Jones" },
    ]);

    const response = await GET(authenticatedRequest("http://localhost/api/admin/recent-comments?mode=compact"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(commentsQuery.limit).toHaveBeenCalledWith(3);
    expect(commentsQuery.gte).not.toHaveBeenCalled();
    expect(commentsQuery.order).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(crewsQuery.in).toHaveBeenCalledWith("unit_id", ["unit-1"]);
    expect(crewsQuery.in).toHaveBeenCalledWith("shift_date", ["2026-05-29"]);
    expect(body.comments[0]).toMatchObject({ id: "comment-1", unitName: "EC1", sourceName: "Cab", crewNames: "Smith / Jones" });
  });

  it("loads last 10 days with a 50 row limit for expanded mode", async () => {
    const { commentsQuery } = mockRecentCommentsQueries();

    const response = await GET(authenticatedRequest("http://localhost/api/admin/recent-comments?mode=expanded"));

    expect(response.status).toBe(200);
    expect(commentsQuery.limit).toHaveBeenCalledWith(50);
    expect(commentsQuery.gte).toHaveBeenCalledWith("shift_date", expect.any(String));
  });

  it("omits crew names when no matching non-blank crew exists", async () => {
    mockRecentCommentsQueries([
      { id: "comment-1", shift_date: "2026-05-29", shift_period: "daily", unit_id: "unit-1", source_name: "Cab", comment: "Needs restock", created_at: "2026-05-29T12:00:00Z", units: { name: "EC1" } },
    ], [
      { unit_id: "unit-1", shift_date: "2026-05-29", shift_period: "daily", provider_names: "  " },
    ]);

    const response = await GET(authenticatedRequest("http://localhost/api/admin/recent-comments?mode=compact"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.comments[0]).not.toHaveProperty("crewNames");
  });
});
