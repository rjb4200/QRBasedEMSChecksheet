"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { refreshDailyUnitLedgers, upsertTodayUnitLedger } from "@/lib/daily-unit-ledgers";
import { invalidateFleetStatusCache } from "@/lib/fleet";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { getCurrentAdminLogActor, logSystemEvent } from "@/lib/system-log";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

async function getUnitName(supabase: SupabaseAdmin, unitId: string) {
  const { data } = await supabase.from("units").select("name").eq("id", unitId).maybeSingle();
  return data?.name ?? null;
}

async function copyCompartmentGroups(supabase: SupabaseAdmin, sourceGroups: any[] = [], destinationCompartmentId: string) {
  const groupMap = new Map<string, string>();
  for (const group of sourceGroups) {
    const { data, error } = await supabase
      .from("unit_compartment_item_groups")
      .upsert({ compartment_id: destinationCompartmentId, name: group.name, sort_order: group.sort_order ?? 0 }, { onConflict: "compartment_id,name" })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    groupMap.set(group.id, data.id);
  }
  return groupMap;
}

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
      .select("*, unit_compartment_item_groups(id, name, sort_order), unit_compartment_items(*)")
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

      const groupMap = await copyCompartmentGroups(supabase, compartment.unit_compartment_item_groups ?? [], newCompartment.id);
      const items = (compartment.unit_compartment_items ?? []).map((item: any) => ({
        compartment_id: newCompartment.id,
        equipment_id: item.equipment_id,
        sort_order: item.sort_order,
        par_level: item.par_level,
        input_type: item.input_type,
        group_id: item.group_id ? groupMap.get(item.group_id) ?? null : null,
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

  await refreshDailyUnitLedgers(supabase);

  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "fleet",
    action: "unit.created",
    targetType: "unit",
    targetId: unit.id,
    targetName: parsed.name,
    afterData: { name: parsed.name, unit_kind: parsed.unitKind, source_unit_id: parsed.sourceUnitId ?? null },
  });

  redirect(`/admin/units/${unit.id}`);
}

export async function toggleUnitStatus(formData: FormData) {
  const parsed = z.object({ id: z.string().uuid(), status: z.enum(["in_service", "out_of_service"]), statusNote: z.string().optional() }).parse({
    id: formData.get("id"),
    status: formData.get("status"),
    statusNote: formData.get("status_note") || undefined,
  });
  const supabase = createAdminClient();
  const actor = await getCurrentAdminLogActor();
  const { data: before } = await supabase.from("units").select("name, status, oos_at, oos_by_name").eq("id", parsed.id).maybeSingle();
  const nextOosAt = parsed.status === "out_of_service" ? new Date().toISOString() : null;
  const nextOosByName = parsed.status === "out_of_service" ? actor.actorName ?? "Admin" : null;
  const { error } = await supabase.from("units").update({ status: parsed.status, oos_at: nextOosAt, oos_by_name: nextOosByName }).eq("id", parsed.id);
  if (error) throw new Error(error.message);
  await upsertTodayUnitLedger(supabase, parsed.id, { status: parsed.status, statusNote: parsed.status === "in_service" ? null : parsed.statusNote });
  invalidateFleetStatusCache();
  await logSystemEvent({
    ...actor,
    actorType: "admin",
    area: "fleet",
    action: "unit.status_changed",
    targetType: "unit",
    targetId: parsed.id,
    targetName: before?.name ?? null,
    beforeData: { status: before?.status ?? null, oos_at: before?.oos_at ?? null, oos_by_name: before?.oos_by_name ?? null },
    afterData: { status: parsed.status, status_note: parsed.status === "in_service" ? null : parsed.statusNote ?? null, oos_at: nextOosAt, oos_by_name: nextOosByName },
  });
  revalidatePath("/");
  revalidatePath("/admin/units");
  revalidatePath(`/admin/units/${parsed.id}`);
}

