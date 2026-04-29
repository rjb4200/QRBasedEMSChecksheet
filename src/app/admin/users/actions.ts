"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server-admin";

const roleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["user", "supervisor", "admin"]),
});

export async function updateUserRole(formData: FormData) {
  const parsed = roleSchema.parse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });

  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("user_roles")
    .upsert({ user_id: parsed.userId, role: parsed.role }, { onConflict: "user_id" });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/users");
}
