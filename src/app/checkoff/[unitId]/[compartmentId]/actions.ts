"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentShift } from "@/lib/shifts";
import { createClient } from "@/lib/supabase/server";

const pathSchema = z.object({ unitId: z.string().uuid(), compartmentId: z.string().uuid() });

export async function takeOverCheckoff(formData: FormData) {
  const parsed = pathSchema.parse({ unitId: formData.get("unitId"), compartmentId: formData.get("compartmentId") });
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");
  const shift = getCurrentShift();

  const { error } = await supabase.from("compartment_checks").upsert({
    unit_id: parsed.unitId,
    compartment_id: parsed.compartmentId,
    shift_date: shift.shiftDate,
    shift_period: shift.shiftPeriod,
    status: "in_progress",
    checked_by: auth.user.id,
    last_activity_at: new Date().toISOString(),
  }, { onConflict: "unit_id,compartment_id,shift_date,shift_period" });

  if (error) throw new Error(error.message);
  redirect(`/checkoff/${parsed.unitId}/${parsed.compartmentId}`);
}

export async function saveCheckData(unitId: string, compartmentId: string, itemData: Record<string, unknown>, timeOnPage: number) {
  const parsed = pathSchema.parse({ unitId, compartmentId });
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Not authenticated");
  const shift = getCurrentShift();

  const { error } = await supabase.from("compartment_checks").upsert({
    unit_id: parsed.unitId,
    compartment_id: parsed.compartmentId,
    shift_date: shift.shiftDate,
    shift_period: shift.shiftPeriod,
    status: "in_progress",
    checked_by: auth.user.id,
    item_data: itemData,
    time_on_page: timeOnPage,
    last_activity_at: new Date().toISOString(),
  }, { onConflict: "unit_id,compartment_id,shift_date,shift_period" });

  if (error) throw new Error(error.message);
}

export async function submitCheckData(unitId: string, compartmentId: string, itemData: Record<string, unknown>, timeOnPage: number) {
  const parsed = pathSchema.parse({ unitId, compartmentId });
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Not authenticated");
  const shift = getCurrentShift();

  const { error } = await supabase.from("compartment_checks").upsert({
    unit_id: parsed.unitId,
    compartment_id: parsed.compartmentId,
    shift_date: shift.shiftDate,
    shift_period: shift.shiftPeriod,
    status: "completed",
    checked_by: auth.user.id,
    item_data: itemData,
    time_on_page: timeOnPage,
    completed_at: new Date().toISOString(),
    last_activity_at: new Date().toISOString(),
  }, { onConflict: "unit_id,compartment_id,shift_date,shift_period" });

  if (error) throw new Error(error.message);
  revalidatePath(`/units/${parsed.unitId}`);
  redirect(`/units/${parsed.unitId}`);
}
