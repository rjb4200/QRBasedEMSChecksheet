"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { getCurrentAdminLogActor, logSystemEvent } from "@/lib/system-log";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

async function copyKitGroups(supabase: SupabaseAdmin, sourceGroups: any[] = [], destinationKitId: string) {
  const groupMap = new Map<string, string>();
  for (const group of sourceGroups) {
    const { data, error } = await supabase
      .from("kit_item_groups")
      .upsert({ kit_id: destinationKitId, name: group.name, sort_order: group.sort_order ?? 0 }, { onConflict: "kit_id,name" })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    groupMap.set(group.id, data.id);
  }
  return groupMap;
}

const kitMetadataSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  active: z.boolean().default(true),
});

export async function createKit(formData: FormData) {
  const parsed = kitMetadataSchema.omit({ id: true }).parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
    active: formData.get("active") !== "false",
  });
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("kits")
    .insert({
      name: parsed.name.trim(),
      description: parsed.description?.trim() || null,
      sort_order: parsed.sortOrder,
      active: parsed.active,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "kits",
    action: "kit.created",
    targetType: "kit",
    targetId: data.id,
    targetName: parsed.name.trim(),
    afterData: { name: parsed.name.trim(), description: parsed.description?.trim() || null, sort_order: parsed.sortOrder, active: parsed.active },
  });
  redirect(`/admin/kits/${data.id}`);
}

export async function updateKit(formData: FormData) {
  const parsed = kitMetadataSchema.required({ id: true }).parse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
    active: formData.get("active") === "on",
  });
  const supabase = createAdminClient();
  const { data: before } = await supabase.from("kits").select("name, description, sort_order, active").eq("id", parsed.id).maybeSingle();
  const { error } = await supabase
    .from("kits")
    .update({
      name: parsed.name.trim(),
      description: parsed.description?.trim() || null,
      sort_order: parsed.sortOrder,
      active: parsed.active,
    })
    .eq("id", parsed.id);
  if (error) throw new Error(error.message);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "kits",
    action: "kit.updated",
    targetType: "kit",
    targetId: parsed.id,
    targetName: parsed.name.trim(),
    beforeData: before ?? null,
    afterData: { name: parsed.name.trim(), description: parsed.description?.trim() || null, sort_order: parsed.sortOrder, active: parsed.active },
  });
  revalidatePath("/admin/kits");
  revalidatePath(`/admin/kits/${parsed.id}`);
}

export async function deleteKit(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const supabase = createAdminClient();
  const { data: before } = await supabase.from("kits").select("name, active").eq("id", id).maybeSingle();
  const { count, error: countError } = await supabase
    .from("unit_kits")
    .select("id", { count: "exact", head: true })
    .eq("kit_id", id);
  if (countError) throw new Error(countError.message);
  if ((count ?? 0) > 0) throw new Error("Cannot delete a kit while it is assigned to units.");
  const { error } = await supabase.from("kits").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "kits",
    action: "kit.deleted",
    targetType: "kit",
    targetId: id,
    targetName: before?.name ?? null,
    beforeData: before ?? null,
  });
  revalidatePath("/admin/kits");
  redirect("/admin/kits");
}

export async function copyKit(formData: FormData) {
  const parsed = z.object({ kitId: z.string().uuid(), name: z.string().min(1) }).parse({
    kitId: formData.get("kitId"),
    name: formData.get("name"),
  });
  const supabase = createAdminClient();
  const { data: source, error: sourceError } = await supabase
    .from("kits")
    .select("description, sort_order, photo_url, active, kit_item_groups(id, name, sort_order), kit_items(equipment_id, sort_order, par_level, input_type, group_id)")
    .eq("id", parsed.kitId)
    .single();
  if (sourceError) throw new Error(sourceError.message);
  const { data: kit, error } = await supabase
    .from("kits")
    .insert({
      name: parsed.name.trim(),
      description: source.description,
      sort_order: source.sort_order,
      photo_url: source.photo_url,
      active: source.active,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  const groupMap = await copyKitGroups(supabase, source.kit_item_groups ?? [], kit.id);
  const items = (source.kit_items ?? []).map((item: any) => ({ ...item, kit_id: kit.id, group_id: item.group_id ? groupMap.get(item.group_id) ?? null : null }));
  if (items.length > 0) {
    const { error: itemError } = await supabase.from("kit_items").insert(items);
    if (itemError) throw new Error(itemError.message);
  }
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "kits",
    action: "kit.copied",
    targetType: "kit",
    targetId: kit.id,
    targetName: parsed.name.trim(),
    afterData: { name: parsed.name.trim(), item_count: items.length },
    metadata: { source_kit_id: parsed.kitId },
  });
  redirect(`/admin/kits/${kit.id}`);
}

