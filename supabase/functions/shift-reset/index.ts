import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type ShiftPeriod = "daily";

function getPreviousShift(now = new Date()): { shiftDate: string; shiftPeriod: ShiftPeriod } {
  const local = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  local.setDate(local.getDate() - 1);

  return { shiftDate: local.toISOString().slice(0, 10), shiftPeriod: "daily" };
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
    .select("id, name, status, unit_compartments(id), unit_kits(id)")
    .is("deleted_at", null);

  if (unitsError) {
    return Response.json({ error: unitsError.message }, { status: 500 });
  }

  const ledgerRows = (units ?? []).map((unit) => ({
    shift_date: shiftDate,
    shift_period: shiftPeriod,
    unit_id: unit.id,
    unit_name: unit.name,
    unit_status: unit.status,
    total_compartments: (unit.unit_compartments?.length ?? 0) + (unit.unit_kits?.length ?? 0),
  }));

  if (ledgerRows.length > 0) {
    const { error: ledgerError } = await supabase
      .from("daily_unit_ledgers")
      .upsert(ledgerRows, { onConflict: "shift_date,shift_period,unit_id" });

    if (ledgerError) {
      return Response.json({ error: ledgerError.message }, { status: 500 });
    }
  }

  for (const unit of (units ?? []).filter((unit) => unit.status === "in_service")) {
    const totalCompartments = (unit.unit_compartments?.length ?? 0) + (unit.unit_kits?.length ?? 0);
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

    const { error: archiveError } = await supabase.from("shift_archives").upsert({
      shift_date: shiftDate,
      shift_period: shiftPeriod,
      unit_id: unit.id,
      status,
      completion_percentage: completionPercentage,
      completed_compartments: completed,
      total_compartments: totalCompartments,
      check_data: checks ?? [],
    }, { onConflict: "shift_date,shift_period,unit_id" });

    if (archiveError) {
      return Response.json({ error: archiveError.message }, { status: 500 });
    }

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
