import Link from "next/link";
import { formatDuration, getDailyUnitRecords } from "@/lib/archive-records";

function formatTimestamp(value: string | null) {
  return value ? new Date(value).toLocaleString("en-US", { timeZone: "America/New_York" }) : "Not recorded";
}

export default async function ArchivesPage({ searchParams }: { searchParams: Promise<{ unitId?: string; from?: string; to?: string }> }) {
  const params = await searchParams;
  const { groups, range, records, units } = await getDailyUnitRecords(params);
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
          <p className="mt-2 max-w-3xl text-slate-600">Review each day as a fleet summary. Expand a day to see unit status, compartment counts, and completion percentages.</p>
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
          <p className="font-semibold text-slate-700">Showing {groups.length} days and {records.length} unit-day records from {range.from} to {range.to}</p>
          <div className="flex flex-wrap gap-2">
            <Link className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" href={`/admin/archives/export?${csvParams.toString()}&mode=simple`}>Simple CSV</Link>
            <Link className="rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-950" href={`/admin/archives/export?${csvParams.toString()}&mode=detailed`}>Detailed CSV</Link>
          </div>
        </div>
        <div className="space-y-3">
          {groups.map((group) => (
            <details key={group.date} className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <summary className="grid cursor-pointer gap-4 p-5 marker:text-red-700 md:grid-cols-[12rem_8rem_1fr_auto] md:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Daily Record</p>
                  <h2 className="mt-1 text-2xl font-black">{group.date}</h2>
                  <p className="mt-1 text-xs font-bold uppercase text-slate-500">{group.records[0]?.shiftName ?? ""}</p>
                </div>
                <div className="text-3xl font-black text-slate-950">{group.completedInServiceUnits}/{group.totalInServiceUnits}</div>
                  <div className="flex flex-wrap gap-2" aria-label={`Unit statuses for ${group.date}`}>
                  {group.records.length === 0 ? <span className="rounded-full bg-slate-200 px-3 py-2 text-xs font-black text-slate-600">No units saved</span> : null}
                  {group.records.map((record) => {
                    const bubbleColor = record.unitStatus !== "in_service"
                      ? "bg-slate-300 text-slate-700"
                      : record.completionPercentage > 95
                        ? "bg-green-600 text-white"
                        : record.hasArchive
                          ? "bg-yellow-400 text-slate-950"
                          : "bg-red-700 text-white";

                    return <span key={record.unitId} className={`rounded-full px-3 py-2 text-xs font-black ${bubbleColor}`} title={`${record.unitName}: ${record.archiveStatus.replace("_", " ")} ${record.completionPercentage}%`}>{record.unitName}</span>;
                  })}
                </div>
                <Link className="rounded-2xl border border-slate-300 px-4 py-2 text-center text-sm font-bold" href={`/admin/checksheets/print?date=${group.date}`}>Print Check Sheets</Link>
              </summary>
              <div className="overflow-x-auto border-t border-slate-200">
                <table className="w-full min-w-[1350px] text-left text-sm">
                  <thead className="bg-slate-950 text-white">
                    <tr>
                      <th className="p-4">Unit</th>
                      <th className="p-4">Unit Status</th>
                      <th className="p-4">Snapshot</th>
                      <th className="p-4">Record Status</th>
                        <th className="p-4">Checks</th>
                        <th className="p-4">Completed</th>
                        <th className="p-4">Completion</th>
                        <th className="p-4">Crew</th>
                        <th className="p-4">Comments</th>
                        <th className="p-4">Shift</th>
                        <th className="p-4">Started</th>
                        <th className="p-4">Submitted</th>
                        <th className="p-4">Duration</th>
                        <th className="p-4">Checked By</th>
                        <th className="p-4">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.records.length === 0 ? (
                      <tr className="border-t border-slate-200">
                        <td className="p-4 text-slate-500" colSpan={15}>No unit ledger was saved for this day.</td>
                      </tr>
                    ) : null}
                    {group.records.map((record) => (
                      <tr key={`${record.date}-${record.unitId}`} className="border-t border-slate-200">
                        <td className="p-4 font-black">{record.unitName}</td>
                        <td className="p-4 capitalize text-slate-600">{record.unitStatus.replace("_", " ")}</td>
                        <td className="p-4 text-slate-600">{[record.archived ? "Archived" : "", record.statusNote].filter(Boolean).join(" | ") || "-"}</td>
                        <td className="p-4 capitalize text-slate-600">{record.archiveStatus.replace("_", " ")}</td>
                        <td className="p-4 font-semibold">{record.totalCompartments}</td>
                        <td className="p-4 font-semibold">{record.completedCompartments}/{record.totalCompartments}</td>
                        <td className="p-4 font-semibold">{record.completionPercentage}%</td>
                        <td className="p-4 font-semibold">{record.crewLocked ? record.providerNames || "Locked" : "Not locked"}</td>
                        <td className="max-w-xs whitespace-pre-wrap p-4 text-slate-600">{record.comments || "-"}</td>
                        <td className="p-4 font-semibold">{record.shiftName}</td>
                        <td className="p-4 text-slate-600">{formatTimestamp(record.startedAt)}</td>
                        <td className="p-4 text-slate-600">{formatTimestamp(record.submittedAt)}</td>
                        <td className="p-4 font-semibold">{formatDuration(record.timeToCompleteSeconds) || "Not recorded"}</td>
                        <td className="p-4 text-slate-600">{record.checkedByName || "Not recorded"}</td>
                        <td className="p-4">
                          {record.archiveId ? (
                            <Link className="rounded-2xl border border-slate-300 px-4 py-2 font-bold !text-pink-600 visited:!text-pink-600" href={`/admin/archives/${record.archiveId}`}>View</Link>
                          ) : (
                            <span className="text-slate-400">No archive</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
