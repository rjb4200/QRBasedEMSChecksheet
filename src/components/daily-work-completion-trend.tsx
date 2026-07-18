import type { DailyWorkCompletion } from "@/lib/records/daily-work-completion-trend";

function formatDate(date: string) {
  const value = new Date(`${date}T12:00:00`);
  return `${value.getMonth() + 1}/${value.getDate()}`;
}

export function formatWorkCompletionLabel(day: DailyWorkCompletion) {
  if (day.state === "unavailable") return "Unavailable";
  if (day.state === "not_applicable") return "N/A";
  return `${day.completedWork}/${day.requiredWork} actions`;
}

export default function DailyWorkCompletionTrend({ days }: { days: DailyWorkCompletion[] }) {
  const orderedDays = [...days].reverse();

  return (
    <section className="rounded-3xl bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Daily Check Work Completion</p>
      <div className="mt-3 overflow-x-auto">
        <div className="grid min-w-[700px] grid-cols-[repeat(14,minmax(0,1fr))] gap-2">
          {orderedDays.map((day) => (
            <div key={day.date} className="rounded-2xl bg-slate-100 p-2 text-center">
              <p className="text-xs font-bold text-slate-600">{formatDate(day.date)}</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{day.percentage === null ? "-" : `${day.percentage}%`}</p>
              <p className="mt-1 text-[10px] font-semibold leading-tight text-slate-600">{formatWorkCompletionLabel(day)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
