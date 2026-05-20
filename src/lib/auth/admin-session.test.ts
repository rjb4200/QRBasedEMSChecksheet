import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createAdminClient, verifyPassword } = vi.hoisted(() => ({
  createAdminClient: vi.fn(),
  verifyPassword: vi.fn(),
}));

vi.mock("@/lib/supabase/server-admin", () => ({
  createAdminClient,
}));

vi.mock("./password", () => ({
  verifyPassword,
}));

import { createAdminSessionValue, getAdminSessionPrincipal, verifyAdminCredentials } from "./admin-session";

function mockLookupUser(user: { id: string; username: string; password_hash?: string } | null) {
  const maybeSingle = vi.fn().mockResolvedValue({ data: user });
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));
  createAdminClient.mockReturnValue({
    from: vi.fn(() => ({ select })),
  });
}

describe("admin session auth", () => {
  const envSnapshot = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...envSnapshot, ADMIN_SESSION_SECRET: "test-secret" };
  });

  afterEach(() => {
    process.env = envSnapshot;
  });

  it("accepts persisted admin credentials when bootstrap is disabled", async () => {
    mockLookupUser({ id: "user-1", username: "chief", password_hash: "hash" });
    verifyPassword.mockResolvedValue(true);
    delete process.env.BOOTSTRAP_ADMIN_ENABLED;

    await expect(verifyAdminCredentials("chief", "Password1!"))
      .resolves.toEqual({ id: "user-1", source: "admin_user", username: "chief" });
  });

  it("accepts persisted admin credentials when bootstrap is enabled", async () => {
    mockLookupUser({ id: "user-1", username: "chief", password_hash: "hash" });
    verifyPassword.mockResolvedValue(true);
    process.env.BOOTSTRAP_ADMIN_ENABLED = "true";
    process.env.BOOTSTRAP_ADMIN_USER = "recovery";
    process.env.BOOTSTRAP_ADMIN_PASSWORD = "RecoveryPass1!";

    await expect(verifyAdminCredentials("chief", "Password1!"))
      .resolves.toEqual({ id: "user-1", source: "admin_user", username: "chief" });
  });

  it("rejects bootstrap credentials when bootstrap is disabled", async () => {
    mockLookupUser(null);
    verifyPassword.mockResolvedValue(false);
    process.env.BOOTSTRAP_ADMIN_ENABLED = "false";
    process.env.BOOTSTRAP_ADMIN_USER = "recovery";
    process.env.BOOTSTRAP_ADMIN_PASSWORD = "RecoveryPass1!";

    await expect(verifyAdminCredentials("recovery", "RecoveryPass1!")).resolves.toBe(false);
  });

  it("accepts bootstrap credentials when bootstrap is enabled", async () => {
    mockLookupUser(null);
    verifyPassword.mockResolvedValue(false);
    process.env.BOOTSTRAP_ADMIN_ENABLED = "true";
    process.env.BOOTSTRAP_ADMIN_USER = "recovery";
    process.env.BOOTSTRAP_ADMIN_PASSWORD = "RecoveryPass1!";

    await expect(verifyAdminCredentials("recovery", "RecoveryPass1!"))
      .resolves.toEqual({ id: null, source: "bootstrap", username: "recovery" });
  });

  it("recognizes a bootstrap session principal after cookie creation", async () => {
    mockLookupUser(null);
    process.env.BOOTSTRAP_ADMIN_ENABLED = "true";
    process.env.BOOTSTRAP_ADMIN_USER = "recovery";
    process.env.BOOTSTRAP_ADMIN_PASSWORD = "RecoveryPass1!";

    const session = await createAdminSessionValue("recovery");

    await expect(getAdminSessionPrincipal(session))
      .resolves.toEqual({ id: null, source: "bootstrap", username: "recovery" });
  });
});
