import type { ShiftCompletionAverage } from "@/lib/records/daily-checkoff-summary";

export function getShiftAverageLabel(average: ShiftCompletionAverage) {
  return average.percentage === null ? `${average.shiftName} unavailable` : `${average.shiftName} ${average.percentage}% complete`;
}

export function getLeadingShiftNames(averages: ShiftCompletionAverage[]) {
  const percentages = averages.flatMap((average) => average.percentage === null ? [] : [average.percentage]);
  const highestPercentage = Math.max(...percentages);
  return percentages.length === 0 ? [] : averages.filter((average) => average.percentage === highestPercentage).map((average) => average.shiftName);
}

function Crown() {
  return (
    <svg aria-label="Highest completion" className="h-4 w-4 text-amber-500" fill="currentColor" role="img" viewBox="0 0 24 24">
      <path d="M3 6l4.5 4L12 4l4.5 6L21 6l-2 12H5L3 6zm3.7 14h10.6v2H6.7v-2z" />
    </svg>
  );
}

export default function ShiftCompletionAverageChart({ averages }: { averages: ShiftCompletionAverage[] }) {
  const leadingShifts = new Set(getLeadingShiftNames(averages));

  return (
    <section className="rounded-3xl bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">30 Day Average</p>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {averages.map((average) => {
          const unavailable = average.percentage === null;
          return (
            <div key={average.shiftName} className="text-center">
              <p className="flex items-center justify-center gap-1 text-xs font-bold text-slate-600">
                {average.shiftName.replace(" Shift", "")}
                {leadingShifts.has(average.shiftName) ? <Crown /> : null}
              </p>
              <div aria-label={getShiftAverageLabel(average)} className="relative mt-2 flex h-48 items-end overflow-hidden rounded-2xl bg-slate-300" role="img">
                {!unavailable ? <div className="w-full rounded-t-2xl bg-emerald-500" style={{ height: `${average.percentage}%`, minHeight: average.percentage !== null && average.percentage > 0 ? "0.25rem" : undefined }} /> : null}
                {!unavailable ? <span className="pointer-events-none absolute inset-x-0 z-10 flex justify-center" style={{ bottom: `clamp(8%, ${average.percentage}%, 92%)`, transform: "translateY(-50%)" }}><span className="rounded-full bg-white/90 px-2 py-1 text-sm font-black text-slate-950 shadow-sm">{average.percentage}%</span></span> : null}
              </div>
              {unavailable ? <p className="mt-2 text-xl font-black text-slate-950">-</p> : null}
              {unavailable ? <p className="mt-1 text-[10px] font-semibold text-slate-600">Unavailable</p> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
