import { getCheckoffDiscrepanciesForRange, type CheckoffDiscrepancy } from "@/lib/discrepancies";
import { getCurrentShift } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";

export type DailyReportRecipient = {
  id: string;
  username: string;
  email: string;
};

export type DailyReportUncheckedUnit = {
  unitName: string;
  completedCompartments: number;
  totalCompartments: number;
  completionPercentage: number;
};

export type DailyEmailReport = {
  reportDate: string;
  generatedAt: string;
  uncheckedUnits: DailyReportUncheckedUnit[];
  exceptions: CheckoffDiscrepancy[];
  recipients: DailyReportRecipient[];
};

type UnitRow = {
  id: string;
  name: string;
  unit_compartments?: { id: string }[] | null;
  unit_kits?: { id: string }[] | null;
};

type CheckRow = {
  unit_id: string;
  status: string;
};

type CrewRow = {
  unit_id: string;
  provider_names: string | null;
  locked: boolean | null;
};

export function getDailyReportDate(date = new Date()) {
  return getCurrentShift(date).shiftDate;
}

export async function getDailyReportRecipients(): Promise<DailyReportRecipient[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, username, email, receives_daily_report")
    .not("email", "is", null)
    .neq("email", "")
    .eq("receives_daily_report", true)
    .order("username");

  if (error) throw new Error(error.message);

  return (data ?? []).map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
  }));
}

export async function getUncheckedUnits(reportDate: string): Promise<DailyReportUncheckedUnit[]> {
  const supabase = createAdminClient();
  const [{ data: units, error: unitsError }, { data: checks, error: checksError }, { data: crews, error: crewsError }] = await Promise.all([
    supabase
      .from("units")
      .select("id, name, unit_compartments(id), unit_kits(id)")
      .eq("status", "in_service")
      .is("deleted_at", null)
      .order("name"),
    supabase
      .from("compartment_checks")
      .select("unit_id, status")
      .eq("shift_date", reportDate)
      .eq("shift_period", "daily"),
    supabase
      .from("daily_unit_crews")
      .select("unit_id, provider_names, locked")
      .eq("shift_date", reportDate)
      .eq("shift_period", "daily"),
  ]);

  if (unitsError) throw new Error(unitsError.message);
  if (checksError) throw new Error(checksError.message);
  if (crewsError) throw new Error(crewsError.message);

  const checkRows = (checks ?? []) as CheckRow[];
  const crewMap = new Map(((crews ?? []) as CrewRow[]).map((crew) => [crew.unit_id, Boolean(crew.locked && crew.provider_names?.trim())]));

  return ((units ?? []) as UnitRow[]).map((unit) => {
    const totalCompartments = (unit.unit_compartments?.length ?? 0) + (unit.unit_kits?.length ?? 0) + 1;
    const completedCompartments = checkRows.filter((check) => check.unit_id === unit.id && check.status === "completed").length + (crewMap.get(unit.id) ? 1 : 0);
    const completionPercentage = totalCompartments === 0 ? 0 : Math.round((completedCompartments / totalCompartments) * 10000) / 100;
    return { unitName: unit.name, completedCompartments, totalCompartments, completionPercentage };
  }).filter((unit) => unit.totalCompartments > 0 && unit.completionPercentage < 100);
}

export async function getDailyEmailReport(reportDate = getDailyReportDate()): Promise<DailyEmailReport> {
  const [uncheckedUnits, exceptions, recipients] = await Promise.all([
    getUncheckedUnits(reportDate),
    getCheckoffDiscrepanciesForRange(reportDate, reportDate),
    getDailyReportRecipients(),
  ]);

  return {
    reportDate,
    generatedAt: new Date().toISOString(),
    uncheckedUnits,
    exceptions,
    recipients,
  };
}
