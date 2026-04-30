import Link from "next/link";
import { getDailyUnitRecords } from "@/lib/archive-records";

export default async function ArchivesPage({ searchParams }: { searchParams: Promise<{ unitId?: string; from?: string; to?: string }> }) {
  const params = await searchParams;
  const { range, records, units } = await getDailyUnitRecords(params);
  const csvParams = new URLSearchParams();
  if (params.unitId) csvParams.set("unitId", params.unitId);
  csvParams.set("from", range.from);
  csvParams.set("to", range.to);

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Admin</p>
          <h1 className="mt-2 text-4xl font-black">Past Checkoff Records</h1>
          <p className="mt-2 max-w-3xl text-slate-600">Review one daily record for every unit across the selected date range. Missing archive rows are shown as No record so gaps are visible.</p>
        </div>
        <form className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm md:grid-cols-4">
          <select className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={params.unitId ?? ""} name="unitId">
            <option value="">All units</option>
            {units.map((unit) => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
          </select>
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={range.from} name="from" type="date" />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={range.to} name="to" type="date" />
          <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Filter</button>
        </form>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm">
          <p className="font-semibold text-slate-700">Showing {records.length} unit-day records from {range.from} to {range.to}</p>
          <Link className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" href={`/admin/archives/export?${csvParams.toString()}`}>Export CSV</Link>
        </div>
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-950 text-white">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Unit</th>
                  <th className="p-4">Unit Status</th>
                  <th className="p-4">Record Status</th>
                  <th className="p-4">Compartments</th>
                  <th className="p-4">Completion</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={`${record.date}-${record.unitId}`} className="border-t border-slate-200">
                    <td className="p-4 font-semibold">{record.date}</td>
                    <td className="p-4 font-black">{record.unitName}</td>
                    <td className="p-4 capitalize text-slate-600">{record.unitStatus.replace("_", " ")}</td>
                    <td className="p-4 capitalize text-slate-600">{record.archiveStatus.replace("_", " ")}</td>
                    <td className="p-4 font-semibold">{record.completedCompartments}/{record.totalCompartments}</td>
                    <td className="p-4 font-semibold">{record.completionPercentage}%</td>
                    <td className="p-4">
                      {record.archiveId ? (
                        <Link className="rounded-2xl border border-slate-300 px-4 py-2 font-bold" href={`/admin/archives/${record.archiveId}`}>View</Link>
                      ) : (
                        <span className="text-slate-400">No archive</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
