import type { DailyCheckoffSummary } from "@/lib/records/daily-checkoff-summary";

function formatDate(date: string) {
  const value = new Date(`${date}T12:00:00`);
  return `${value.getMonth() + 1}/${value.getDate()}`;
}

export function formatWorkCompletionLabel(day: DailyCheckoffSummary) {
  if (day.state === "unavailable") return "Unavailable";
  return `${day.completedActions}/${day.requiredActions} actions`;
}

export default function DailyWorkCompletionTrend({ days }: { days: DailyCheckoffSummary[] }) {
  const orderedDays = [...days].reverse();

  return (
    <section className="rounded-3xl bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Daily Check Work Completion</p>
      <div className="mt-3 overflow-x-auto">
        <div className="grid min-w-[700px] grid-cols-[repeat(14,minmax(0,1fr))] gap-2">
          {orderedDays.map((day) => (
            <div key={day.date} className="rounded-2xl bg-slate-100 p-2 text-center">
              <p className="text-xs font-bold text-slate-600">{formatDate(day.date)}</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{day.requiredActions === 0 ? "-" : `${Math.round((day.completedActions / day.requiredActions) * 100)}%`}</p>
              <p className="mt-1 text-[10px] font-semibold leading-tight text-slate-600">{formatWorkCompletionLabel(day)}</p>
              {day.state !== "unavailable" ? <p className="mt-1 text-[10px] text-slate-500">{day.completedUnits}/{day.requiredUnits} units {day.state}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
