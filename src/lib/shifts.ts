export type ShiftPeriod = "daily";
export type ShiftName = "1st Shift" | "2nd Shift" | "3rd Shift";

export type ShiftContext = {
  shiftDate: string;
  shiftPeriod: ShiftPeriod;
  operationalDate: string;
  shiftId: string | null;
  shiftName: ShiftName;
  startsAt: string;
  endsAt: string;
};

const SHIFT_ANCHOR_DATE = "2026-05-08";
const SHIFT_NAMES: ShiftName[] = ["1st Shift", "2nd Shift", "3rd Shift"];

function easternDate(date = new Date()) {
  return new Date(date.toLocaleString("en-US", { timeZone: "America/New_York" }));
}

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function daysBetween(from: string, to: string) {
  const fromDate = new Date(`${from}T00:00:00.000Z`);
  const toDate = new Date(`${to}T00:00:00.000Z`);
  return Math.round((toDate.getTime() - fromDate.getTime()) / 86400000);
}

function modulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function shiftBoundaryIso(operationalDate: string, dayOffset: number) {
  const localNoon = new Date(`${operationalDate}T12:00:00.000Z`);
  localNoon.setUTCDate(localNoon.getUTCDate() + dayOffset);
  const date = toDateInputValue(localNoon);
  return new Date(`${date}T06:00:00-04:00`).toISOString();
}

export function getCurrentShift(date = new Date()): { shiftDate: string; shiftPeriod: ShiftPeriod } {
  const local = easternDate(date);
  const hour = local.getHours();

  if (hour < 6) {
    local.setDate(local.getDate() - 1);
  }

  return {
    shiftDate: toDateInputValue(local),
    shiftPeriod: "daily",
  };
}

export function getShiftNameForDate(operationalDate: string): ShiftName {
  return SHIFT_NAMES[modulo(daysBetween(SHIFT_ANCHOR_DATE, operationalDate), SHIFT_NAMES.length)];
}

export function getOperationalShift(date = new Date()): Omit<ShiftContext, "shiftId"> {
  const { shiftDate, shiftPeriod } = getCurrentShift(date);
  return {
    shiftDate,
    shiftPeriod,
    operationalDate: shiftDate,
    shiftName: getShiftNameForDate(shiftDate),
    startsAt: shiftBoundaryIso(shiftDate, 0),
    endsAt: shiftBoundaryIso(shiftDate, 1),
  };
}

export async function getShiftContext(supabase: any, date = new Date()): Promise<ShiftContext> {
  const shift = getOperationalShift(date);
  const { data, error } = await supabase
    .from("shift_calendar")
    .select("id, operational_date, shift_name, starts_at, ends_at")
    .eq("operational_date", shift.operationalDate)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return {
    ...shift,
    shiftId: data?.id ?? null,
    shiftName: (data?.shift_name as ShiftName | undefined) ?? shift.shiftName,
    startsAt: data?.starts_at ?? shift.startsAt,
    endsAt: data?.ends_at ?? shift.endsAt,
  };
}

export function getPreviousShift(date = new Date()): { shiftDate: string; shiftPeriod: ShiftPeriod } {
  const current = getCurrentShift(date);
  const shiftDate = new Date(`${current.shiftDate}T12:00:00`);
  shiftDate.setDate(shiftDate.getDate() - 1);

  return { shiftDate: toDateInputValue(shiftDate), shiftPeriod: "daily" };
}

export function getShiftLabel() {
  return "Daily Checkoff";
}
