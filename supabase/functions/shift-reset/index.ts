import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type ShiftPeriod = "daily";

type ShiftName = "1st Shift" | "2nd Shift" | "3rd Shift";

const SHIFT_ANCHOR_DATE = "2026-05-08";
const SHIFT_NAMES: ShiftName[] = ["1st Shift", "2nd Shift", "3rd Shift"];

function daysBetween(from: string, to: string) {
  return Math.round((new Date(`${to}T00:00:00.000Z`).getTime() - new Date(`${from}T00:00:00.000Z`).getTime()) / 86400000);
}

function modulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function getShiftNameForDate(operationalDate: string): ShiftName {
  return SHIFT_NAMES[modulo(daysBetween(SHIFT_ANCHOR_DATE, operationalDate), SHIFT_NAMES.length)];
}

function shiftBoundaryIso(operationalDate: string, dayOffset: number) {
  const date = new Date(`${operationalDate}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + dayOffset);
  const boundaryDate = date.toISOString().slice(0, 10);
  return new Date(`${boundaryDate}T06:00:00-04:00`).toISOString();
}

function getPreviousShift(now = new Date()): { shiftDate: string; shiftPeriod: ShiftPeriod } {
  const local = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  local.setDate(local.getDate() - 1);

  return { shiftDate: local.toISOString().slice(0, 10), shiftPeriod: "daily" };
}

function minIso(values: Array<string | null | undefined>) {
  const timestamps = values.filter(Boolean).map((value) => new Date(value as string).getTime()).filter(Number.isFinite);
  if (timestamps.length === 0) return null;
  return new Date(Math.min(...timestamps)).toISOString();
}

function maxIso(values: Array<string | null | undefined>) {
  const timestamps = values.filter(Boolean).map((value) => new Date(value as string).getTime()).filter(Number.isFinite);
  if (timestamps.length === 0) return null;
  return new Date(Math.max(...timestamps)).toISOString();
}

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response("Missing Supabase environment variables", { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { shiftDate, shiftPeriod } = getPreviousShift();

  const { data: existingShiftCalendar, error: existingShiftCalendarError } = await supabase
    .from("shift_calendar")
    .select("id, operational_date, shift_name, starts_at, ends_at")
    .eq("operational_date", shiftDate)
    .maybeSingle();

  if (existingShiftCalendarError) {
    return Response.json({ error: existingShiftCalendarError.message }, { status: 500 });
  }

  const shiftName = getShiftNameForDate(shiftDate);
  const { data: insertedShiftCalendar, error: shiftCalendarError } = existingShiftCalendar ? { data: null, error: null } : await supabase
    .from("shift_calendar")
    .upsert({
      operational_date: shiftDate,
      shift_name: shiftName,
      starts_at: shiftBoundaryIso(shiftDate, 0),
      ends_at: shiftBoundaryIso(shiftDate, 1),
    }, { onConflict: "operational_date" })
    .select("id, operational_date, shift_name, starts_at, ends_at")
    .single();

  if (shiftCalendarError) {
    return Response.json({ error: shiftCalendarError.message }, { status: 500 });
  }

  const shiftCalendar = existingShiftCalendar ?? insertedShiftCalendar;

  if (!shiftCalendar) {
    return Response.json({ error: "Unable to resolve shift calendar" }, { status: 500 });
  }

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
    const startedAt = minIso((checks ?? []).map((check) => check.started_at ?? check.created_at));
    const submittedAt = maxIso((checks ?? []).filter((check) => check.status === "completed").map((check) => check.submitted_at ?? check.completed_at));
    const lastActivityAt = maxIso((checks ?? []).map((check) => check.last_activity_at ?? check.updated_at));
    const timeToCompleteSeconds = startedAt && submittedAt ? Math.max(0, Math.round((new Date(submittedAt).getTime() - new Date(startedAt).getTime()) / 1000)) : null;
    const checkedBy = (checks ?? [])
      .filter((check) => check.status === "completed" && check.checked_by)
      .sort((a, b) => new Date(b.submitted_at ?? b.completed_at ?? 0).getTime() - new Date(a.submitted_at ?? a.completed_at ?? 0).getTime())[0]?.checked_by ?? null;

    const { error: archiveError } = await supabase.from("shift_archives").upsert({
      shift_date: shiftDate,
      shift_period: shiftPeriod,
      operational_date: shiftCalendar.operational_date,
      shift_id: shiftCalendar.id,
      unit_id: unit.id,
      status,
      completion_percentage: completionPercentage,
      completed_compartments: completed,
      total_compartments: totalCompartments,
      started_at: startedAt,
      submitted_at: submittedAt,
      last_activity_at: lastActivityAt,
      time_to_complete_seconds: timeToCompleteSeconds,
      checked_by: checkedBy,
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
