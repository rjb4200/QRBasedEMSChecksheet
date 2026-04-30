import { headers } from "next/headers";
import { type NextRequest } from "next/server";

function normalizeOrigin(value?: string | null) {
  const trimmed = value?.trim().replace(/\/$/, "");
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export async function getAppOrigin() {
  const configuredOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL);
  if (configuredOrigin) {
    return configuredOrigin;
  }

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "https";

  if (host) {
    return `${proto}://${host}`;
  }

  return "http://localhost:3000";
}

export function getRequestOrigin(request: NextRequest) {
  const configuredOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL);
  if (configuredOrigin) {
    return configuredOrigin;
  }

  return request.nextUrl.origin;
}
