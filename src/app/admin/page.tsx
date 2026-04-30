import { AutoRefresh } from "@/components/auto-refresh";
import { FleetMatrix } from "@/components/fleet-matrix";
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
        <div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Admin Dashboard</p>
            <h1 className="mt-2 text-4xl font-black">Fleet Matrix</h1>
          </div>
        </div>

        <FleetMatrix admin units={units} />

        <section className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm">
          <p className="font-bold text-slate-700">Daily check sheets for {currentShift.shiftDate}</p>
          <a className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" href={`/admin/checksheets/print?date=${currentShift.shiftDate}`}>Print Today's Check Sheets</a>
        </section>

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
                {group.items.length === 0 ? <p className="border-t border-slate-200 p-4 text-sm font-semibold text-slate-500">No missing or below-par items submitted this day.</p> : null}
                {group.items.length > 0 ? <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-slate-950 text-white">
                      <tr>
                        <th className="p-3">Unit</th>
                        <th className="p-3">Compartment</th>
                        <th className="p-3">Item</th>
                        <th className="p-3">Issue</th>
                        <th className="p-3">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((item) => (
                        <tr key={`${item.shiftDate}-${item.compartmentId}-${item.itemId}`} className="border-t border-slate-200">
                          <td className="p-3 font-black">{item.unitName}</td>
                          <td className="p-3 font-semibold">{item.compartmentName}</td>
                          <td className="p-3">{item.itemName}</td>
                          <td className="p-3 capitalize text-red-700">{item.inputType === "checkbox" ? "Missing" : "Below par"}</td>
                          <td className="p-3 font-semibold">{item.actual} / {item.expected}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> : null}
              </details>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
