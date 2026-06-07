import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminSessionPrincipal } from "@/lib/auth/admin-session";
import { hasRole, type AppRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { getFleetStatus } from "@/lib/fleet";

export async function GET(request: NextRequest) {
  const adminSession = await getAdminSessionPrincipal(request.cookies.get(ADMIN_COOKIE_NAME)?.value);

  if (adminSession) {
    const supabase = createAdminClient();
    try {
      const units = await getFleetStatus(supabase);
      return NextResponse.json(units);
    } catch {
      return NextResponse.json({ error: "Failed to fetch fleet status" }, { status: 500 });
    }
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
  const role = roleRow?.role as AppRole | undefined;

  if (!hasRole(role, "supervisor")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminClient = createAdminClient();
  try {
    const units = await getFleetStatus(adminClient);
    return NextResponse.json(units);
  } catch {
    return NextResponse.json({ error: "Failed to fetch fleet status" }, { status: 500 });
  }
}
