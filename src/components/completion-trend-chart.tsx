import type { DailyRecordGroup } from "@/lib/archive-records";

function barColor(pct: number) {
  if (pct <= 0) return "bg-slate-200";
  if (pct > 85) return "bg-green-500";
  if (pct >= 70) return "bg-amber-500";
  return "bg-red-500";
}

function formatDate(dateStr: string) {
  const d = new Date(`${dateStr}T12:00:00`);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function CompletionTrendChart({ groups }: { groups: DailyRecordGroup[] }) {
  const maxHeight = 128;
  const ordered = [...groups].reverse();

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Last 14 Days Check Completion</p>
      <div className="mt-3 flex items-end gap-1" style={{ height: maxHeight }}>
        {ordered.map((group) => {
          const pct = group.totalInServiceUnits > 0
            ? Math.round((group.completedInServiceUnits / group.totalInServiceUnits) * 100)
            : 0;
          const barHeight = group.totalInServiceUnits > 0 ? Math.max(2, (pct / 100) * maxHeight) : 2;

          return (
            <div key={group.date} className="flex flex-1 flex-col items-center justify-end gap-1" style={{ height: maxHeight }}>
              <div
                className={`w-full min-w-[18px] rounded-t ${barColor(pct)}`}
                style={{ height: barHeight }}
              />
              <span className="text-[10px] font-bold text-slate-600 leading-tight">{formatDate(group.date)}</span>
              <span className="text-[10px] font-semibold text-slate-500 leading-tight">{group.completedInServiceUnits}/{group.totalInServiceUnits}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
