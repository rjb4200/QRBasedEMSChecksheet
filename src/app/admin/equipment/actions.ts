"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server-admin";

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

  const supabase = await createAdminClient();
  const payload = {
    name: parsed.name,
    category: parsed.category,
    input_type: parsed.inputType,
    default_par_level: parsed.defaultParLevel,
  };

  let error;

  if (parsed.id) {
    ({ error } = await supabase.from("equipment_catalog").update(payload).eq("id", parsed.id));
  } else {
    const { data: existing, error: findError } = await supabase
      .from("equipment_catalog")
      .select("id")
      .eq("name", parsed.name)
      .limit(1);

    if (findError) {
      throw new Error(findError.message);
    }

    ({ error } = existing?.[0]
      ? await supabase.from("equipment_catalog").update(payload).eq("id", existing[0].id)
      : await supabase.from("equipment_catalog").insert(payload));
  }

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/equipment");
}

export async function deleteEquipment(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const supabase = await createAdminClient();

  const { error: unitItemError } = await supabase.from("unit_compartment_items").delete().eq("equipment_id", id);

  if (unitItemError) {
    throw new Error(unitItemError.message);
  }

  const { error: templateItemError } = await supabase.from("template_compartment_items").delete().eq("equipment_id", id);

  if (templateItemError) {
    throw new Error(templateItemError.message);
  }

  const { error } = await supabase.from("equipment_catalog").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/equipment");
  revalidatePath("/admin/units");
}
