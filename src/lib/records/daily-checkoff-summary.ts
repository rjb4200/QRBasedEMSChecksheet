import { addDays, eachDate } from "@/lib/records/date-range";
import { getCurrentShift, getShiftNameForDate, type ShiftName } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";

export type DailyCheckoffSummary = {
  date: string;
  state: "live" | "finalized" | "reconstructed" | "unavailable";
  completedActions: number;
  requiredActions: number;
  completedUnits: number;
  requiredUnits: number;
};

export type ShiftCompletionAverage = {
  shiftName: ShiftName;
  completedActions: number;
  requiredActions: number;
  percentage: number | null;
};

const SHIFT_NAMES: ShiftName[] = ["1st Shift", "2nd Shift", "3rd Shift"];

function isShiftName(value: string | null | undefined): value is ShiftName {
  return value === "1st Shift" || value === "2nd Shift" || value === "3rd Shift";
}

export function buildShiftCompletionAverages(
  summaries: Pick<DailyCheckoffSummary, "date" | "completedActions" | "requiredActions">[],
  calendarAssignments: Map<string, string>,
): ShiftCompletionAverage[] {
  const totals = new Map(SHIFT_NAMES.map((shiftName) => [shiftName, { completedActions: 0, requiredActions: 0 }]));

  for (const summary of summaries) {
    if (summary.requiredActions === 0) continue;
    const assignedShift = calendarAssignments.get(summary.date);
    const shiftName = isShiftName(assignedShift) ? assignedShift : getShiftNameForDate(summary.date);
    const total = totals.get(shiftName)!;
    total.completedActions += summary.completedActions;
    total.requiredActions += summary.requiredActions;
  }

  return SHIFT_NAMES.map((shiftName) => {
    const total = totals.get(shiftName)!;
    return {
      shiftName,
      ...total,
      percentage: total.requiredActions === 0 ? null : Math.round((total.completedActions / total.requiredActions) * 100),
    };
  });
}

async function startCurrentSummary() {
  const supabase = createAdminClient();
  const currentShift = getCurrentShift();
  const { error: startError } = await supabase.rpc("start_daily_checkoff_summary", {
    p_shift_date: currentShift.shiftDate,
    p_shift_period: currentShift.shiftPeriod,
  });
  if (startError) throw new Error(startError.message);
  return { supabase, currentShift };
}

export async function getDailyCheckoffSummaries(dayCount = 9) {
  const { supabase, currentShift } = await startCurrentSummary();

  const currentDate = new Date(`${currentShift.shiftDate}T00:00:00.000Z`);
  const dates = eachDate(addDays(currentDate, 1 - dayCount), currentDate).reverse();
  const { data, error } = await supabase
    .from("daily_checkoff_summaries")
    .select("shift_date, summary_state, completed_actions, required_actions, completed_units, required_units")
    .in("shift_date", dates)
    .eq("shift_period", "daily");
  if (error) throw new Error(error.message);

  const summaries = new Map((data ?? []).map((summary) => [summary.shift_date, summary]));
  return dates.map((date) => {
    const summary = summaries.get(date);
    return summary
      ? {
        date,
        state: summary.summary_state as DailyCheckoffSummary["state"],
        completedActions: summary.completed_actions,
        requiredActions: summary.required_actions,
        completedUnits: summary.completed_units,
        requiredUnits: summary.required_units,
      }
      : { date, state: "unavailable", completedActions: 0, requiredActions: 0, completedUnits: 0, requiredUnits: 0 };
  }) satisfies DailyCheckoffSummary[];
}

export async function getShiftCompletionAverages() {
  const { supabase, currentShift } = await startCurrentSummary();
  const currentDate = new Date(`${currentShift.shiftDate}T00:00:00.000Z`);
  const dates = eachDate(addDays(currentDate, -29), currentDate).reverse();
  const [{ data: summaries, error: summariesError }, { data: calendar, error: calendarError }] = await Promise.all([
    supabase
      .from("daily_checkoff_summaries")
      .select("shift_date, completed_actions, required_actions")
      .in("shift_date", dates)
      .eq("shift_period", "daily"),
    supabase
      .from("shift_calendar")
      .select("operational_date, shift_name")
      .in("operational_date", dates),
  ]);
  if (summariesError) throw new Error(summariesError.message);
  if (calendarError) throw new Error(calendarError.message);

  return buildShiftCompletionAverages(
    (summaries ?? []).map((summary) => ({
      date: summary.shift_date,
      completedActions: summary.completed_actions,
      requiredActions: summary.required_actions,
    })),
    new Map((calendar ?? []).map((entry) => [entry.operational_date, entry.shift_name])),
  );
}
