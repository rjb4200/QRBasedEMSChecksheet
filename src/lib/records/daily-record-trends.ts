import { refreshDailyUnitLedgers } from "@/lib/daily-unit-ledgers";
import { getCurrentShift } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { eachDate, getDefaultArchiveRange } from "@/lib/records/date-range";
import { getCompletionPercentage } from "@/lib/records/daily-record-builder";
import type { DailyRecordGroup } from "@/lib/records/types";

type TrendLedgerRow = { shift_date: string; unit_id: string; unit_status: string; total_compartments: number };
type TrendCheckRow = { unit_id: string; shift_date: string; status: string };
type TrendCrewRow = { unit_id: string; shift_date: string; provider_names: string | null; locked: boolean | null };

export function buildTrendGroupsFromRows(params: { dates: string[]; ledgers: TrendLedgerRow[]; checks: TrendCheckRow[]; crews: TrendCrewRow[] }) {
  const { dates, ledgers, checks, crews } = params;

  return dates.map((date) => {
    let completedInServiceUnits = 0;
    let totalInServiceUnits = 0;

    for (const ledger of ledgers) {
      if (ledger.shift_date !== date || ledger.unit_status !== "in_service") continue;

      totalInServiceUnits += 1;

      const completedChecks = checks.filter((c) => c.unit_id === ledger.unit_id && c.shift_date === date && c.status === "completed").length;
      const unitCrew = crews.find((c) => c.unit_id === ledger.unit_id && c.shift_date === date && c.locked && c.provider_names?.trim());

      const totalCompartments = ledger.total_compartments + 1;
      const completedCompartments = completedChecks + (unitCrew ? 1 : 0);
      const pct = getCompletionPercentage(completedCompartments, totalCompartments);

      if (pct > 95) completedInServiceUnits += 1;
    }

    return { date, completedInServiceUnits, totalInServiceUnits, records: [] };
  }) satisfies DailyRecordGroup[];
}

export async function getTrendGroups() {
  const supabase = createAdminClient();
  const range = getDefaultArchiveRange({});
  const currentShift = getCurrentShift();

  if (range.from <= currentShift.shiftDate && currentShift.shiftDate <= range.to) {
    await refreshDailyUnitLedgers(supabase, currentShift);
  }

  const dates = eachDate(new Date(`${range.from}T00:00:00.000Z`), new Date(`${range.to}T00:00:00.000Z`)).reverse();

  const [{ data: ledgers }, { data: checks }, { data: crews }] = await Promise.all([
    supabase.from("daily_unit_ledgers").select("shift_date, unit_id, unit_status, total_compartments").in("shift_date", dates).eq("shift_period", "daily"),
    supabase.from("compartment_checks").select("shift_date, unit_id, status").in("shift_date", dates).eq("shift_period", "daily"),
    supabase.from("daily_unit_crews").select("shift_date, unit_id, provider_names, locked").in("shift_date", dates).eq("shift_period", "daily"),
  ]);

  return buildTrendGroupsFromRows({
    dates,
    ledgers: (ledgers ?? []) as TrendLedgerRow[],
    checks: (checks ?? []) as TrendCheckRow[],
    crews: (crews ?? []) as TrendCrewRow[],
  });
}
