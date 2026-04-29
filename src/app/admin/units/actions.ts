"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export async function createUnit(formData: FormData) {
  const parsed = z.object({ name: z.string().min(1), unitKind: z.string().min(1), templateId: z.string().uuid().optional() }).parse({
    name: formData.get("name"),
    unitKind: formData.get("unitKind") || "EC",
    templateId: formData.get("templateId") || undefined,
  });
  const supabase = await createClient();
  const { data: unit, error } = await supabase.from("units").insert({ name: parsed.name, unit_kind: parsed.unitKind }).select("id").single();
  if (error) throw new Error(error.message);

  if (parsed.templateId) {
    const { data: compartments, error: compError } = await supabase
      .from("template_compartments")
      .select("*, template_compartment_items(*)")
      .eq("template_id", parsed.templateId)
      .order("sort_order");
    if (compError) throw new Error(compError.message);

    for (const compartment of compartments ?? []) {
      const { data: newCompartment, error: newCompError } = await supabase.from("unit_compartments").insert({
        unit_id: unit.id,
        name: compartment.name,
        sort_order: compartment.sort_order,
        grid_position: compartment.grid_position,
        photo_url: compartment.photo_url,
      }).select("id").single();
      if (newCompError) throw new Error(newCompError.message);

      const items = (compartment.template_compartment_items ?? []).map((item: any) => ({
        compartment_id: newCompartment.id,
        equipment_id: item.equipment_id,
        sort_order: item.sort_order,
        par_level: item.par_level,
        input_type: item.input_type,
      }));
      if (items.length > 0) {
        const { error: itemError } = await supabase.from("unit_compartment_items").insert(items);
        if (itemError) throw new Error(itemError.message);
      }
    }
  }

  redirect(`/admin/units/${unit.id}`);
}

export async function toggleUnitStatus(formData: FormData) {
  const parsed = z.object({ id: z.string().uuid(), status: z.enum(["in_service", "out_of_service"]) }).parse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  const supabase = await createClient();
  const { error } = await supabase.from("units").update({ status: parsed.status }).eq("id", parsed.id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/units");
  revalidatePath(`/admin/units/${parsed.id}`);
}

export async function deleteUnit(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const supabase = await createClient();
  const { error } = await supabase.from("units").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/units");
}

export async function addUnitCompartment(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), name: z.string().min(1), sortOrder: z.coerce.number().default(0) }).parse({
    unitId: formData.get("unitId"),
    name: formData.get("name"),
    sortOrder: formData.get("sortOrder") || 0,
  });
  const supabase = await createClient();
  const { error } = await supabase.from("unit_compartments").insert({ unit_id: parsed.unitId, name: parsed.name, sort_order: parsed.sortOrder });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function deleteUnitCompartment(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), id: z.string().uuid() }).parse({ unitId: formData.get("unitId"), id: formData.get("id") });
  const supabase = await createClient();
  const { error } = await supabase.from("unit_compartments").delete().eq("id", parsed.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function addUnitItem(formData: FormData) {
  const parsed = z.object({
    unitId: z.string().uuid(),
    compartmentId: z.string().uuid(),
    equipmentId: z.string().uuid(),
    inputType: z.enum(["quantity", "checkbox", "condition"]),
    parLevel: z.coerce.number().nullable(),
  }).parse({
    unitId: formData.get("unitId"),
    compartmentId: formData.get("compartmentId"),
    equipmentId: formData.get("equipmentId"),
    inputType: formData.get("inputType"),
    parLevel: formData.get("parLevel") || null,
  });
  const supabase = await createClient();
  const { error } = await supabase.from("unit_compartment_items").insert({
    compartment_id: parsed.compartmentId,
    equipment_id: parsed.equipmentId,
    input_type: parsed.inputType,
    par_level: parsed.parLevel,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function uploadCompartmentPhoto(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), compartmentId: z.string().uuid() }).parse({
    unitId: formData.get("unitId"),
    compartmentId: formData.get("compartmentId"),
  });
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) throw new Error("Photo is required");

  const supabase = await createClient();
  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${parsed.unitId}/${parsed.compartmentId}-${Date.now()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from("compartment-photos").upload(path, file, { upsert: true });
  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("compartment-photos").getPublicUrl(path);
  const { error } = await supabase.from("unit_compartments").update({ photo_url: data.publicUrl }).eq("id", parsed.compartmentId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/units/${parsed.unitId}`);
}
