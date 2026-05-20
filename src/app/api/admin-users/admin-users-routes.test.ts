import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getAdminSessionPrincipal, createAdminClient, hashPassword, validatePasswordStrength } = vi.hoisted(() => ({
  getAdminSessionPrincipal: vi.fn(),
  createAdminClient: vi.fn(),
  hashPassword: vi.fn(),
  validatePasswordStrength: vi.fn(),
}));

vi.mock("@/lib/auth/admin-session", () => ({
  ADMIN_COOKIE_NAME: "ec_admin_session",
  getAdminSessionPrincipal,
}));

vi.mock("@/lib/supabase/server-admin", () => ({
  createAdminClient,
}));

vi.mock("@/lib/auth/password", async () => {
  const actual = await vi.importActual<typeof import("@/lib/auth/password")>("@/lib/auth/password");
  return {
    ...actual,
    hashPassword,
    validatePasswordStrength,
  };
});

import { GET, POST } from "./route";
import { PATCH, PUT } from "./[id]/route";

function authenticatedRequest(url: string, init?: ConstructorParameters<typeof NextRequest>[1]) {
  return new NextRequest(url, {
    ...init,
    headers: {
      cookie: "ec_admin_session=test",
      ...(init?.headers ?? {}),
    },
  });
}

describe("admin-user routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAdminSessionPrincipal.mockResolvedValue({ id: "admin-1", source: "admin_user", username: "chief" });
    validatePasswordStrength.mockReturnValue({ valid: true, errors: [] });
    hashPassword.mockResolvedValue("hashed-password");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated collection requests", async () => {
    getAdminSessionPrincipal.mockResolvedValue(false);

    const response = await GET(new NextRequest("http://localhost/api/admin-users"));

    expect(response.status).toBe(401);
  });

  it("returns admin users for authenticated GET requests", async () => {
    const order = vi.fn().mockResolvedValue({
      data: [{ id: "user-1", username: "chief", email: "chief@example.com", receives_daily_report: true }],
      error: null,
    });
    const select = vi.fn(() => ({ order }));
    createAdminClient.mockReturnValue({ from: vi.fn(() => ({ select })) });

    const response = await GET(authenticatedRequest("http://localhost/api/admin-users"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.users).toHaveLength(1);
    expect(body.users[0].email).toBe("chief@example.com");
  });

  it("preserves report recipient fields on authenticated create", async () => {
    const singleExisting = vi.fn().mockResolvedValue({ data: null });
    const selectExisting = vi.fn(() => ({ eq: vi.fn(() => ({ single: singleExisting })) }));
    const insertSingle = vi.fn().mockResolvedValue({
      data: {
        id: "user-2",
        username: "captain",
        email: "captain@example.com",
        receives_daily_report: false,
        created_at: new Date().toISOString(),
      },
      error: null,
    });
    const insert = vi.fn((payload) => {
      expect(payload).toMatchObject({
        username: "captain",
        email: "captain@example.com",
        receives_daily_report: false,
      });
      return { select: vi.fn(() => ({ single: insertSingle })) };
    });
    createAdminClient.mockReturnValue({ from: vi.fn(() => ({ select: selectExisting, insert })) });

    const response = await POST(authenticatedRequest("http://localhost/api/admin-users", {
      method: "POST",
      body: JSON.stringify({
        username: "captain",
        password: "Password1!",
        email: "captain@example.com",
        receivesDailyReport: false,
      }),
      headers: { "content-type": "application/json", cookie: "ec_admin_session=test" },
    }));

    expect(response.status).toBe(201);
  });

  it("preserves report recipient fields on authenticated update for PUT and PATCH", async () => {
    const singleExisting = vi.fn().mockResolvedValue({ data: { id: "user-2" } });
    const selectExisting = vi.fn(() => ({ eq: vi.fn(() => ({ single: singleExisting })) }));
    const update = vi.fn((payload) => {
      expect(payload).toMatchObject({
        email: "captain@example.com",
        receives_daily_report: false,
      });
      return { eq: vi.fn().mockResolvedValue({ error: null }) };
    });
    createAdminClient.mockReturnValue({ from: vi.fn(() => ({ select: selectExisting, update })) });

    const patchRequest = authenticatedRequest("http://localhost/api/admin-users/user-2", {
      method: "PATCH",
      body: JSON.stringify({ email: "captain@example.com", receivesDailyReport: false }),
      headers: { "content-type": "application/json", cookie: "ec_admin_session=test" },
    });
    const putRequest = authenticatedRequest("http://localhost/api/admin-users/user-2", {
      method: "PUT",
      body: JSON.stringify({ email: "captain@example.com", receivesDailyReport: false }),
      headers: { "content-type": "application/json", cookie: "ec_admin_session=test" },
    });

    const patchResponse = await PATCH(patchRequest, { params: Promise.resolve({ id: "user-2" }) });
    const putResponse = await PUT(putRequest, { params: Promise.resolve({ id: "user-2" }) });

    expect(patchResponse.status).toBe(200);
    expect(putResponse.status).toBe(200);
  });
});
