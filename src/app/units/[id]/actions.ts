"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentShift } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { logSystemEvent } from "@/lib/system-log";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

async function getUnitName(supabase: SupabaseAdmin, unitId: string) {
  const { data } = await supabase.from("units").select("name").eq("id", unitId).maybeSingle();
  return data?.name ?? null;
}

const commentSchema = z.object({
  unitId: z.string().uuid(),
  comment: z.string().max(2000),
  intent: z.enum(["save", "clear"]).default("save"),
});

export async function saveUnitCrew(unitId: string, providerNames: string) {
  const parsed = z.object({ unitId: z.string().uuid(), providerNames: z.string().max(1000) }).parse({
    unitId,
    providerNames,
  });
  const shift = getCurrentShift();
  const supabase = createAdminClient();
  const { error: summaryError } = await supabase.rpc("start_daily_checkoff_summary", { p_shift_date: shift.shiftDate, p_shift_period: shift.shiftPeriod });
  if (summaryError) throw new Error(summaryError.message);
  const { error } = await supabase.from("daily_unit_crews").upsert({
    unit_id: parsed.unitId,
    shift_date: shift.shiftDate,
    shift_period: shift.shiftPeriod,
    provider_names: parsed.providerNames.trim(),
    locked: true,
  }, { onConflict: "shift_date,shift_period,unit_id" });

  if (error) throw new Error(error.message);
  await logSystemEvent({
    actorType: "crew",
    actorName: "Crew",
    area: "checkoff",
    action: "crew.locked",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    metadata: { shift_date: shift.shiftDate, shift_period: shift.shiftPeriod },
  });
}

export async function unlockUnitCrew(unitId: string, providerNames: string) {
  const parsed = z.object({ unitId: z.string().uuid(), providerNames: z.string().max(1000) }).parse({ unitId, providerNames });
  const shift = getCurrentShift();
  const supabase = createAdminClient();
  const { error: summaryError } = await supabase.rpc("start_daily_checkoff_summary", { p_shift_date: shift.shiftDate, p_shift_period: shift.shiftPeriod });
  if (summaryError) throw new Error(summaryError.message);
  const { error } = await supabase.from("daily_unit_crews").upsert({
    unit_id: parsed.unitId,
    shift_date: shift.shiftDate,
    shift_period: shift.shiftPeriod,
    provider_names: parsed.providerNames.trim(),
    locked: false,
  }, { onConflict: "shift_date,shift_period,unit_id" });

  if (error) throw new Error(error.message);
  await logSystemEvent({
    actorType: "crew",
    actorName: "Crew",
    area: "checkoff",
    action: "crew.unlocked",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    metadata: { shift_date: shift.shiftDate, shift_period: shift.shiftPeriod },
  });
}

