import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { hashPassword } from "@/lib/auth/password";

const DEFAULT_ADMIN_USERNAME = "rjb4200";
const DEFAULT_ADMIN_PASSWORD = "rjb4200";

export async function POST() {
  try {
    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from("admin_users")
      .select("id")
      .eq("username", DEFAULT_ADMIN_USERNAME)
      .single();

    if (existing) {
      return NextResponse.json({ message: "Admin user already exists", created: false });
    }

    const passwordHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);

    const { data: user, error } = await supabase
      .from("admin_users")
      .insert({ username: DEFAULT_ADMIN_USERNAME, password_hash: passwordHash })
      .select("id, username")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Admin user created", user, created: true }, { status: 201 });
  } catch (error) {
    console.error("Error seeding admin user:", error);
    return NextResponse.json({ error: "Failed to seed admin user" }, { status: 500 });
  }
}