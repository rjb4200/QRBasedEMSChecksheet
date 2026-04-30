const ADMIN_COOKIE_NAME = "ec_admin_session";
const DEFAULT_ADMIN_USERNAME = "rjb4200";
const DEFAULT_ADMIN_PASSWORD_HASH = "47b7cd2a058898bc4d2d94d46ea2c2654bfd398638396fc7724de7e22e5aaa6d";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

export { ADMIN_COOKIE_NAME };

function getAdminUsername() {
  return process.env.ADMIN_USERNAME ?? DEFAULT_ADMIN_USERNAME;
}

function getAdminPasswordHash() {
  return process.env.ADMIN_PASSWORD_HASH ?? DEFAULT_ADMIN_PASSWORD_HASH;
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? `${getAdminUsername()}:${getAdminPasswordHash()}`;
}

async function sha256Hex(value: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
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
  const passwordHash = await sha256Hex(password);
  return safeEqual(username.trim(), getAdminUsername()) && safeEqual(passwordHash, getAdminPasswordHash());
}

export async function createAdminSessionValue() {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `${getAdminUsername()}.${expiresAt}`;
  const signature = await hmacHex(payload);
  return `${payload}.${signature}`;
}

export async function verifyAdminSession(value?: string) {
  if (!value) {
    return false;
  }

  const [username, expiresAt, signature] = value.split(".");
  if (!username || !expiresAt || !signature || Number(expiresAt) <= Date.now() || username !== getAdminUsername()) {
    return false;
  }

  const expectedSignature = await hmacHex(`${username}.${expiresAt}`);
  return safeEqual(signature, expectedSignature);
}
