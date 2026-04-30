"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, createAdminSessionValue, verifyAdminCredentials } from "@/lib/auth/admin-session";
import { createClient } from "@/lib/supabase/server";

export async function signInAdmin(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!username || !password) {
    redirect("/login?error=Username%20and%20password%20are%20required");
  }

  if (!(await verifyAdminCredentials(username, password))) {
    redirect("/login?error=Invalid%20username%20or%20password");
  }

  (await cookies()).set(ADMIN_COOKIE_NAME, await createAdminSessionValue(), {
    httpOnly: true,
    maxAge: 12 * 60 * 60,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect(next.startsWith("/") ? next : "/admin");
}

export async function signOut() {
  (await cookies()).delete(ADMIN_COOKIE_NAME);
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
