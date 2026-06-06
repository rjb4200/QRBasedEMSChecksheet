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

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const unauthorized = await requireAdminSession(request);
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const supabase = createAdminClient();

    const { data: notes, error } = await supabase
      .from("issue_notes")
      .select("id, text, created_by, created_at")
      .eq("issue_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const unauthorized = await requireAdminSession(request);
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const principal = await getAdminSessionPrincipal(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
    const { text } = await request.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Note text is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: note, error } = await supabase
      .from("issue_notes")
      .insert({
        issue_id: id,
        text: text.trim(),
        created_by: principal ? principal.username : "Admin",
      })
      .select("id, text, created_by, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
