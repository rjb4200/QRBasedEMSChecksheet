import { AutoRefresh } from "@/components/auto-refresh";
import { FleetMatrix } from "@/components/fleet-matrix";
import { RecentComments } from "@/components/recent-comments";
import { StorageWarningBanner } from "@/components/storage-warning-banner";
import { getCheckoffDiscrepanciesForRange, getDiscrepancyRange, groupDiscrepanciesByDate } from "@/lib/discrepancies";
import { getFleetStatus } from "@/lib/fleet";
import { getCurrentShift } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const params = await searchParams;
  const supabase = createAdminClient();
  const discrepancyRange = getDiscrepancyRange(params);
  const [units, discrepancies] = await Promise.all([getFleetStatus(supabase), getCheckoffDiscrepanciesForRange(discrepancyRange.from, discrepancyRange.to)]);
  const discrepancyGroups = groupDiscrepanciesByDate(discrepancies, discrepancyRange);
  const expandedDates = new Set(discrepancyGroups.slice(0, 3).map((group) => group.date));
  const csvParams = new URLSearchParams({ from: discrepancyRange.from, to: discrepancyRange.to });
  const currentShift = getCurrentShift();

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <AutoRefresh />
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Admin Dashboard</p>
              <h1 className="mt-2 text-4xl font-black">Fleet Matrix</h1>
            </div>
          </div>

          <FleetMatrix admin units={units} />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
            <p className="font-bold text-slate-700">Daily check sheets for {currentShift.shiftDate}</p>
            <div className="flex flex-wrap gap-2">
              <a className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" href={`/admin/checksheets/print?date=${currentShift.shiftDate}`}>Print Today's Check Sheets</a>
              <a className="rounded-2xl border border-slate-300 px-5 py-3 font-bold" href="/admin/docs">Admin Guide</a>
            </div>
          </div>
        </div>

        <StorageWarningBanner />

        <RecentComments />

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Exceptions</h2>
            </div>
            <p className="text-3xl font-black text-slate-950">{discrepancies.length}</p>
          </div>
          <form className="mt-4 grid gap-3 rounded-2xl bg-slate-100 p-3 sm:grid-cols-[1fr_1fr_auto_auto]">
            <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={discrepancyRange.from} name="from" type="date" />
            <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={discrepancyRange.to} name="to" type="date" />
            <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Filter</button>
            <a className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center font-bold text-slate-950" href={`/admin/exceptions/export?${csvParams.toString()}`}>Export CSV</a>
          </form>
          <div className="mt-4 space-y-3">
            {discrepancyGroups.map((group) => (
              <details key={group.date} className="overflow-hidden rounded-2xl border border-slate-200" open={expandedDates.has(group.date)}>
                <summary className="flex cursor-pointer items-center justify-between gap-4 bg-slate-50 px-4 py-3 font-black marker:text-red-700">
                  <span>{group.date}</span>
                  <span className="rounded-full bg-red-700 px-3 py-1 text-sm text-white">{group.items.length}</span>
                </summary>
                {group.items.length === 0 ? <p className="border-t border-slate-200 p-4 text-sm font-semibold text-slate-500">No missing or below-par items submitted this day.</p> : (
                  <div className="divide-y divide-slate-100">
                    {Array.from(
                      (() => {
                        const byUnit = new Map<string, typeof group.items>();
                        for (const item of group.items) {
                          const list = byUnit.get(item.unitName) ?? [];
                          list.push(item);
                          byUnit.set(item.unitName, list);
                        }
                        return byUnit;
                      })(),
                    ).map(([unitName, items]) => (
                      <details key={unitName} className="group">
                        <summary className="flex cursor-pointer items-center justify-between gap-4 px-4 py-2 marker:text-slate-400 hover:bg-slate-50">
                          <span className="text-sm font-black text-slate-700">{unitName}</span>
                          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-black text-slate-600">{items.length}</span>
                        </summary>
                        {items.map((item) => (
                          <div key={`${item.shiftDate}-${item.compartmentId}-${item.itemId}`} className="border-t border-slate-100 px-4 py-2">
                            <p className="text-sm">
                              <span className="font-semibold text-slate-800">{item.itemName}</span>
                              <span className="text-slate-400"> &middot; {item.compartmentName}</span>
                              <span className="ml-2 text-slate-500">—</span>
                              <span className={`ml-2 font-semibold ${item.inputType === "checkbox" ? "text-red-700" : item.inputType === "condition" ? "text-red-700" : "text-amber-700"}`}>
                                {item.inputType === "checkbox" ? "Missing" : item.inputType === "condition" ? "Condition issue" : `Below par (${item.actual}/${item.expected})`}
                              </span>
                            </p>
                          </div>
                        ))}
                      </details>
                    ))}
                  </div>
                )}
              </details>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