export async function updateUnitMonthlyCheckDay(formData: FormData) {
  const parsed = z.object({
    id: z.string().uuid(),
    monthlyCheckDay: z.preprocess(
      (val) => (val === "" || val === null ? null : Number(val)),
      z.number().int().min(1).max(31).nullable(),
    ),
  }).parse({
    id: formData.get("id"),
    monthlyCheckDay: formData.get("monthlyCheckDay") || null,
  });
  const supabase = createAdminClient();
  const { error } = await supabase.from("units").update({ monthly_check_day: parsed.monthlyCheckDay }).eq("id", parsed.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/units/${parsed.id}`);
}

export async function updateCompartmentQrLocationNote(formData: FormData) {
  const parsed = z.object({
    unitId: z.string().uuid(),
    compartmentId: z.string().uuid(),
    qrLocationNote: z.string().nullable(),
  }).parse({
    unitId: formData.get("unitId"),
    compartmentId: formData.get("compartmentId"),
    qrLocationNote: (formData.get("qrLocationNote") as string)?.trim() || null,
  });
  const supabase = createAdminClient();
  const { error } = await supabase.from("unit_compartments").update({ qr_location_note: parsed.qrLocationNote }).eq("id", parsed.compartmentId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function updateUnitKitQrLocationNote(formData: FormData) {
  const parsed = z.object({
    unitId: z.string().uuid(),
    unitKitId: z.string().uuid(),
    qrLocationNote: z.string().nullable(),
  }).parse({
    unitId: formData.get("unitId"),
    unitKitId: formData.get("unitKitId"),
    qrLocationNote: (formData.get("qrLocationNote") as string)?.trim() || null,
  });
  const supabase = createAdminClient();
  const { error } = await supabase.from("unit_kits").update({ qr_location_note: parsed.qrLocationNote }).eq("id", parsed.unitKitId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function deleteUnit(formData: FormData) {
  const id = z.string().uuid().parse(formData.get("id"));
  const supabase = createAdminClient();
  const { data: before } = await supabase.from("units").select("name, status").eq("id", id).maybeSingle();
  const { error } = await supabase.from("units").update({ deleted_at: new Date().toISOString(), status: "out_of_service" }).eq("id", id);
  if (error) throw new Error(error.message);
  await upsertTodayUnitLedger(supabase, id, { status: "out_of_service", archived: true, statusNote: "Archived" });
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "fleet",
    action: "unit.archived",
    targetType: "unit",
    targetId: id,
    targetName: before?.name ?? null,
    beforeData: { status: before?.status ?? null },
    afterData: { status: "out_of_service", archived: true },
  });
  revalidatePath("/");
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
  await upsertTodayUnitLedger(supabase, parsed.unitId);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "fleet",
    action: "compartment.saved",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    afterData: { compartment_name: parsed.name, sort_order: parsed.sortOrder },
  });
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function alphabetizeUnitTargets(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid() }).parse({ unitId: formData.get("unitId") });
  const supabase = createAdminClient();
  const [{ data: compartments, error: compartmentsError }, { data: unitKits, error: unitKitsError }] = await Promise.all([
    supabase.from("unit_compartments").select("id, name").eq("unit_id", parsed.unitId),
    supabase.from("unit_kits").select("id, kits(name)").eq("unit_id", parsed.unitId),
  ]);
  if (compartmentsError) throw new Error(compartmentsError.message);
  if (unitKitsError) throw new Error(unitKitsError.message);

  const targets = [
    ...((compartments ?? []).map((compartment) => ({ id: compartment.id, name: compartment.name, type: "compartment" as const }))),
    ...((unitKits ?? []).map((assignment) => {
      const kit = Array.isArray(assignment.kits) ? assignment.kits[0] : assignment.kits;
      return { id: assignment.id, name: kit?.name ?? "Shared kit", type: "kit" as const };
    })),
  ].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

  await Promise.all(targets.map(async (target, index) => {
    const sortOrder = (index + 1) * 10;
    const query = target.type === "compartment"
      ? supabase.from("unit_compartments").update({ sort_order: sortOrder }).eq("id", target.id).eq("unit_id", parsed.unitId)
      : supabase.from("unit_kits").update({ sort_order: sortOrder }).eq("id", target.id).eq("unit_id", parsed.unitId);
    const { error } = await query;
    if (error) throw new Error(error.message);
  }));

  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "fleet",
    action: "unit_targets.alphabetized",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    afterData: { target_count: targets.length },
  });

  revalidatePath(`/admin/units/${parsed.unitId}`);
  revalidatePath(`/admin/units/${parsed.unitId}/qr`);
  revalidatePath(`/units/${parsed.unitId}`);
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
    .select("name, grid_position, photo_url, unit_compartment_item_groups(id, name, sort_order), unit_compartment_items(equipment_id, sort_order, par_level, input_type, group_id)")
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

  const groupMap = await copyCompartmentGroups(supabase, source.unit_compartment_item_groups ?? [], newCompartment.id);
  const items = (source.unit_compartment_items ?? []).map((item: any) => ({
    compartment_id: newCompartment.id,
    equipment_id: item.equipment_id,
    sort_order: item.sort_order,
    par_level: item.par_level,
    input_type: item.input_type,
    group_id: item.group_id ? groupMap.get(item.group_id) ?? null : null,
  }));
  if (items.length > 0) {
    const { error: itemError } = await supabase.from("unit_compartment_items").upsert(items, { onConflict: "compartment_id,equipment_id" });
    if (itemError) throw new Error(itemError.message);
  }

  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "fleet",
    action: "compartment.imported",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    afterData: { compartment_id: newCompartment.id, compartment_name: parsed.name?.trim() || source.name, item_count: items.length },
    metadata: { source_compartment_id: parsed.sourceCompartmentId },
  });

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
    .select("name, photo_url, kit_item_groups(id, name, sort_order), kit_items(equipment_id, sort_order, par_level, input_type, group_id)")
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

  const groupMap = new Map<string, string>();
  for (const group of kit.kit_item_groups ?? []) {
    const { data, error: groupError } = await supabase
      .from("unit_compartment_item_groups")
      .upsert({ compartment_id: newCompartment.id, name: group.name, sort_order: group.sort_order ?? 0 }, { onConflict: "compartment_id,name" })
      .select("id")
      .single();
    if (groupError) throw new Error(groupError.message);
    groupMap.set(group.id, data.id);
  }

  const items = (kit.kit_items ?? []).map((item: any) => ({
    compartment_id: newCompartment.id,
    equipment_id: item.equipment_id,
    sort_order: item.sort_order,
    par_level: item.par_level,
    input_type: item.input_type,
    group_id: item.group_id ? groupMap.get(item.group_id) ?? null : null,
  }));
  if (items.length > 0) {
    const { error: itemError } = await supabase.from("unit_compartment_items").upsert(items, { onConflict: "compartment_id,equipment_id" });
    if (itemError) throw new Error(itemError.message);
  }

  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "fleet",
    action: "compartment.cloned_from_kit",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    afterData: { compartment_id: newCompartment.id, compartment_name: parsed.name?.trim() || kit.name, item_count: items.length },
    metadata: { kit_id: parsed.kitId, kit_name: kit.name },
  });

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
  await upsertTodayUnitLedger(supabase, parsed.unitId);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "kits",
    action: "unit_kit.assigned",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    afterData: { kit_id: parsed.kitId, sort_order: parsed.sortOrder },
  });
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function removeKitFromUnit(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), unitKitId: z.string().uuid() }).parse({ unitId: formData.get("unitId"), unitKitId: formData.get("unitKitId") });
  const supabase = createAdminClient();
  const { data: before } = await supabase.from("unit_kits").select("kit_id").eq("id", parsed.unitKitId).maybeSingle();
  const { error } = await supabase.from("unit_kits").delete().eq("id", parsed.unitKitId).eq("unit_id", parsed.unitId);
  if (error) throw new Error(error.message);
  await upsertTodayUnitLedger(supabase, parsed.unitId);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "kits",
    action: "unit_kit.removed",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    beforeData: { unit_kit_id: parsed.unitKitId, kit_id: before?.kit_id ?? null },
  });
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function deleteUnitCompartment(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), id: z.string().uuid() }).parse({ unitId: formData.get("unitId"), id: formData.get("id") });
  const supabase = createAdminClient();
  const { data: before } = await supabase.from("unit_compartments").select("name").eq("id", parsed.id).maybeSingle();
  const { error } = await supabase.from("unit_compartments").delete().eq("id", parsed.id);
  if (error) throw new Error(error.message);
  await upsertTodayUnitLedger(supabase, parsed.unitId);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "fleet",
    action: "compartment.deleted",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    beforeData: { compartment_id: parsed.id, compartment_name: before?.name ?? null },
  });
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function deleteUnitItem(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), id: z.string().uuid() }).parse({ unitId: formData.get("unitId"), id: formData.get("id") });
  const supabase = createAdminClient();
  const { error } = await supabase.from("unit_compartment_items").delete().eq("id", parsed.id);
  if (error) throw new Error(error.message);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "fleet",
    action: "unit_item.deleted",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    beforeData: { item_id: parsed.id },
  });
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function addUnitItem(formData: FormData) {
  const parsed = z.object({
    unitId: z.string().uuid(),
    compartmentId: z.string().uuid(),
    equipmentId: z.string().uuid(),
    groupId: z.string().uuid().nullable(),
  }).parse({
    unitId: formData.get("unitId"),
    compartmentId: formData.get("compartmentId"),
    equipmentId: formData.get("equipmentId"),
    groupId: formData.get("groupId") || null,
  });
  const supabase = createAdminClient();
  const { data: equipment, error: equipmentError } = await supabase.from("equipment_catalog").select("default_par_level, input_type").eq("id", parsed.equipmentId).single();
  if (equipmentError) throw new Error(equipmentError.message);

  const { error } = await supabase.from("unit_compartment_items").upsert({
    compartment_id: parsed.compartmentId,
    equipment_id: parsed.equipmentId,
    input_type: equipment.input_type,
    par_level: equipment.default_par_level,
    group_id: parsed.groupId,
  }, {
    onConflict: "compartment_id,equipment_id",
  });
  if (error) throw new Error(error.message);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "fleet",
    action: "unit_item.saved",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    afterData: { compartment_id: parsed.compartmentId, equipment_id: parsed.equipmentId, group_id: parsed.groupId },
  });
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function createCompartmentGroup(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), compartmentId: z.string().uuid(), name: z.string().min(1), sortOrder: z.coerce.number().default(0) }).parse({
    unitId: formData.get("unitId"),
    compartmentId: formData.get("compartmentId"),
    name: formData.get("name"),
    sortOrder: formData.get("sortOrder") || 0,
  });
  const supabase = createAdminClient();
  const { error } = await supabase.from("unit_compartment_item_groups").upsert({ compartment_id: parsed.compartmentId, name: parsed.name.trim(), sort_order: parsed.sortOrder }, { onConflict: "compartment_id,name" });
  if (error) throw new Error(error.message);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "fleet",
    action: "unit_item_group.saved",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    afterData: { compartment_id: parsed.compartmentId, name: parsed.name.trim(), sort_order: parsed.sortOrder },
  });
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function updateCompartmentGroup(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), groupId: z.string().uuid(), name: z.string().min(1), sortOrder: z.coerce.number().default(0) }).parse({
    unitId: formData.get("unitId"),
    groupId: formData.get("groupId"),
    name: formData.get("name"),
    sortOrder: formData.get("sortOrder") || 0,
  });
  const supabase = createAdminClient();
  const { error } = await supabase.from("unit_compartment_item_groups").update({ name: parsed.name.trim(), sort_order: parsed.sortOrder }).eq("id", parsed.groupId);
  if (error) throw new Error(error.message);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "fleet",
    action: "unit_item_group.updated",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    afterData: { group_id: parsed.groupId, name: parsed.name.trim(), sort_order: parsed.sortOrder },
  });
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function deleteCompartmentGroup(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), groupId: z.string().uuid() }).parse({ unitId: formData.get("unitId"), groupId: formData.get("groupId") });
  const supabase = createAdminClient();
  const { error } = await supabase.from("unit_compartment_item_groups").delete().eq("id", parsed.groupId);
  if (error) throw new Error(error.message);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "fleet",
    action: "unit_item_group.deleted",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    beforeData: { group_id: parsed.groupId },
  });
  revalidatePath(`/admin/units/${parsed.unitId}`);
}

export async function updateUnitItemGroup(formData: FormData) {
  const parsed = z.object({ unitId: z.string().uuid(), itemId: z.string().uuid(), groupId: z.string().uuid().nullable() }).parse({
    unitId: formData.get("unitId"),
    itemId: formData.get("itemId"),
    groupId: formData.get("groupId") || null,
  });
  const supabase = createAdminClient();
  const { error } = await supabase.from("unit_compartment_items").update({ group_id: parsed.groupId }).eq("id", parsed.itemId);
  if (error) throw new Error(error.message);
  await logSystemEvent({
    ...(await getCurrentAdminLogActor()),
    actorType: "admin",
    area: "fleet",
    action: "unit_item.updated",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    afterData: { item_id: parsed.itemId, group_id: parsed.groupId },
  });
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
