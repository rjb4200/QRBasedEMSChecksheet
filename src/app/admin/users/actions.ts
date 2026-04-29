"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server-admin";

const roleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["user", "supervisor", "admin"]),
  fullName: z.string().optional(),
});

const userSchema = z.object({
  email: z.string().email(),
  fullName: z.string().optional(),
});

export async function createUser(formData: FormData) {
  const parsed = userSchema.parse({
    email: formData.get("email"),
    fullName: formData.get("fullName") || undefined,
  });

  const supabase = createAdminClient();
  const { data: existingProfile, error: profileError } = await supabase
    .from("users")
    .select("id")
    .eq("email", parsed.email)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  let userId = existingProfile?.id;

  if (!userId) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: parsed.email,
      email_confirm: true,
      user_metadata: {
        full_name: parsed.fullName,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    userId = data.user?.id;
  }

  if (!userId) {
    throw new Error("User was not created");
  }

  const { error: userError } = await supabase.from("users").upsert({
    id: userId,
    email: parsed.email,
    full_name: parsed.fullName,
  });

  if (userError) {
    throw new Error(userError.message);
  }

  const { error: roleError } = await supabase
    .from("user_roles")
    .upsert({ user_id: userId, role: "user" }, { onConflict: "user_id", ignoreDuplicates: true });

  if (roleError) {
    throw new Error(roleError.message);
  }

  revalidatePath("/admin/users");
}

export async function updateUserRole(formData: FormData) {
  const parsed = roleSchema.parse({
    userId: formData.get("userId"),
    role: formData.get("role"),
    fullName: formData.get("fullName") || undefined,
  });

  const supabase = createAdminClient();
  const { error: userError } = await supabase
    .from("users")
    .update({ full_name: parsed.fullName })
    .eq("id", parsed.userId);

  if (userError) {
    throw new Error(userError.message);
  }

  const { error } = await supabase
    .from("user_roles")
    .upsert({ user_id: parsed.userId, role: parsed.role }, { onConflict: "user_id" });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/users");
}
