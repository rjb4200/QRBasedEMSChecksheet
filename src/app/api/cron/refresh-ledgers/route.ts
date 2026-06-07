import { NextResponse, type NextRequest } from "next/server";
import { refreshDailyUnitLedgers } from "@/lib/daily-unit-ledgers";
import { createAdminClient } from "@/lib/supabase/server-admin";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("CRON_SECRET is not configured");
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const result = await refreshDailyUnitLedgers(supabase);
    return NextResponse.json({ ok: true, count: result.count });
  } catch {
    return NextResponse.json({ error: "Failed to refresh ledgers" }, { status: 500 });
  }
}
