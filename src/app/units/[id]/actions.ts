"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentShift } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";

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
  const { error } = await supabase.from("daily_unit_crews").upsert({
    unit_id: parsed.unitId,
    shift_date: shift.shiftDate,
    shift_period: shift.shiftPeriod,
    provider_names: parsed.providerNames.trim(),
    locked: true,
  }, { onConflict: "shift_date,shift_period,unit_id" });

  if (error) throw new Error(error.message);
}

export async function unlockUnitCrew(unitId: string, providerNames: string) {
  const parsed = z.object({ unitId: z.string().uuid(), providerNames: z.string().max(1000) }).parse({ unitId, providerNames });
  const shift = getCurrentShift();
  const supabase = createAdminClient();
  const { error } = await supabase.from("daily_unit_crews").upsert({
    unit_id: parsed.unitId,
    shift_date: shift.shiftDate,
    shift_period: shift.shiftPeriod,
    provider_names: parsed.providerNames.trim(),
    locked: false,
  }, { onConflict: "shift_date,shift_period,unit_id" });

  if (error) throw new Error(error.message);
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
