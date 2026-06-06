import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminSessionPrincipal } from "@/lib/auth/admin-session";
import { createAdminClient } from "@/lib/supabase/server-admin";

function normalizeTags(tags: unknown): string[] | null {
  if (!Array.isArray(tags)) return null;
  const normalized = [...new Set(
    tags.map((t) => typeof t === "string" ? t.trim().toLowerCase() : "").filter(Boolean)
  )];
  return normalized.length > 0 ? normalized : null;
}

async function requireAdminSession(request: NextRequest) {
  const session = await getAdminSessionPrincipal(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const unauthorized = await requireAdminSession(request);
    if (unauthorized) return unauthorized;

    const supabase = createAdminClient();
    const { data: issues, error } = await supabase
      .from("issues")
      .select("id, title, description, unit_id, tags, status, created_by, created_at, updated_at, units(name)")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ issues });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const unauthorized = await requireAdminSession(request);
    if (unauthorized) return unauthorized;

    const principal = await getAdminSessionPrincipal(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
    const { title, description, unitId, tags } = await request.json();

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: issue, error } = await supabase
      .from("issues")
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        unit_id: unitId || null,
        status: "open",
        created_by: principal ? principal.username : "Admin",
        tags: normalizeTags(tags),
      })
      .select("id, title, description, unit_id, tags, status, created_by, created_at, updated_at, units(name)")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ issue }, { status: 201 });
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json({ error: "Failed to create issue" }, { status: 500 });
  }
}
