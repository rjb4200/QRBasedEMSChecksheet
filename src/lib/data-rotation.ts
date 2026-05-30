import { createAdminClient } from "@/lib/supabase/server-admin";
import { getCurrentShift } from "@/lib/shifts";
import { generateExportPackage } from "@/lib/export-package";
import { logSystemEvent } from "@/lib/system-log";

export type RotationCounts = {
  compartment_checks: number;
  shift_archives: number;
  daily_unit_ledgers: number;
  daily_unit_crews: number;
  daily_unit_comments: number;
  daily_section_comments: number;
  daily_restock_items: number;
  daily_email_report_runs: number;
};

export type RotationDateAvailability = {
  oldestDate: string;
  newestDate: string;
};

const ROTATION_DATE_TABLES = [
  { table: "compartment_checks", column: "shift_date", unitScoped: true },
  { table: "shift_archives", column: "shift_date", unitScoped: true },
  { table: "daily_unit_ledgers", column: "shift_date", unitScoped: true },
  { table: "daily_unit_crews", column: "shift_date", unitScoped: true },
  { table: "daily_unit_comments", column: "shift_date", unitScoped: true },
  { table: "daily_section_comments", column: "shift_date", unitScoped: true },
  { table: "daily_restock_items", column: "shift_date", unitScoped: true },
  { table: "daily_email_report_runs", column: "report_date", unitScoped: false },
] as const;

function daysBetween(from: string, to: string) {
  const fromDate = new Date(`${from}T00:00:00.000Z`);
  const toDate = new Date(`${to}T00:00:00.000Z`);
  return Math.round((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
}

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateInputValue(date);
}

function earliestDate(...values: string[]) {
  return values.sort()[0];
}

export function validateRotationRange(from: string, to: string) {
  const errors: string[] = [];

  if (!from || !to) {
    errors.push("Both from and to dates are required.");
    return { valid: false, errors };
  }

  const rangeDays = daysBetween(from, to);
  if (rangeDays > 60) {
    errors.push(`Date range cannot exceed 60 days (selected: ${rangeDays} days).`);
  }

  if (from > to) {
    errors.push("From date must be before or equal to to date.");
  }

  const today = getCurrentShift().shiftDate;
  if (to >= today) {
    errors.push("Today's shift records cannot be cleared. Select a to date before today's shift.");
  }

  return { valid: errors.length === 0, errors };
}

export async function previewRotationCounts(from: string, to: string, unitId?: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("preview_operational_counts", {
    from_date: from,
    to_date: to,
    unit_id: unitId ?? null,
  });

  if (error) throw new Error(`Failed to preview rotation counts: ${error.message}`);
  return data as unknown as RotationCounts;
}

async function getBoundaryDate(params: { table: string; column: string; direction: "oldest" | "newest"; beforeDate: string; unitId?: string; unitScoped: boolean }) {
  const supabase = createAdminClient();
  let query = supabase
    .from(params.table)
    .select(params.column)
    .lt(params.column, params.beforeDate)
    .order(params.column, { ascending: params.direction === "oldest" })
    .limit(1);

  if (params.unitId && params.unitScoped) {
    query = query.eq("unit_id", params.unitId);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load rotation date availability: ${error.message}`);

  const row = Array.isArray(data) ? data[0] : null;
  const value = row?.[params.column as keyof typeof row];
  return typeof value === "string" ? value : null;
}

export async function getRotationDateAvailability(unitId?: string): Promise<RotationDateAvailability | null> {
  const today = getCurrentShift().shiftDate;
  const boundaryDates = await Promise.all(
    ROTATION_DATE_TABLES.flatMap((table) => [
      getBoundaryDate({ ...table, direction: "oldest", beforeDate: today, unitId }),
      getBoundaryDate({ ...table, direction: "newest", beforeDate: today, unitId }),
    ]),
  );
  const dates = boundaryDates.filter((date): date is string => Boolean(date));

  if (dates.length === 0) {
    return null;
  }

  return {
    oldestDate: dates.sort()[0],
    newestDate: dates.sort().at(-1) ?? dates[0],
  };
}

export function getDefaultRotationRange(availability: RotationDateAvailability | null, fallbackDate: string) {
  if (!availability) {
    return { from: fallbackDate, to: fallbackDate };
  }

  return {
    from: availability.oldestDate,
    to: earliestDate(addDays(availability.oldestDate, 60), availability.newestDate),
  };
}

export async function clearOperationalRecords(from: string, to: string, unitId?: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("clear_operational_records", {
    from_date: from,
    to_date: to,
    unit_id: unitId ?? null,
  });

  if (error) throw new Error(`Failed to clear operational records: ${error.message}`);
  return data as unknown as RotationCounts;
}

export async function rotateRecords(from: string, to: string, unitId?: string) {
  const validation = validateRotationRange(from, to);
  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  const { archive, filename } = await generateExportPackage({ from, to, unitId });
  const chunks: Buffer[] = [];
  for await (const chunk of archive) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const zipBuffer = Buffer.concat(chunks);

  if (zipBuffer.length === 0) {
    throw new Error("Export package is empty. Clearing aborted.");
  }

  const counts = await clearOperationalRecords(from, to, unitId);

  const totalCleared = Object.values(counts).reduce((sum, count) => sum + (typeof count === "number" ? count : 0), 0);

  await logSystemEvent({
    actorType: "admin",
    action: "rotate_records",
    area: "data_rotation",
    targetType: "records",
    result: "success",
    metadata: {
      exportId: crypto.randomUUID(),
      dateRange: { from, to },
      unitId: unitId ?? null,
      clearedCounts: counts,
      totalCleared,
    },
  });

  return { counts, totalCleared, exportFilename: filename };
}
