"use server";

import { z } from "zod";
import { getCurrentShift } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";

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
