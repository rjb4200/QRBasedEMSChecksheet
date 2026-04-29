export type ShiftPeriod = "day" | "night";

function easternDate(date = new Date()) {
  return new Date(date.toLocaleString("en-US", { timeZone: "America/New_York" }));
}

export function getCurrentShift(date = new Date()): { shiftDate: string; shiftPeriod: ShiftPeriod } {
  const local = easternDate(date);
  const hour = local.getHours();
  const shiftPeriod: ShiftPeriod = hour >= 6 && hour < 18 ? "day" : "night";

  if (hour < 6) {
    local.setDate(local.getDate() - 1);
  }

  return {
    shiftDate: local.toISOString().slice(0, 10),
    shiftPeriod,
  };
}

export function getPreviousShift(date = new Date()): { shiftDate: string; shiftPeriod: ShiftPeriod } {
  const current = getCurrentShift(date);
  const shiftDate = new Date(`${current.shiftDate}T12:00:00`);

  if (current.shiftPeriod === "day") {
    return { shiftDate: current.shiftDate, shiftPeriod: "night" };
  }

  return { shiftDate: shiftDate.toISOString().slice(0, 10), shiftPeriod: "day" };
}

export function getShiftLabel(period: ShiftPeriod) {
  return period === "day" ? "Day Shift" : "Night Shift";
}
