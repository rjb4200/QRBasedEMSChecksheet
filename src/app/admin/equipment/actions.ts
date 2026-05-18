"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { getCurrentAdminLogActor, logSystemEvent } from "@/lib/system-log";

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
  let targetId = parsed.id ?? null;
  let beforeData = null;

  if (parsed.id) {
    const { data: before } = await supabase.from("equipment_catalog").select("name, category, input_type, default_par_level").eq("id", parsed.id).maybeSingle();
    beforeData = before;
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

    targetId = existing?.[0]?.id ?? null;
    if (existing?.[0]) {
      const { data: before } = await supabase.from("equipment_catalog").select("name, category, input_type, default_par_level").eq("id", existing[0].id).maybeSingle();
      beforeData = before;
    }

    if (existing?.[0]) {
      ({ error } = await supabase.from("equipment_catalog").update(payload).eq("id", existing[0].id));
    } else {
      const { data: inserted, error: insertError } = await supabase.from("equipment_catalog").insert(payload).select("id").single();
      error = insertError;
      targetId = inserted?.id ?? null;
    }
  }

  if (error) {
    throw new Error(error.message);
  }

  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "equipment",
    action: parsed.id || beforeData ? "equipment.updated" : "equipment.created",
    targetType: "equipment",
    targetId,
    targetName: parsed.name,
    beforeData,
    afterData: payload,
  });

  revalidatePath("/admin/equipment");
}

export async function deleteEquipment(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const supabase = await createAdminClient();
  const { data: before } = await supabase.from("equipment_catalog").select("name, category, input_type, default_par_level").eq("id", id).maybeSingle();

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

  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "equipment",
    action: "equipment.deleted",
    targetType: "equipment",
    targetId: id,
    targetName: before?.name ?? null,
    beforeData: before ?? null,
  });

  revalidatePath("/admin/equipment");
  revalidatePath("/admin/units");
}
