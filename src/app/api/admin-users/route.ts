import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { isValidEmail, normalizeOptionalEmail } from "@/lib/email/validation";
import { hashPassword, validatePasswordStrength, isValidUsername } from "@/lib/auth/password";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: users, error } = await supabase
      .from("admin_users")
      .select("id, username, email, receives_daily_report, created_at, updated_at")
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
    const { username, password, email: rawEmail, receivesDailyReport } = await request.json();

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
