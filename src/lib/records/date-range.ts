import type { ArchiveSearchParams } from "@/lib/records/types";

export function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function parseDateInput(value: string | undefined, fallback: Date) {
  if (!value) {
    return fallback;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function eachDate(from: Date, to: Date) {
  const dates: string[] = [];
  for (let current = from; current <= to; current = addDays(current, 1)) {
    dates.push(toDateInputValue(current));
  }
  return dates;
}

export function getDefaultArchiveRange(params: ArchiveSearchParams) {
  const today = new Date();
  const defaultTo = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const defaultFrom = addDays(defaultTo, -13);
  let from = parseDateInput(params.from, defaultFrom);
  let to = parseDateInput(params.to, defaultTo);

  if (from > to) {
    [from, to] = [to, from];
  }

  return {
    from: toDateInputValue(from),
    to: toDateInputValue(to),
  };
}

export function formatDuration(seconds: number | null) {
  if (seconds === null) return "";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) return `${remainingSeconds}s`;
  if (remainingSeconds === 0) return `${minutes}m`;
  return `${minutes}m ${remainingSeconds}s`;
}
