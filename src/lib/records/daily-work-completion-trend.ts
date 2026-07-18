import { refreshDailyUnitLedgers } from "@/lib/daily-unit-ledgers";
import { getCurrentShift } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { addDays, eachDate } from "@/lib/records/date-range";
import { unstable_noStore as noStore } from "next/cache";

type TrendLedgerRow = { shift_date: string; unit_id: string; unit_status: string; total_compartments: number };
type TrendCheckRow = { id?: string; shift_date: string; unit_id: string; target_type?: string | null; target_id?: string | null; compartment_id: string | null; unit_kit_id: string | null; status: string };
type TrendCrewRow = { shift_date: string; unit_id: string; provider_names: string | null; locked: boolean | null };

export type DailyWorkCompletion = {
  date: string;
  state: "available" | "unavailable" | "not_applicable";
  completedWork: number;
  requiredWork: number;
  percentage: number | null;
};

export function buildDailyWorkCompletionTrend(params: { dates: string[]; ledgers: TrendLedgerRow[]; checks: TrendCheckRow[]; crews: TrendCrewRow[] }) {
  const { dates, ledgers, checks, crews } = params;

  return dates.map((date) => {
    const dateLedgers = ledgers.filter((ledger) => ledger.shift_date === date);
    if (dateLedgers.length === 0) {
      return { date, state: "unavailable", completedWork: 0, requiredWork: 0, percentage: null } satisfies DailyWorkCompletion;
    }

    const inServiceUnitIds = new Set(dateLedgers.filter((ledger) => ledger.unit_status === "in_service").map((ledger) => ledger.unit_id));
    const requiredWork = dateLedgers
      .filter((ledger) => inServiceUnitIds.has(ledger.unit_id))
      .reduce((total, ledger) => total + ledger.total_compartments + 1, 0);

    if (requiredWork === 0) {
      return { date, state: "not_applicable", completedWork: 0, requiredWork: 0, percentage: null } satisfies DailyWorkCompletion;
    }

    const completedTargets = new Set(
      checks
        .filter((check) => check.shift_date === date && check.status === "completed" && inServiceUnitIds.has(check.unit_id))
        .flatMap((check) => {
          const targetId = check.target_id ?? check.compartment_id ?? check.unit_kit_id;
          const targetType = check.target_type ?? (check.compartment_id ? "compartment" : check.unit_kit_id ? "kit" : null);
          const identity = targetId && targetType ? `${check.unit_id}:${targetType}:${targetId}` : check.id;
          return identity ? [identity] : [];
        }),
    );
    const completedCrews = new Set(
      crews
        .filter((crew) => crew.shift_date === date && inServiceUnitIds.has(crew.unit_id) && crew.locked && crew.provider_names?.trim())
        .map((crew) => crew.unit_id),
    );
    const completedWork = Math.min(requiredWork, completedTargets.size + completedCrews.size);

    return {
      date,
      state: "available",
      completedWork,
      requiredWork,
      percentage: Math.round((completedWork / requiredWork) * 100),
    } satisfies DailyWorkCompletion;
  });
}

export async function getDailyWorkCompletionTrend() {
  noStore();
  const supabase = createAdminClient();
  const currentShift = getCurrentShift();
  await refreshDailyUnitLedgers(supabase, currentShift);
  const currentShiftDate = new Date(`${currentShift.shiftDate}T00:00:00.000Z`);
  const dates = eachDate(addDays(currentShiftDate, -13), currentShiftDate).reverse();
  const [{ data: ledgers, error: ledgersError }, { data: checks, error: checksError }, { data: crews, error: crewsError }] = await Promise.all([
    supabase.from("daily_unit_ledgers").select("shift_date, unit_id, unit_status, total_compartments").in("shift_date", dates).eq("shift_period", "daily"),
    supabase.from("compartment_checks").select("id, shift_date, unit_id, target_type, target_id, compartment_id, unit_kit_id, status").in("shift_date", dates).eq("shift_period", "daily"),
    supabase.from("daily_unit_crews").select("shift_date, unit_id, provider_names, locked").in("shift_date", dates).eq("shift_period", "daily"),
  ]);

  if (ledgersError || checksError || crewsError) {
    throw ledgersError ?? checksError ?? crewsError;
  }

  return buildDailyWorkCompletionTrend({
    dates,
    ledgers: (ledgers ?? []) as TrendLedgerRow[],
    checks: (checks ?? []) as TrendCheckRow[],
    crews: (crews ?? []) as TrendCrewRow[],
  });
}
