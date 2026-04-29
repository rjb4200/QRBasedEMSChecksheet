"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentShift } from "@/lib/shifts";
import { createClient } from "@/lib/supabase/server";

export async function signOffUnit(formData: FormData) {
  const unitId = z.string().uuid().parse(formData.get("unitId"));
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");
  const shift = getCurrentShift();

  const { error } = await supabase.from("personnel_signatures").upsert({
    unit_id: unitId,
    shift_date: shift.shiftDate,
    shift_period: shift.shiftPeriod,
    user_id: auth.user.id,
  }, { onConflict: "unit_id,shift_date,shift_period,user_id" });

  if (error) throw new Error(error.message);
  revalidatePath(`/units/${unitId}`);
}
