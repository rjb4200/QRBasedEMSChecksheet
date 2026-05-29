import { type NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/auth/admin-session";
import { previewRotationCounts, rotateRecords, validateRotationRange } from "@/lib/data-rotation";

function parseCookies(cookieHeader: string | null): Map<string, string> {
  const map = new Map<string, string>();
  if (!cookieHeader) return map;
  for (const pair of cookieHeader.split(";")) {
    const [name, ...rest] = pair.trim().split("=");
    if (name) map.set(name, rest.join("="));
  }
  return map;
}

async function checkAdminAuth(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie");
  const cookies = parseCookies(cookieHeader);
  return verifyAdminSession(cookies.get(ADMIN_COOKIE_NAME));
}

export async function GET(request: NextRequest) {
  const adminSession = await checkAdminAuth(request);
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json({ error: "from and to query parameters are required" }, { status: 400 });
  }

  const validation = validateRotationRange(from, to);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.errors.join(" ") }, { status: 422 });
  }

  try {
    const unitId = searchParams.get("unitId") ?? undefined;
    const counts = await previewRotationCounts(from, to, unitId);
    return NextResponse.json({ counts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to preview counts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminSession = await checkAdminAuth(request);
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { from?: string; to?: string; unitId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { from, to, unitId } = body;

  if (!from || !to) {
    return NextResponse.json({ error: "from and to fields are required" }, { status: 400 });
  }

  const validation = validateRotationRange(from, to);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.errors.join(" ") }, { status: 422 });
  }

  try {
    const result = await rotateRecords(from, to, unitId || undefined);
    return NextResponse.json({
      success: true,
      counts: result.counts,
      totalCleared: result.totalCleared,
      exportFilename: result.exportFilename,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error during rotation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
