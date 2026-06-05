import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminSessionPrincipal } from "@/lib/auth/admin-session";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { isValidEmail, normalizeOptionalEmail } from "@/lib/email/validation";
import { hashPassword, validatePasswordStrength } from "@/lib/auth/password";

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

async function updateAdminUser(request: NextRequest, { params }: RouteParams) {
  try {
    const unauthorized = await requireAdminSession(request);
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const { password, email: rawEmail, receivesDailyReport, pushoverUserKey, pushoverAlertEnabled, pushoverDailyReport, pushoverMissedCheckoff, pushoverMissedCheckoffFup } = await request.json();

    if (password !== undefined && typeof password !== "string") {
      return NextResponse.json({ error: "Password must be a string" }, { status: 400 });
    }

    if (password) {
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.valid) {
        return NextResponse.json({ error: passwordValidation.errors.join(". ") }, { status: 400 });
      }
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (password) {
      updates.password_hash = await hashPassword(password);
    }

    if (rawEmail !== undefined) {
      const email = normalizeOptionalEmail(rawEmail);
      if (email && !isValidEmail(email)) {
        return NextResponse.json({ error: "Email address is invalid" }, { status: 400 });
      }
      updates.email = email;
    }

    if (receivesDailyReport !== undefined) {
      updates.receives_daily_report = receivesDailyReport === true;
    }

    if (pushoverUserKey !== undefined) {
      if (typeof pushoverUserKey !== "string" || (pushoverUserKey.length > 0 && (pushoverUserKey.length < 30 || pushoverUserKey.length > 40))) {
        return NextResponse.json({ error: "Pushover User Key must be 30-40 characters or empty" }, { status: 400 });
      }
      updates.pushover_user_key = pushoverUserKey || null;
    }
    if (pushoverAlertEnabled !== undefined) updates.pushover_alert_enabled = pushoverAlertEnabled === true;
    if (pushoverDailyReport !== undefined) updates.pushover_daily_report = pushoverDailyReport === true;
    if (pushoverMissedCheckoff !== undefined) updates.pushover_missed_checkoff = pushoverMissedCheckoff === true;
    if (pushoverMissedCheckoffFup !== undefined) updates.pushover_missed_checkoff_fup = pushoverMissedCheckoffFup === true;

    if (Object.keys(updates).length === 1) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("admin_users")
      .update(updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating admin user:", error);
    return NextResponse.json({ error: "Failed to update admin user" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteParams) {
  return updateAdminUser(request, context);
}

export async function PATCH(request: NextRequest, context: RouteParams) {
  return updateAdminUser(request, context);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const unauthorized = await requireAdminSession(request);
    if (unauthorized) return unauthorized;

    const { id } = await params;
    const supabase = createAdminClient();

    const { data: users } = await supabase
      .from("admin_users")
      .select("id")
      .limit(2);

    if (!users || users.length <= 1) {
      return NextResponse.json({ error: "Cannot delete the last admin user" }, { status: 400 });
    }

    const { error } = await supabase
      .from("admin_users")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting admin user:", error);
    return NextResponse.json({ error: "Failed to delete admin user" }, { status: 500 });
  }
}
