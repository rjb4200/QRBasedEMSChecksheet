"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentShift } from "@/lib/shifts";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";

const pathSchema = z.object({ unitId: z.string().uuid(), compartmentId: z.string().uuid() });
const targetSchema = z.object({ unitId: z.string().uuid(), targetId: z.string().uuid(), targetType: z.enum(["compartment", "kit"]).default("compartment") });

async function upsertTargetCheck(input: z.infer<typeof targetSchema> & { status: "in_progress" | "completed"; itemData?: Record<string, unknown>; timeOnPage?: number; sectionComment?: string; sourceName?: string }) {
  const supabase = createAdminClient();
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  const shift = getCurrentShift();
  const targetColumn = input.targetType === "kit" ? "unit_kit_id" : "compartment_id";
  const { data: existing, error: existingError } = await supabase
    .from("compartment_checks")
    .select("id, started_at")
    .eq("unit_id", input.unitId)
    .eq(targetColumn, input.targetId)
    .eq("shift_date", shift.shiftDate)
    .eq("shift_period", shift.shiftPeriod)
    .maybeSingle();
  if (existingError) throw new Error(existingError.message);

  const now = new Date().toISOString();
  const startedAt = existing?.started_at ?? now;
  const submittedAt = input.status === "completed" ? now : null;
  const timeToCompleteSeconds = submittedAt ? Math.max(0, Math.round((new Date(submittedAt).getTime() - new Date(startedAt).getTime()) / 1000)) : null;
  const payload = {
    unit_id: input.unitId,
    compartment_id: input.targetType === "compartment" ? input.targetId : null,
    unit_kit_id: input.targetType === "kit" ? input.targetId : null,
    shift_date: shift.shiftDate,
    shift_period: shift.shiftPeriod,
    status: input.status,
    ...(input.itemData ? { item_data: input.itemData } : {}),
    ...(input.timeOnPage !== undefined ? { time_on_page: input.timeOnPage } : {}),
    ...(input.status === "completed" ? { completed_at: submittedAt, submitted_at: submittedAt, time_to_complete_seconds: timeToCompleteSeconds } : {}),
    ...(input.status === "completed" && user?.id ? { checked_by: user.id } : {}),
    last_activity_at: now,
  };

  const result = existing
    ? await supabase.from("compartment_checks").update(payload).eq("id", existing.id)
    : await supabase.from("compartment_checks").insert({ ...payload, started_at: startedAt, ...(!user?.id ? { checked_by: null } : {}) });
  if (result.error) throw new Error(result.error.message);

  if (input.status === "completed" && input.sectionComment !== undefined && input.sourceName) {
    const comment = input.sectionComment.trim();
    const commentQuery = supabase
      .from("daily_section_comments")
      .delete()
      .eq("unit_id", input.unitId)
      .eq("shift_date", shift.shiftDate)
      .eq("shift_period", shift.shiftPeriod)
      .eq("source_type", input.targetType)
      .eq("source_id", input.targetId);

    if (comment) {
      const { error: commentError } = await supabase.from("daily_section_comments").upsert({
        unit_id: input.unitId,
        shift_date: shift.shiftDate,
        shift_period: shift.shiftPeriod,
        source_type: input.targetType,
        source_id: input.targetId,
        source_name: input.sourceName,
        comment,
      }, { onConflict: "shift_date,shift_period,unit_id,source_type,source_id" });
      if (commentError) throw new Error(commentError.message);
    } else {
      const { error: commentError } = await commentQuery;
      if (commentError) throw new Error(commentError.message);
    }
  }
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

export async function submitCheckData(unitId: string, targetId: string, itemData: Record<string, unknown>, timeOnPage: number, targetType: "compartment" | "kit" = "compartment", sectionComment = "", sourceName = "") {
  const parsed = targetSchema.parse({ unitId, targetId, targetType });
  await upsertTargetCheck({ ...parsed, status: "completed", itemData, timeOnPage, sectionComment, sourceName });
  revalidatePath(`/units/${parsed.unitId}`);
  redirect(`/units/${parsed.unitId}`);
}

export async function takeOverKitCheckoff(formData: FormData) {
  const parsed = targetSchema.parse({ unitId: formData.get("unitId"), targetId: formData.get("unitKitId"), targetType: "kit" });
  await upsertTargetCheck({ ...parsed, status: "in_progress" });
  redirect(`/checkoff/${parsed.unitId}/kit/${parsed.targetId}`);
}
