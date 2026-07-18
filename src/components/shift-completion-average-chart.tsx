import type { ShiftCompletionAverage } from "@/lib/records/daily-checkoff-summary";

export function getShiftAverageLabel(average: ShiftCompletionAverage) {
  return average.percentage === null ? `${average.shiftName} unavailable` : `${average.shiftName} ${average.percentage}% complete`;
}

export default function ShiftCompletionAverageChart({ averages }: { averages: ShiftCompletionAverage[] }) {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Shift Average</p>
      <p className="mt-1 text-xs text-slate-500">Last 30 operational days</p>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {averages.map((average) => {
          const unavailable = average.percentage === null;
          return (
            <div key={average.shiftName} className="text-center">
              <p className="text-xs font-bold text-slate-600">{average.shiftName.replace(" Shift", "")}</p>
              <div aria-label={getShiftAverageLabel(average)} className="mt-2 flex h-28 items-end overflow-hidden rounded-lg bg-slate-300" role="img">
                {!unavailable ? <div className="w-full rounded-t-lg bg-emerald-500" style={{ height: `${average.percentage}%`, minHeight: average.percentage !== null && average.percentage > 0 ? "0.25rem" : undefined }} /> : null}
              </div>
              <p className="mt-2 text-xl font-black text-slate-950">{unavailable ? "-" : `${average.percentage}%`}</p>
              {unavailable ? <p className="mt-1 text-[10px] font-semibold text-slate-600">Unavailable</p> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
