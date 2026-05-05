"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server-admin";

export async function createUnit(formData: FormData) {
  const parsed = z.object({ name: z.string().min(1), unitKind: z.string().min(1), sourceUnitId: z.string().uuid().optional() }).parse({
    name: formData.get("name"),
    unitKind: formData.get("unitKind") || "EC",
    sourceUnitId: formData.get("sourceUnitId") || undefined,
  });
  const supabase = createAdminClient();
  const { data: unit, error } = await supabase
    .from("units")
    .upsert({ name: parsed.name, unit_kind: parsed.unitKind, deleted_at: null }, { onConflict: "name" })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  if (parsed.sourceUnitId && parsed.sourceUnitId !== unit.id) {
    const [{ data: compartments, error: compError }, { data: sourceKits, error: kitError }] = await Promise.all([
      supabase
      .from("unit_compartments")
      .select("*, unit_compartment_items(*)")
      .eq("unit_id", parsed.sourceUnitId)
        .order("sort_order"),
      supabase
        .from("unit_kits")
        .select("kit_id, sort_order")
        .eq("unit_id", parsed.sourceUnitId)
        .order("sort_order"),
    ]);
    if (compError) throw new Error(compError.message);
    if (kitError) throw new Error(kitError.message);

    for (const compartment of compartments ?? []) {
      const { data: newCompartment, error: newCompError } = await supabase.from("unit_compartments").upsert({
        unit_id: unit.id,
        name: compartment.name,
        sort_order: compartment.sort_order,
        grid_position: compartment.grid_position,
        photo_url: compartment.photo_url,
      }, { onConflict: "unit_id,name" }).select("id").single();
      if (newCompError) throw new Error(newCompError.message);

      const items = (compartment.unit_compartment_items ?? []).map((item: any) => ({
        compartment_id: newCompartment.id,
        equipment_id: item.equipment_id,
        sort_order: item.sort_order,
        par_level: item.par_level,
        input_type: item.input_type,
      }));
      if (items.length > 0) {
        const { error: itemError } = await supabase.from("unit_compartment_items").upsert(items, { onConflict: "compartment_id,equipment_id" });
        if (itemError) throw new Error(itemError.message);
      }
    }

    const kitAssignments = (sourceKits ?? []).map((assignment) => ({
      unit_id: unit.id,
      kit_id: assignment.kit_id,
      sort_order: assignment.sort_order,
    }));
    if (kitAssignments.length > 0) {
      const { error: assignmentError } = await supabase.from("unit_kits").upsert(kitAssignments, { onConflict: "unit_id,kit_id" });
      if (assignmentError) throw new Error(assignmentError.message);
    }
  }

  redirect(`/admin/units/${unit.id}`);
}