export async function createKitFromCompartment(formData: FormData) {
  const parsed = z.object({ sourceCompartmentId: z.string().uuid(), name: z.string().min(1), sortOrder: z.coerce.number().default(0) }).parse({
    sourceCompartmentId: formData.get("sourceCompartmentId"),
    name: formData.get("name"),
    sortOrder: formData.get("sortOrder") || 0,
  });
  const supabase = createAdminClient();
  const { data: source, error: sourceError } = await supabase
    .from("unit_compartments")
    .select("photo_url, unit_compartment_item_groups(id, name, sort_order), unit_compartment_items(equipment_id, sort_order, par_level, input_type, group_id)")
    .eq("id", parsed.sourceCompartmentId)
    .single();
  if (sourceError) throw new Error(sourceError.message);
  const { data: kit, error } = await supabase
    .from("kits")
    .insert({ name: parsed.name.trim(), sort_order: parsed.sortOrder, photo_url: source.photo_url })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  const groupMap = new Map<string, string>();
  for (const group of source.unit_compartment_item_groups ?? []) {
    const { data, error: groupError } = await supabase
      .from("kit_item_groups")
      .upsert({ kit_id: kit.id, name: group.name, sort_order: group.sort_order ?? 0 }, { onConflict: "kit_id,name" })
      .select("id")
      .single();
    if (groupError) throw new Error(groupError.message);
    groupMap.set(group.id, data.id);
  }
  const items = (source.unit_compartment_items ?? []).map((item: any) => ({ ...item, kit_id: kit.id, group_id: item.group_id ? groupMap.get(item.group_id) ?? null : null }));
  if (items.length > 0) {
    const { error: itemError } = await supabase.from("kit_items").insert(items);
    if (itemError) throw new Error(itemError.message);
  }
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "kits",
    action: "kit.created_from_compartment",
    targetType: "kit",
    targetId: kit.id,
    targetName: parsed.name.trim(),
    afterData: { name: parsed.name.trim(), item_count: items.length },
    metadata: { source_compartment_id: parsed.sourceCompartmentId },
  });
  redirect(`/admin/kits/${kit.id}`);
}

export async function addKitItem(formData: FormData) {
  const parsed = z.object({ kitId: z.string().uuid(), equipmentId: z.string().uuid(), groupId: z.string().uuid().nullable() }).parse({
    kitId: formData.get("kitId"),
    equipmentId: formData.get("equipmentId"),
    groupId: formData.get("groupId") || null,
  });
  const supabase = createAdminClient();
  const { data: equipment, error: equipmentError } = await supabase
    .from("equipment_catalog")
    .select("default_par_level, input_type")
    .eq("id", parsed.equipmentId)
    .single();
  if (equipmentError) throw new Error(equipmentError.message);
  const { data: maxSort } = await supabase
    .from("kit_items")
    .select("sort_order")
    .eq("kit_id", parsed.kitId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { error } = await supabase.from("kit_items").upsert({
    kit_id: parsed.kitId,
    equipment_id: parsed.equipmentId,
    sort_order: (maxSort?.sort_order ?? -1) + 1,
    par_level: equipment.default_par_level,
    input_type: equipment.input_type,
    group_id: parsed.groupId,
  }, { onConflict: "kit_id,equipment_id" });
  if (error) throw new Error(error.message);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "kits",
    action: "kit_item.saved",
    targetType: "kit",
    targetId: parsed.kitId,
    afterData: { equipment_id: parsed.equipmentId, group_id: parsed.groupId },
  });
  revalidatePath(`/admin/kits/${parsed.kitId}`);
}

