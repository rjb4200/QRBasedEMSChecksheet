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
  const { data: catalogItem } = await supabase.from("equipment_catalog").select("name, category, input_type, default_par_level").eq("id", id).maybeSingle();

  if (!catalogItem) {
    return { ok: false, message: "Equipment item not found." };
  }

  const [compRows, kitRows, templateRows] = await Promise.all([
    supabase.from("unit_compartment_items").select("equipment_id, unit_compartments!inner(name, units!inner(name))").eq("equipment_id", id),
    supabase.from("kit_items").select("equipment_id, kits!inner(name, unit_kits!inner(units!inner(name)))").eq("equipment_id", id),
    supabase.from("template_compartment_items").select("equipment_id, template_compartments!inner(name, templates!inner(name))").eq("equipment_id", id),
  ]);

  const usages: string[] = [];

  for (const row of (compRows.data ?? []) as any[]) {
    const comp = Array.isArray(row.unit_compartments) ? row.unit_compartments[0] : row.unit_compartments;
    const units = comp?.units ? (Array.isArray(comp.units) ? comp.units : [comp.units]) : [];
    for (const unit of units) {
      const label = `${comp?.name ?? "Unknown"} (${unit?.name ?? "Unknown"})`;
      if (!usages.includes(label)) usages.push(label);
    }
  }

  for (const row of (kitRows.data ?? []) as any[]) {
    const kit = Array.isArray(row.kits) ? row.kits[0] : row.kits;
    const kitName = kit?.name ?? "Unknown";
    const unitKits = kit?.unit_kits ? (Array.isArray(kit.unit_kits) ? kit.unit_kits : [kit.unit_kits]) : [];
    for (const uk of unitKits) {
      const unit = Array.isArray(uk.units) ? uk.units[0] : uk.units;
      const label = `${kitName} (Kit)${unit?.name ? ` — ${unit.name}` : ""}`;
      if (!usages.includes(label)) usages.push(label);
    }
  }

  for (const row of (templateRows.data ?? []) as any[]) {
    const tc = Array.isArray(row.template_compartments) ? row.template_compartments[0] : row.template_compartments;
    const t = tc?.templates ? (Array.isArray(tc.templates) ? tc.templates[0] : tc.templates) : null;
    const label = `${tc?.name ?? "Unknown"} (Template: ${t?.name ?? "Unknown"})`;
    if (!usages.includes(label)) usages.push(label);
  }

  if (usages.length > 0) {
    const message = `Cannot delete "${catalogItem.name}" because it is still used in:\n\n${usages.map((u) => `- ${u}`).join("\n")}\n\nRemove it from those locations first, then try again.`;
    return { ok: false, message };
  }

  const { error } = await supabase.from("equipment_catalog").delete().eq("id", id);

  if (error) {
    return { ok: false, message: `Failed to delete: ${error.message}` };
  }

  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "equipment",
    action: "equipment.deleted",
    targetType: "equipment",
    targetId: id,
    targetName: catalogItem.name,
    beforeData: catalogItem,
  });

  revalidatePath("/admin/equipment");
  revalidatePath("/admin/units");

  return { ok: true };
}