export async function toggleUnitStatus(formData: FormData) {
  const parsed = z.object({ id: z.string().uuid(), status: z.enum(["in_service", "out_of_service"]) }).parse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  const supabase = createAdminClient();
  const { error } = await supabase.from("units").update({ status: parsed.status }).eq("id", parsed.id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/units");
  revalidatePath(`/admin/units/${parsed.id}`);
}

export async function deleteUnit(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const supabase = createAdminClient();
  const { error } = await supabase.from("units").update({ deleted_at: new Date().toISOString(), status: "out_of_service" }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/units");
}

export async function addUnitCompartment(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), name: z.string().min(1), sortOrder: z.coerce.number().default(0) }).parse({
    unitId: formData.get("unitId"),
    name: formData.get("name"),
    sortOrder: formData.get("sortOrder") || 0,
  });
  const supabase = createAdminClient();
  const { error } = await supabase.from("unit_compartments").upsert({ unit_id: parsed.unitId, name: parsed.name, sort_order: parsed.sortOrder }, { onConflict: "unit_id,name" });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function importUnitCompartment(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), sourceCompartmentId: z.string().uuid(), name: z.string().optional(), sortOrder: z.coerce.number().default(0) }).parse({
    unitId: formData.get("unitId"),
    sourceCompartmentId: formData.get("sourceCompartmentId"),
    name: formData.get("name") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
  });
  const supabase = createAdminClient();
  const { data: source, error: sourceError } = await supabase
    .from("unit_compartments")
    .select("name, grid_position, photo_url, unit_compartment_items(equipment_id, sort_order, par_level, input_type)")
    .eq("id", parsed.sourceCompartmentId)
    .single();
  if (sourceError) throw new Error(sourceError.message);

  const { data: newCompartment, error } = await supabase.from("unit_compartments").upsert({
    unit_id: parsed.unitId,
    name: parsed.name?.trim() || source.name,
    sort_order: parsed.sortOrder,
    grid_position: source.grid_position,
    photo_url: source.photo_url,
  }, { onConflict: "unit_id,name" }).select("id").single();
  if (error) throw new Error(error.message);

  const items = (source.unit_compartment_items ?? []).map((item: any) => ({
    compartment_id: newCompartment.id,
    equipment_id: item.equipment_id,
    sort_order: item.sort_order,
    par_level: item.par_level,
    input_type: item.input_type,
  }));
  if (items.length > 0) {
    const { error: itemError } = await supabase.from("unit_compartment_items").upsert(items, { onConflict: "compartment_id,equipment_id" });
    if (itemError) throw new Error(itemError.message);
  }

  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function cloneKitToUnitCompartment(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), kitId: z.string().uuid(), name: z.string().optional(), sortOrder: z.coerce.number().default(0) }).parse({
    unitId: formData.get("unitId"),
    kitId: formData.get("kitId"),
    name: formData.get("name") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
  });
  const supabase = createAdminClient();
  const { data: kit, error: kitError } = await supabase
    .from("kits")
    .select("name, photo_url, kit_items(equipment_id, sort_order, par_level, input_type)")
    .eq("id", parsed.kitId)
    .single();
  if (kitError) throw new Error(kitError.message);

  const { data: newCompartment, error } = await supabase.from("unit_compartments").upsert({
    unit_id: parsed.unitId,
    name: parsed.name?.trim() || kit.name,
    sort_order: parsed.sortOrder,
    photo_url: kit.photo_url,
  }, { onConflict: "unit_id,name" }).select("id").single();
  if (error) throw new Error(error.message);

  const items = (kit.kit_items ?? []).map((item: any) => ({
    compartment_id: newCompartment.id,
    equipment_id: item.equipment_id,
    sort_order: item.sort_order,
    par_level: item.par_level,
    input_type: item.input_type,
  }));
  if (items.length > 0) {
    const { error: itemError } = await supabase.from("unit_compartment_items").upsert(items, { onConflict: "compartment_id,equipment_id" });
    if (itemError) throw new Error(itemError.message);
  }

  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function assignKitToUnit(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), kitId: z.string().uuid(), sortOrder: z.coerce.number().default(0) }).parse({
    unitId: formData.get("unitId"),
    kitId: formData.get("kitId"),
    sortOrder: formData.get("sortOrder") || 0,
  });
  const supabase = createAdminClient();
  const { error } = await supabase.from("unit_kits").upsert({
    unit_id: parsed.unitId,
    kit_id: parsed.kitId,
    sort_order: parsed.sortOrder,
  }, { onConflict: "unit_id,kit_id" });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function removeKitFromUnit(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), unitKitId: z.string().uuid() }).parse({ unitId: formData.get("unitId"), unitKitId: formData.get("unitKitId") });
  const supabase = createAdminClient();
  const { error } = await supabase.from("unit_kits").delete().eq("id", parsed.unitKitId).eq("unit_id", parsed.unitId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function deleteUnitCompartment(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), id: z.string().uuid() }).parse({ unitId: formData.get("unitId"), id: formData.get("id") });
  const supabase = createAdminClient();
  const { error } = await supabase.from("unit_compartments").delete().eq("id", parsed.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function deleteUnitItem(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), id: z.string().uuid() }).parse({ unitId: formData.get("unitId"), id: formData.get("id") });
  const supabase = createAdminClient();
  const { error } = await supabase.from("unit_compartment_items").delete().eq("id", parsed.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function addUnitItem(formData: FormData) {
  const parsed = z.object({
    unitId: z.string().uuid(),
    compartmentId: z.string().uuid(),
    equipmentId: z.string().uuid(),
  }).parse({
    unitId: formData.get("unitId"),
    compartmentId: formData.get("compartmentId"),
    equipmentId: formData.get("equipmentId"),
  });
  const supabase = createAdminClient();
  const { data: equipment, error: equipmentError } = await supabase.from("equipment_catalog").select("default_par_level, input_type").eq("id", parsed.equipmentId).single();
  if (equipmentError) throw new Error(equipmentError.message);

  const { error } = await supabase.from("unit_compartment_items").upsert({
    compartment_id: parsed.compartmentId,
    equipment_id: parsed.equipmentId,
    input_type: equipment.input_type,
    par_level: equipment.default_par_level,
  }, {
    onConflict: "compartment_id,equipment_id",
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

  const supabase = createAdminClient();
  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${parsed.unitId}/${parsed.compartmentId}-${Date.now()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from("compartment-photos").upload(path, file, { upsert: true });
  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("compartment-photos").getPublicUrl(path);
  const { error } = await supabase.from("unit_compartments").update({ photo_url: data.publicUrl }).eq("id", parsed.compartmentId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/units/${parsed.unitId}`);
}
