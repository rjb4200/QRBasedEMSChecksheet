import { AutoRefresh } from "@/components/auto-refresh";
import { FleetMatrix } from "@/components/fleet-matrix";
import { getCheckoffDiscrepanciesForRange, getDefaultDiscrepancyRange, groupDiscrepanciesByDate } from "@/lib/discrepancies";
import { getFleetStatus } from "@/lib/fleet";
import { createAdminClient } from "@/lib/supabase/server-admin";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();
  const discrepancyRange = getDefaultDiscrepancyRange();
  const [units, discrepancies] = await Promise.all([getFleetStatus(supabase), getCheckoffDiscrepanciesForRange(discrepancyRange.from, discrepancyRange.to)]);
  const discrepancyGroups = groupDiscrepanciesByDate(discrepancies);
  const expandedDates = new Set(discrepancyGroups.slice(0, 3).map((group) => group.date));

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <AutoRefresh />
      <section className="mx-auto max-w-7xl space-y-6">
        <div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Admin Dashboard</p>
            <h1 className="mt-2 text-4xl font-black">Fleet Matrix</h1>
            <p className="mt-2 text-slate-600">Shows all units for the current checkoff day. Auto-refreshes every 30 seconds.</p>
          </div>
        </div>

        <FleetMatrix admin units={units} />

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Exceptions</p>
              <h2 className="mt-2 text-3xl font-black">Missing or Below-Par Items</h2>
              <p className="mt-2 text-slate-600">Items submitted missing or below par from {discrepancyRange.from} to {discrepancyRange.to}. The most recent 3 days are expanded.</p>
            </div>
            <p className="text-3xl font-black text-slate-950">{discrepancies.length}</p>
          </div>
          {discrepancies.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-green-50 px-4 py-3 font-bold text-green-800">No submitted exceptions found.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {discrepancyGroups.map((group) => (
                <details key={group.date} className="overflow-hidden rounded-2xl border border-slate-200" open={expandedDates.has(group.date)}>
                  <summary className="flex cursor-pointer items-center justify-between gap-4 bg-slate-50 px-4 py-3 font-black marker:text-red-700">
                    <span>{group.date}</span>
                    <span className="rounded-full bg-red-700 px-3 py-1 text-sm text-white">{group.items.length}</span>
                  </summary>
                  <div className="overflow-x-auto">
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
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
