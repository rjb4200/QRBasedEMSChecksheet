export type ShiftPeriod = "daily";

function easternDate(date = new Date()) {
  return new Date(date.toLocaleString("en-US", { timeZone: "America/New_York" }));
}

export function getCurrentShift(date = new Date()): { shiftDate: string; shiftPeriod: ShiftPeriod } {
  const local = easternDate(date);
  const hour = local.getHours();

  if (hour < 6) {
    local.setDate(local.getDate() - 1);
  }

  return {
    shiftDate: local.toISOString().slice(0, 10),
    shiftPeriod: "daily",
  };
}

export function getPreviousShift(date = new Date()): { shiftDate: string; shiftPeriod: ShiftPeriod } {
  const current = getCurrentShift(date);
  const shiftDate = new Date(`${current.shiftDate}T12:00:00`);
  shiftDate.setDate(shiftDate.getDate() - 1);

  return { shiftDate: shiftDate.toISOString().slice(0, 10), shiftPeriod: "daily" };
}

export function getShiftLabel() {
  return "Daily Checkoff";
}
