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

function mockCommentsQuery(data: unknown[] = []) {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    gte: vi.fn(() => query),
    then: (resolve: (value: { data: unknown[]; error: null }) => void) => resolve({ data, error: null }),
  };
  const from = vi.fn(() => query);
  createAdminClient.mockReturnValue({ from });
  return { from, query };
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
    const { query } = mockCommentsQuery([
      { id: "comment-1", shift_date: "2026-05-29", source_name: "Cab", comment: "Needs restock", created_at: "2026-05-29T12:00:00Z", units: { name: "EC1" } },
    ]);

    const response = await GET(authenticatedRequest("http://localhost/api/admin/recent-comments?mode=compact"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(query.limit).toHaveBeenCalledWith(3);
    expect(query.gte).not.toHaveBeenCalled();
    expect(query.order).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(body.comments[0]).toMatchObject({ id: "comment-1", unitName: "EC1", sourceName: "Cab" });
  });

  it("loads last 10 days with a 50 row limit for expanded mode", async () => {
    const { query } = mockCommentsQuery();

    const response = await GET(authenticatedRequest("http://localhost/api/admin/recent-comments?mode=expanded"));

    expect(response.status).toBe(200);
    expect(query.limit).toHaveBeenCalledWith(50);
    expect(query.gte).toHaveBeenCalledWith("shift_date", expect.any(String));
  });
});
