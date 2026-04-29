import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type ShiftPeriod = "day" | "night";

function getPreviousShift(now = new Date()): { shiftDate: string; shiftPeriod: ShiftPeriod } {
  const local = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const hour = local.getHours();
  const shiftDate = new Date(local);

  if (hour >= 6 && hour < 18) {
    shiftDate.setDate(shiftDate.getDate() - 1);
    return { shiftDate: shiftDate.toISOString().slice(0, 10), shiftPeriod: "night" };
  }

  return { shiftDate: shiftDate.toISOString().slice(0, 10), shiftPeriod: "day" };
}

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response("Missing Supabase environment variables", { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { shiftDate, shiftPeriod } = getPreviousShift();

  const { data: units, error: unitsError } = await supabase
    .from("units")
    .select("id, unit_compartments(id)")
    .eq("status", "in_service");

  if (unitsError) {
    return Response.json({ error: unitsError.message }, { status: 500 });
  }

  for (const unit of units ?? []) {
    const totalCompartments = unit.unit_compartments?.length ?? 0;
    const { data: checks, error: checksError } = await supabase
      .from("compartment_checks")
      .select("*")
      .eq("unit_id", unit.id)
      .eq("shift_date", shiftDate)
      .eq("shift_period", shiftPeriod);

    if (checksError) {
      return Response.json({ error: checksError.message }, { status: 500 });
    }

    const completed = (checks ?? []).filter((check) => check.status === "completed").length;
    const partial = (checks ?? []).filter((check) => check.status === "in_progress").length;
    const status = partial > 0 || completed < totalCompartments ? "partially_complete" : "completed";
    const completionPercentage = totalCompartments === 0 ? 0 : Math.round((completed / totalCompartments) * 10000) / 100;

    await supabase.from("shift_archives").upsert({
      shift_date: shiftDate,
      shift_period: shiftPeriod,
      unit_id: unit.id,
      status,
      completion_percentage: completionPercentage,
      completed_compartments: completed,
      total_compartments: totalCompartments,
      check_data: checks ?? [],
    }, { onConflict: "shift_date,shift_period,unit_id" });

    await supabase
      .from("compartment_checks")
      .update({ status: "partially_complete" })
      .eq("unit_id", unit.id)
      .eq("shift_date", shiftDate)
      .eq("shift_period", shiftPeriod)
      .eq("status", "in_progress");
  }

  return Response.json({ ok: true, shiftDate, shiftPeriod });
});
