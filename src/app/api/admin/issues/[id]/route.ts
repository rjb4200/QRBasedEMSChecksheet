import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminSessionPrincipal } from "@/lib/auth/admin-session";
import { createAdminClient } from "@/lib/supabase/server-admin";

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function requireAdminSession(request: NextRequest) {
  const session = await getAdminSessionPrincipal(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const unauthorized = await requireAdminSession(request);
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const { status, title, description, unitId } = await request.json();

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (status !== undefined) {
      if (!["open", "in_progress", "closed"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updates.status = status;
    }
    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
      }
      updates.title = title.trim();
    }
    if (description !== undefined) {
      updates.description = description?.trim() || null;
    }
    if (unitId !== undefined) {
      updates.unit_id = unitId || null;
    }

    const supabase = createAdminClient();
    const { data: issue, error } = await supabase
      .from("issues")
      .update(updates)
      .eq("id", id)
      .select("id, title, description, unit_id, status, created_by, created_at, updated_at, units(name)")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ issue });
  } catch (error) {
    console.error("Error updating issue:", error);
    return NextResponse.json({ error: "Failed to update issue" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const unauthorized = await requireAdminSession(request);
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("issues")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting issue:", error);
    return NextResponse.json({ error: "Failed to delete issue" }, { status: 500 });
  }
}
