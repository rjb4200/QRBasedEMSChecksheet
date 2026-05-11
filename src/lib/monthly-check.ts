const TIMEZONE = process.env.TIMEZONE || "America/New_York";

export function shouldShowMonthlyCheckReminder(monthlyCheckDay: number | null, now: Date = new Date()): boolean {
  if (!monthlyCheckDay) return false;

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);

  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const effectiveDueDay = Math.min(monthlyCheckDay, lastDayOfMonth);

  return day === effectiveDueDay;
}
