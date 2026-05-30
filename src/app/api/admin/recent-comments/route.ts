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
    .select("id, shift_date, shift_period, unit_id, source_name, comment, created_at, units(name)")
    .eq("shift_period", "daily")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (mode === "expanded") {
    const tenDaysAgo = new Date();
    tenDaysAgo.setUTCDate(tenDaysAgo.getUTCDate() - 10);
    query = query.gte("shift_date", tenDaysAgo.toISOString().slice(0, 10));
  }

  const { data } = await query;
  const rows = (data ?? []) as any[];
  const unitIds = Array.from(new Set(rows.map((row) => row.unit_id).filter(Boolean)));
  const shiftDates = Array.from(new Set(rows.map((row) => row.shift_date).filter(Boolean)));
  const crewNamesByCommentKey = new Map<string, string>();

  if (unitIds.length > 0 && shiftDates.length > 0) {
    const { data: crews } = await supabase
      .from("daily_unit_crews")
      .select("unit_id, shift_date, shift_period, provider_names")
      .in("unit_id", unitIds)
      .in("shift_date", shiftDates)
      .eq("shift_period", "daily");

    for (const crew of (crews ?? []) as any[]) {
      const providerNames = typeof crew.provider_names === "string" ? crew.provider_names.trim() : "";
      if (providerNames) {
        crewNamesByCommentKey.set(`${crew.unit_id}:${crew.shift_date}:${crew.shift_period}`, providerNames);
      }
    }
  }

  const comments = rows.map((row) => {
    const crewNames = crewNamesByCommentKey.get(`${row.unit_id}:${row.shift_date}:${row.shift_period}`);

    return {
      id: row.id,
      unitName: Array.isArray(row.units) ? row.units[0]?.name ?? "Unknown unit" : row.units?.name ?? "Unknown unit",
      sourceName: row.source_name,
      comment: row.comment,
      createdAt: row.created_at,
      shiftDate: row.shift_date,
      ...(crewNames ? { crewNames } : {}),
    };
  });

  return NextResponse.json({ comments });
}
