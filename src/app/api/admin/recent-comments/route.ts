import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminSessionPrincipal } from "@/lib/auth/admin-session";
import { createAdminClient } from "@/lib/supabase/server-admin";

export async function GET(request: NextRequest) {
  const session = await getAdminSessionPrincipal(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
  const minDate = sevenDaysAgo.toISOString().slice(0, 10);

  const { data } = await supabase
    .from("daily_section_comments")
    .select("shift_date, unit_id, source_name, comment, created_at, units(name)")
    .gte("shift_date", minDate)
    .eq("shift_period", "daily")
    .order("created_at", { ascending: false })
    .limit(50);

  const comments = ((data ?? []) as any[]).map((row) => ({
    id: row.id,
    unitName: Array.isArray(row.units) ? row.units[0]?.name ?? "Unknown unit" : row.units?.name ?? "Unknown unit",
    sourceName: row.source_name,
    comment: row.comment,
    createdAt: row.created_at,
    shiftDate: row.shift_date,
  }));

  return NextResponse.json({ comments });
}
