"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentShift } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";

const pathSchema = z.object({ unitId: z.string().uuid(), compartmentId: z.string().uuid() });
const targetSchema = z.object({ unitId: z.string().uuid(), targetId: z.string().uuid(), targetType: z.enum(["compartment", "kit"]).default("compartment") });

async function upsertTargetCheck(input: z.infer<typeof targetSchema> & { status: "in_progress" | "completed"; itemData?: Record<string, unknown>; timeOnPage?: number; completedAt?: string | null }) {
  const supabase = createAdminClient();
  const shift = getCurrentShift();
  const targetColumn = input.targetType === "kit" ? "unit_kit_id" : "compartment_id";
  const { data: existing, error: existingError } = await supabase
    .from("compartment_checks")
    .select("id")
    .eq("unit_id", input.unitId)
    .eq(targetColumn, input.targetId)
    .eq("shift_date", shift.shiftDate)
    .eq("shift_period", shift.shiftPeriod)
    .maybeSingle();
  if (existingError) throw new Error(existingError.message);

  const payload = {
    unit_id: input.unitId,
    compartment_id: input.targetType === "compartment" ? input.targetId : null,
    unit_kit_id: input.targetType === "kit" ? input.targetId : null,
    shift_date: shift.shiftDate,
    shift_period: shift.shiftPeriod,
    status: input.status,
    checked_by: null,
    ...(input.itemData ? { item_data: input.itemData } : {}),
    ...(input.timeOnPage !== undefined ? { time_on_page: input.timeOnPage } : {}),
    ...(input.completedAt !== undefined ? { completed_at: input.completedAt } : {}),
    last_activity_at: new Date().toISOString(),
  };

  const result = existing
    ? await supabase.from("compartment_checks").update(payload).eq("id", existing.id)
    : await supabase.from("compartment_checks").insert(payload);
  if (result.error) throw new Error(result.error.message);
}

export async function takeOverCheckoff(formData: FormData) {
  const parsed = pathSchema.parse({ unitId: formData.get("unitId"), compartmentId: formData.get("compartmentId") });
  await upsertTargetCheck({ unitId: parsed.unitId, targetId: parsed.compartmentId, targetType: "compartment", status: "in_progress" });
  redirect(`/checkoff/${parsed.unitId}/${parsed.compartmentId}`);
}

export async function saveCheckData(unitId: string, targetId: string, itemData: Record<string, unknown>, timeOnPage: number, targetType: "compartment" | "kit" = "compartment") {
  const parsed = targetSchema.parse({ unitId, targetId, targetType });
  await upsertTargetCheck({ ...parsed, status: "in_progress", itemData, timeOnPage });
}

export async function submitCheckData(unitId: string, targetId: string, itemData: Record<string, unknown>, timeOnPage: number, targetType: "compartment" | "kit" = "compartment") {
  const parsed = targetSchema.parse({ unitId, targetId, targetType });
  await upsertTargetCheck({ ...parsed, status: "completed", itemData, timeOnPage, completedAt: new Date().toISOString() });
  revalidatePath(`/units/${parsed.unitId}`);
  redirect(`/units/${parsed.unitId}`);
}

export async function takeOverKitCheckoff(formData: FormData) {
  const parsed = targetSchema.parse({ unitId: formData.get("unitId"), targetId: formData.get("unitKitId"), targetType: "kit" });
  await upsertTargetCheck({ ...parsed, status: "in_progress" });
  redirect(`/checkoff/${parsed.unitId}/kit/${parsed.targetId}`);
}
