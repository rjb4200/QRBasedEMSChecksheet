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
  const { error } = await supabase.rpc("save_compartment_check_atomic", {
    p_unit_id: input.unitId,
    p_target_type: input.targetType,
    p_target_id: input.targetId,
    p_shift_date: shift.shiftDate,
    p_shift_period: shift.shiftPeriod,
    p_status: input.status,
    p_item_data: input.itemData ?? null,
    p_time_on_page: input.timeOnPage ?? null,
    p_checked_by: input.status === "completed" ? user?.id ?? null : null,
  });
  if (error) throw new Error(error.message);

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
