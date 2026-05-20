import { createAdminClient } from "@/lib/supabase/server-admin";
import { verifyPassword } from "./password";

const ADMIN_COOKIE_NAME = "ec_admin_session";
const SESSION_TTL_MS = 180 * 24 * 60 * 60 * 1000;

type AdminSessionPrincipal = {
  id: string | null;
  source: "admin_user" | "bootstrap";
  username: string;
};

export { ADMIN_COOKIE_NAME };

function getBootstrapAdminConfig() {
  const username = process.env.BOOTSTRAP_ADMIN_USER?.trim() ?? "";
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD ?? "";
  const enabled = ["1", "true", "yes", "on"].includes((process.env.BOOTSTRAP_ADMIN_ENABLED ?? "").toLowerCase());

  return {
    enabled: enabled && Boolean(username) && Boolean(password),
    password,
    username,
  };
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "ec-default-session-secret-change-me";
}

async function hmacHex(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}

export async function verifyAdminCredentials(username: string, password: string) {
  const trimmedUsername = username.trim();

  if (!trimmedUsername || !password) {
    return false;
  }

  const supabase = createAdminClient();

  const { data: user } = await supabase
    .from("admin_users")
    .select("id, username, password_hash")
    .eq("username", trimmedUsername)
    .maybeSingle();

  if (user) {
    const isValid = await verifyPassword(password, user.password_hash);
    if (isValid) {
      return { username: user.username, id: user.id, source: "admin_user" as const };
    }
  }

  const bootstrap = getBootstrapAdminConfig();
  if (bootstrap.enabled && safeEqual(trimmedUsername, bootstrap.username) && safeEqual(password, bootstrap.password)) {
    return { username: bootstrap.username, id: null, source: "bootstrap" as const };
  }

  return false;
}

export async function createAdminSessionValue(username: string) {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `${username}.${expiresAt}`;
  const signature = await hmacHex(payload);
  return `${payload}.${signature}`;
}

export async function getAdminSessionPrincipal(value?: string): Promise<AdminSessionPrincipal | false> {
  if (!value) {
    return false;
  }

  const [username, expiresAt, signature] = value.split(".");
  if (!username || !expiresAt || !signature || Number(expiresAt) <= Date.now()) {
    return false;
  }

  const expectedSignature = await hmacHex(`${username}.${expiresAt}`);
  if (!safeEqual(signature, expectedSignature)) {
    return false;
  }

  const supabase = createAdminClient();

  const { data: user } = await supabase
    .from("admin_users")
    .select("id, username")
    .eq("username", username)
    .maybeSingle();

  if (user) {
    return { id: user.id, source: "admin_user", username: user.username };
  }

  const bootstrap = getBootstrapAdminConfig();
  if (bootstrap.enabled && safeEqual(username, bootstrap.username)) {
    return { id: null, source: "bootstrap", username: bootstrap.username };
  }

  return false;
}

export async function verifyAdminSession(value?: string) {
  return Boolean(await getAdminSessionPrincipal(value));
}
