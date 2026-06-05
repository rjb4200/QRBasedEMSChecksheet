import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminSessionPrincipal } from "@/lib/auth/admin-session";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { isValidEmail, normalizeOptionalEmail } from "@/lib/email/validation";
import { hashPassword, validatePasswordStrength, isValidUsername } from "@/lib/auth/password";

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

    const { data: users, error } = await supabase
      .from("admin_users")
      .select("id, username, email, receives_daily_report, pushover_user_key, pushover_alert_enabled, pushover_daily_report, pushover_missed_checkoff, pushover_missed_checkoff_fup, pushover_shift_1, pushover_shift_2, pushover_shift_3, created_at, updated_at")
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json({ error: "Failed to fetch admin users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const unauthorized = await requireAdminSession(request);
    if (unauthorized) return unauthorized;

    const { username, password, email: rawEmail, receivesDailyReport, pushoverUserKey, pushoverAlertEnabled, pushoverDailyReport, pushoverMissedCheckoff, pushoverMissedCheckoffFup, pushoverShift1, pushoverShift2, pushoverShift3 } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    if (!isValidUsername(username)) {
      return NextResponse.json(
        { error: "Username must be 3-50 characters and contain only letters, numbers, and underscores" },
        { status: 400 }
      );
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.errors.join(". ") }, { status: 400 });
    }

    const email = normalizeOptionalEmail(rawEmail);
    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: "Email address is invalid" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from("admin_users")
      .select("id")
      .eq("username", username)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const { data: user, error } = await supabase
      .from("admin_users")
      .insert({
        username,
        password_hash: passwordHash,
        email,
        receives_daily_report: receivesDailyReport !== false,
        pushover_user_key: pushoverUserKey || null,
        pushover_alert_enabled: pushoverAlertEnabled === true,
        pushover_daily_report: pushoverDailyReport === true,
        pushover_missed_checkoff: pushoverMissedCheckoff === true,
        pushover_missed_checkoff_fup: pushoverMissedCheckoffFup === true,
        pushover_shift_1: pushoverShift1 === true,
        pushover_shift_2: pushoverShift2 === true,
        pushover_shift_3: pushoverShift3 === true,
      })
      .select("id, username, email, receives_daily_report, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 });
  }
}
