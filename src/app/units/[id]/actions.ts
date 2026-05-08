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