export async function saveDailyUnitComment(formData: FormData) {
  const parsed = commentSchema.parse({
    unitId: formData.get("unitId"),
    comment: formData.get("comment") ?? "",
    intent: formData.get("intent") || "save",
  });
  const shift = getCurrentShift();
  const supabase = createAdminClient();
  const comment = parsed.intent === "clear" ? "" : parsed.comment.trim();

  if (!comment) {
    const { error } = await supabase
      .from("daily_unit_comments")
      .delete()
      .eq("unit_id", parsed.unitId)
      .eq("shift_date", shift.shiftDate)
      .eq("shift_period", shift.shiftPeriod);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("daily_unit_comments").upsert({
      unit_id: parsed.unitId,
      shift_date: shift.shiftDate,
      shift_period: shift.shiftPeriod,
      comment,
    }, { onConflict: "shift_date,shift_period,unit_id" });
    if (error) throw new Error(error.message);
  }

  await logSystemEvent({
    actorType: "crew",
    actorName: "Crew",
    area: "checkoff",
    action: comment ? "comment.saved" : "comment.cleared",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    metadata: { shift_date: shift.shiftDate, shift_period: shift.shiftPeriod, comment_length: comment.length },
  });

  revalidatePath(`/units/${parsed.unitId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/archives");
  revalidatePath("/admin/checksheets/print");
}

const restockToggleSchema = z.object({
  unitId: z.string().uuid(),
  shiftDate: z.string(),
  shiftPeriod: z.string(),
  targetType: z.enum(["compartment", "kit"]),
  targetId: z.string().uuid(),
  itemId: z.string().uuid(),
  issueType: z.enum(["missing", "below_par", "condition_issue"]),
  addressed: z.boolean(),
});

export async function toggleRestockAddressed(input: z.infer<typeof restockToggleSchema>) {
  const parsed = restockToggleSchema.parse(input);
  const supabase = createAdminClient();

  if (parsed.addressed) {
    const { error } = await supabase.from("daily_restock_items").upsert({
      unit_id: parsed.unitId,
      shift_date: parsed.shiftDate,
      shift_period: parsed.shiftPeriod,
      target_type: parsed.targetType,
      target_id: parsed.targetId,
      item_id: parsed.itemId,
      issue_type: parsed.issueType,
      addressed: true,
      addressed_at: new Date().toISOString(),
    }, { onConflict: "unit_id,shift_date,shift_period,target_type,target_id,item_id" });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("daily_restock_items")
      .delete()
      .eq("unit_id", parsed.unitId)
      .eq("shift_date", parsed.shiftDate)
      .eq("shift_period", parsed.shiftPeriod)
      .eq("target_type", parsed.targetType)
      .eq("target_id", parsed.targetId)
      .eq("item_id", parsed.itemId);
    if (error) throw new Error(error.message);
  }
  await logSystemEvent({
    actorType: "crew",
    actorName: "Crew",
    area: "restocking",
    action: parsed.addressed ? "restock_item.addressed" : "restock_item.unaddressed",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    metadata: {
      shift_date: parsed.shiftDate,
      shift_period: parsed.shiftPeriod,
      target_type: parsed.targetType,
      target_id: parsed.targetId,
      item_id: parsed.itemId,
      issue_type: parsed.issueType,
    },
  });
}

export async function getRestockAddressed(unitId: string, shiftDate: string, shiftPeriod: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("daily_restock_items")
    .select("target_type, target_id, item_id")
    .eq("unit_id", unitId)
    .eq("shift_date", shiftDate)
    .eq("shift_period", shiftPeriod)
    .eq("addressed", true);
  if (error) throw new Error(error.message);
  return (data ?? []) as { target_type: string; target_id: string; item_id: string }[];
}

// Manual restock item server actions

const manualRestockAddSchema = z.object({
  unitId: z.string().uuid(),
  shiftDate: z.string(),
  shiftPeriod: z.string(),
  itemName: z.string().min(1, "Item name is required").max(200),
  note: z.string().max(1000).default(""),
  sourceName: z.string().max(100).default("Manual"),
});

export async function addManualRestockItem(input: z.infer<typeof manualRestockAddSchema>) {
  const parsed = manualRestockAddSchema.parse(input);
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("daily_manual_restock_items")
    .insert({
      unit_id: parsed.unitId,
      shift_date: parsed.shiftDate,
      shift_period: parsed.shiftPeriod,
      item_name: parsed.itemName.trim(),
      note: parsed.note.trim(),
      source_name: parsed.sourceName.trim() || "Manual",
    })
    .select("id, item_name, note, source_name, addressed, created_at")
    .single();
  if (error) throw new Error(error.message);
  await logSystemEvent({
    actorType: "crew",
    actorName: "Crew",
    area: "restocking",
    action: "manual_restock_item.added",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    afterData: { id: data.id, item_name: data.item_name, note: data.note, source_name: data.source_name, addressed: data.addressed },
    metadata: { shift_date: parsed.shiftDate, shift_period: parsed.shiftPeriod },
  });
  return data as { id: string; item_name: string; note: string; source_name: string; addressed: boolean; created_at: string };
}

const manualRestockToggleSchema = z.object({
  itemId: z.string().uuid(),
  unitId: z.string().uuid(),
  shiftDate: z.string(),
  shiftPeriod: z.string(),
  addressed: z.boolean(),
});

export async function toggleManualRestockAddressed(input: z.infer<typeof manualRestockToggleSchema>) {
  const parsed = manualRestockToggleSchema.parse(input);
  const supabase = createAdminClient();

  if (parsed.addressed) {
    const { error } = await supabase
      .from("daily_manual_restock_items")
      .update({ addressed: true, addressed_at: new Date().toISOString() })
      .eq("id", parsed.itemId)
      .eq("unit_id", parsed.unitId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("daily_manual_restock_items")
      .update({ addressed: false, addressed_at: null })
      .eq("id", parsed.itemId)
      .eq("unit_id", parsed.unitId);
    if (error) throw new Error(error.message);
  }
  await logSystemEvent({
    actorType: "crew",
    actorName: "Crew",
    area: "restocking",
    action: parsed.addressed ? "manual_restock_item.addressed" : "manual_restock_item.unaddressed",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    afterData: { item_id: parsed.itemId, addressed: parsed.addressed },
    metadata: { shift_date: parsed.shiftDate, shift_period: parsed.shiftPeriod },
  });
}

const manualRestockDeleteSchema = z.object({
  itemId: z.string().uuid(),
  unitId: z.string().uuid(),
});

export async function deleteManualRestockItem(input: z.infer<typeof manualRestockDeleteSchema>) {
  const parsed = manualRestockDeleteSchema.parse(input);
  const supabase = createAdminClient();
  const { data: before } = await supabase.from("daily_manual_restock_items").select("item_name, note, source_name, addressed").eq("id", parsed.itemId).eq("unit_id", parsed.unitId).maybeSingle();
  const { error } = await supabase
    .from("daily_manual_restock_items")
    .delete()
    .eq("id", parsed.itemId)
    .eq("unit_id", parsed.unitId);
  if (error) throw new Error(error.message);
  await logSystemEvent({
    actorType: "crew",
    actorName: "Crew",
    area: "restocking",
    action: "manual_restock_item.deleted",
    targetType: "unit",
    targetId: parsed.unitId,
    targetName: await getUnitName(supabase, parsed.unitId),
    beforeData: before ?? { item_id: parsed.itemId },
  });
}

export async function getManualRestockItems(unitId: string, shiftDate: string, shiftPeriod: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("daily_manual_restock_items")
    .select("id, item_name, note, source_name, addressed")
    .eq("unit_id", unitId)
    .eq("shift_date", shiftDate)
    .eq("shift_period", shiftPeriod)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as { id: string; item_name: string; note: string; source_name: string; addressed: boolean }[];
}

export async function getManualRestockAddressed(unitId: string, shiftDate: string, shiftPeriod: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("daily_manual_restock_items")
    .select("id")
    .eq("unit_id", unitId)
    .eq("shift_date", shiftDate)
    .eq("shift_period", shiftPeriod)
    .eq("addressed", true);
  if (error) throw new Error(error.message);
  return (data ?? []) as { id: string }[];
}
