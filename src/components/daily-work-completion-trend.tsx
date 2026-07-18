import type { DailyCheckoffSummary } from "@/lib/records/daily-checkoff-summary";

function formatDate(date: string) {
  const value = new Date(`${date}T12:00:00`);
  return `${value.getMonth() + 1}/${value.getDate()}`;
}

export function getCompletionPercentage(day: DailyCheckoffSummary) {
  if (day.state === "unavailable" || day.requiredActions === 0) return null;
  return Math.round((day.completedActions / day.requiredActions) * 100);
}

export default function DailyWorkCompletionTrend({ days }: { days: DailyCheckoffSummary[] }) {
  const orderedDays = [...days].reverse();

  return (
    <section className="rounded-3xl bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Daily Check Work Completion</p>
      <div className="mt-3 overflow-x-auto">
        <div className="grid min-w-[560px] grid-cols-[repeat(9,minmax(0,1fr))] gap-2">
          {orderedDays.map((day) => (
            <div key={day.date} className="rounded-2xl bg-slate-100 p-2 text-center">
              <p className="text-xs font-bold text-slate-600">{formatDate(day.date)}</p>
              {(() => {
                const percentage = getCompletionPercentage(day);
                const unavailable = percentage === null;
                return (
                  <>
                    <div
                      aria-label={unavailable ? `${formatDate(day.date)} unavailable` : `${formatDate(day.date)} ${percentage}% complete`}
                      className="mt-2 flex h-28 items-end overflow-hidden rounded-lg bg-slate-300"
                      role="img"
                    >
                      {!unavailable ? <div className="w-full rounded-t-lg bg-emerald-500" style={{ height: `${percentage}%`, minHeight: percentage > 0 ? "0.25rem" : undefined }} /> : null}
                    </div>
                    <p className="mt-2 text-2xl font-black text-slate-950">{unavailable ? "-" : `${percentage}%`}</p>
                    {unavailable ? <p className="mt-1 text-[10px] font-semibold text-slate-600">Unavailable</p> : null}
                  </>
                );
              })()}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
