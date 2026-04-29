"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const equipmentSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  category: z.string().min(1),
  inputType: z.enum(["quantity", "checkbox", "condition"]),
  defaultParLevel: z.coerce.number().optional().nullable(),
});

export async function saveEquipment(formData: FormData) {
  const parsed = equipmentSchema.parse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    category: formData.get("category"),
    inputType: formData.get("inputType"),
    defaultParLevel: formData.get("defaultParLevel") || null,
  });

  const supabase = await createClient();
  const payload = {
    name: parsed.name,
    category: parsed.category,
    input_type: parsed.inputType,
    default_par_level: parsed.defaultParLevel,
  };

  const { error } = parsed.id
    ? await supabase.from("equipment_catalog").update(payload).eq("id", parsed.id)
    : await supabase.from("equipment_catalog").insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/equipment");
}

export async function deleteEquipment(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const supabase = await createClient();
  const { error } = await supabase.from("equipment_catalog").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/equipment");
}