export async function updateKitItem(formData: FormData) {
  const parsed = z.object({ kitId: z.string().uuid(), itemId: z.string().uuid(), parLevel: z.coerce.number().nullable(), sortOrder: z.coerce.number().default(0), groupId: z.string().uuid().nullable() }).parse({
    kitId: formData.get("kitId"),
    itemId: formData.get("itemId"),
    parLevel: formData.get("parLevel") === "" ? null : formData.get("parLevel"),
    sortOrder: formData.get("sortOrder") || 0,
    groupId: formData.get("groupId") || null,
  });
  const supabase = createAdminClient();
  const { error } = await supabase.from("kit_items").update({ par_level: parsed.parLevel, sort_order: parsed.sortOrder, group_id: parsed.groupId }).eq("id", parsed.itemId);
  if (error) throw new Error(error.message);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "kits",
    action: "kit_item.updated",
    targetType: "kit",
    targetId: parsed.kitId,
    afterData: { item_id: parsed.itemId, par_level: parsed.parLevel, sort_order: parsed.sortOrder, group_id: parsed.groupId },
  });
  revalidatePath(`/admin/kits/${parsed.kitId}`);
}

export async function deleteKitItem(formData: FormData) {
  const parsed = z.object({ kitId: z.string().uuid(), itemId: z.string().uuid() }).parse({ kitId: formData.get("kitId"), itemId: formData.get("itemId") });
  const supabase = createAdminClient();
  const { error } = await supabase.from("kit_items").delete().eq("id", parsed.itemId);
  if (error) throw new Error(error.message);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "kits",
    action: "kit_item.deleted",
    targetType: "kit",
    targetId: parsed.kitId,
    beforeData: { item_id: parsed.itemId },
  });
  revalidatePath(`/admin/kits/${parsed.kitId}`);
}

export async function uploadKitPhoto(formData: FormData) {
  const kitId = z.string().uuid().parse(formData.get("kitId"));
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) throw new Error("Photo is required");
  const supabase = createAdminClient();
  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `kits/${kitId}-${Date.now()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from("compartment-photos").upload(path, file, { upsert: true });
  if (uploadError) throw new Error(uploadError.message);
  const { data } = supabase.storage.from("compartment-photos").getPublicUrl(path);
  const { error } = await supabase.from("kits").update({ photo_url: data.publicUrl }).eq("id", kitId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/kits/${kitId}`);
}

export async function createKitGroup(formData: FormData) {
  const parsed = z.object({ kitId: z.string().uuid(), name: z.string().min(1), sortOrder: z.coerce.number().default(0) }).parse({ kitId: formData.get("kitId"), name: formData.get("name"), sortOrder: formData.get("sortOrder") || 0 });
  const supabase = createAdminClient();
  const { error } = await supabase.from("kit_item_groups").upsert({ kit_id: parsed.kitId, name: parsed.name.trim(), sort_order: parsed.sortOrder }, { onConflict: "kit_id,name" });
  if (error) throw new Error(error.message);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "kits",
    action: "kit_item_group.saved",
    targetType: "kit",
    targetId: parsed.kitId,
    afterData: { name: parsed.name.trim(), sort_order: parsed.sortOrder },
  });
  revalidatePath(`/admin/kits/${parsed.kitId}`);
}

export async function updateKitGroup(formData: FormData) {
  const parsed = z.object({ kitId: z.string().uuid(), groupId: z.string().uuid(), name: z.string().min(1), sortOrder: z.coerce.number().default(0) }).parse({ kitId: formData.get("kitId"), groupId: formData.get("groupId"), name: formData.get("name"), sortOrder: formData.get("sortOrder") || 0 });
  const supabase = createAdminClient();
  const { error } = await supabase.from("kit_item_groups").update({ name: parsed.name.trim(), sort_order: parsed.sortOrder }).eq("id", parsed.groupId);
  if (error) throw new Error(error.message);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "kits",
    action: "kit_item_group.updated",
    targetType: "kit",
    targetId: parsed.kitId,
    afterData: { group_id: parsed.groupId, name: parsed.name.trim(), sort_order: parsed.sortOrder },
  });
  revalidatePath(`/admin/kits/${parsed.kitId}`);
}

export async function deleteKitGroup(formData: FormData) {
  const parsed = z.object({ kitId: z.string().uuid(), groupId: z.string().uuid() }).parse({ kitId: formData.get("kitId"), groupId: formData.get("groupId") });
  const supabase = createAdminClient();
  const { error } = await supabase.from("kit_item_groups").delete().eq("id", parsed.groupId);
  if (error) throw new Error(error.message);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "kits",
    action: "kit_item_group.deleted",
    targetType: "kit",
    targetId: parsed.kitId,
    beforeData: { group_id: parsed.groupId },
  });
  revalidatePath(`/admin/kits/${parsed.kitId}`);
}
