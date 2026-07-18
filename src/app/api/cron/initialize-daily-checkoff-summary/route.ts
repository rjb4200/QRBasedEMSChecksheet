import { NextResponse, type NextRequest } from "next/server";
import { getCurrentShift } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const shift = getCurrentShift();
  const { error } = await createAdminClient().rpc("start_daily_checkoff_summary", {
    p_shift_date: shift.shiftDate,
    p_shift_period: shift.shiftPeriod,
  });
  if (error) throw new Error(error.message);

  return NextResponse.json({ shiftDate: shift.shiftDate, status: "initialized" });
}
