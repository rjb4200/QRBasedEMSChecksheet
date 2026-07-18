import { addDays, eachDate } from "@/lib/records/date-range";
import { getCurrentShift } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";

export type DailyCheckoffSummary = {
  date: string;
  state: "live" | "finalized" | "reconstructed" | "unavailable";
  completedActions: number;
  requiredActions: number;
  completedUnits: number;
  requiredUnits: number;
};

export async function getDailyCheckoffSummaries() {
  const supabase = createAdminClient();
  const currentShift = getCurrentShift();
  const { error: startError } = await supabase.rpc("start_daily_checkoff_summary", {
    p_shift_date: currentShift.shiftDate,
    p_shift_period: currentShift.shiftPeriod,
  });
  if (startError) throw new Error(startError.message);

  const currentDate = new Date(`${currentShift.shiftDate}T00:00:00.000Z`);
  const dates = eachDate(addDays(currentDate, -13), currentDate).reverse();
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
