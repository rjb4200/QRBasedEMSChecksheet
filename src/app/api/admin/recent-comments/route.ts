import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminSessionPrincipal } from "@/lib/auth/admin-session";
import { createAdminClient } from "@/lib/supabase/server-admin";

export async function GET(request: NextRequest) {
  const session = await getAdminSessionPrincipal(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const mode = request.nextUrl.searchParams.get("mode") === "expanded" ? "expanded" : "compact";
  const limit = mode === "expanded" ? 50 : 3;

  let query = supabase
    .from("daily_section_comments")
    .select("id, shift_date, unit_id, source_name, comment, created_at, units(name)")
    .eq("shift_period", "daily")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (mode === "expanded") {
    const tenDaysAgo = new Date();
    tenDaysAgo.setUTCDate(tenDaysAgo.getUTCDate() - 10);
    query = query.gte("shift_date", tenDaysAgo.toISOString().slice(0, 10));
  }

  const { data } = await query;

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
