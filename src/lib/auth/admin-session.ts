import { createAdminClient } from "@/lib/supabase/server-admin";
import { verifyPassword } from "./password";

const ADMIN_COOKIE_NAME = "ec_admin_session";
const SESSION_TTL_MS = 180 * 24 * 60 * 60 * 1000;

export { ADMIN_COOKIE_NAME };

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
    .single();

  if (user) {
    const isValid = await verifyPassword(password, user.password_hash);
    if (isValid) {
      return { username: user.username, id: user.id };
    }
  }

  return false;
}

export async function createAdminSessionValue(username: string) {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `${username}.${expiresAt}`;
  const signature = await hmacHex(payload);
  return `${payload}.${signature}`;
}

export async function verifyAdminSession(value?: string) {
  if (!value) {
    return false;
  }

  const [username, expiresAt, signature] = value.split(".");
  if (!username || !expiresAt || !signature || Number(expiresAt) <= Date.now()) {
    return false;
  }

  const supabase = createAdminClient();

  const { data: user } = await supabase
    .from("admin_users")
    .select("id, username")
    .eq("username", username)
    .single();

  if (!user) {
    return false;
  }

  const expectedSignature = await hmacHex(`${username}.${expiresAt}`);
  return safeEqual(signature, expectedSignature);
}