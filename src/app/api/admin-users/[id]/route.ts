import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { isValidEmail, normalizeOptionalEmail } from "@/lib/email/validation";
import { hashPassword, validatePasswordStrength } from "@/lib/auth/password";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { password, email: rawEmail, receivesDailyReport } = await request.json();

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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
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
