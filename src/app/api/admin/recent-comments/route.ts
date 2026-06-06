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
  const internalLimit = mode === "expanded" ? 50 : 3;

  let sectionQuery = supabase
    .from("daily_section_comments")
    .select("id, shift_date, shift_period, unit_id, source_name, comment, created_at, units(name)")
    .eq("shift_period", "daily")
    .order("created_at", { ascending: false })
    .limit(internalLimit);

  let generalQuery = supabase
    .from("daily_unit_comments")
    .select("id, shift_date, shift_period, unit_id, comment, created_at, units(name)")
    .eq("shift_period", "daily")
    .order("created_at", { ascending: false })
    .limit(internalLimit);

  if (mode === "expanded") {
    const tenDaysAgo = new Date();
    tenDaysAgo.setUTCDate(tenDaysAgo.getUTCDate() - 10);
    const minDate = tenDaysAgo.toISOString().slice(0, 10);
    sectionQuery = sectionQuery.gte("shift_date", minDate);
    generalQuery = generalQuery.gte("shift_date", minDate);
  }

  const [{ data: sectionData }, { data: generalData }] = await Promise.all([sectionQuery, generalQuery]);

  const sectionRows = (sectionData ?? []) as any[];
  const generalRows = (generalData ?? []) as any[];

  const allRows = [
    ...sectionRows.map((row) => ({ ...row, _kind: "section" as const })),
    ...generalRows.map((row) => ({ ...row, _kind: "general" as const })),
  ];

  const unitIds = Array.from(new Set(allRows.map((row) => row.unit_id).filter(Boolean)));
  const shiftDates = Array.from(new Set(allRows.map((row) => row.shift_date).filter(Boolean)));
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

  const commentRows = allRows.map((row) => {
    const crewNames = crewNamesByCommentKey.get(`${row.unit_id}:${row.shift_date}:${row.shift_period}`);
    const unitName = Array.isArray(row.units) ? row.units[0]?.name ?? "Unknown unit" : row.units?.name ?? "Unknown unit";

    return {
      id: row._kind === "general" ? `general-${row.id}` : row.id,
      unitId: row.unit_id,
      unitName,
      sourceName: row._kind === "general" ? "General" : row.source_name,
      comment: row.comment,
      createdAt: row.created_at,
      shiftDate: row.shift_date,
      crewNames,
    };
  });

  commentRows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const limited = commentRows.slice(0, limit);

  const comments = limited.map(({ id, unitName, sourceName, comment, createdAt, shiftDate, crewNames, unitId }) => ({
    id,
    unitId,
    unitName,
    sourceName,
    comment,
    createdAt,
    shiftDate,
    ...(crewNames ? { crewNames } : {}),
  }));

  return NextResponse.json({ comments });
}
