import Link from "next/link";
import { formatDuration, getDailyUnitRecords } from "@/lib/archive-records";
import { getCurrentShift } from "@/lib/shifts";

function formatTimestamp(value: string | null) {
  return value ? new Date(value).toLocaleString("en-US", { timeZone: "America/New_York" }) : "Not recorded";
}

const checkStatusLabels = {
  checked: "Checked",
  incomplete: "Incomplete",
  not_started: "Not started",
  not_required: "Not required",
};

const checkStatusClasses = {
  checked: "bg-green-100 text-green-800 ring-green-200",
  incomplete: "bg-yellow-100 text-yellow-900 ring-yellow-200",
  not_started: "bg-red-100 text-red-800 ring-red-200",
  not_required: "bg-slate-200 text-slate-700 ring-slate-300",
};

export default async function ArchivesPage({ searchParams }: { searchParams: Promise<{ unitId?: string; date?: string; from?: string; to?: string }> }) {
  const params = await searchParams;
  const selectedDate = params.date ?? params.from ?? getCurrentShift().shiftDate;
  const { range, records, units } = await getDailyUnitRecords({ unitId: params.unitId, from: selectedDate, to: selectedDate });
  const summary = records.reduce((counts, record) => {
    counts[record.checkStatus] += 1;
    return counts;
  }, { checked: 0, incomplete: 0, not_started: 0, not_required: 0 });
  const totalExceptions = records.reduce((count, record) => count + record.exceptions.length, 0);
  const csvParams = new URLSearchParams();
  if (params.unitId) csvParams.set("unitId", params.unitId);
  csvParams.set("from", range.from);
  csvParams.set("to", range.to);
  csvParams.set("date", selectedDate);

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Admin</p>
          <h1 className="mt-2 text-4xl font-black">Daily Readiness Records</h1>
          <p className="mt-2 max-w-3xl text-slate-600">Review the selected operational date as the historical ledger for unit readiness.</p>
        </div>
        <form className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm md:grid-cols-4">
          <select className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={params.unitId ?? ""} name="unitId">
            <option value="">All units</option>
            {units.map((unit) => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
          </select>
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={selectedDate} name="date" type="date" />
          <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Filter</button>
          <Link className="rounded-2xl border border-slate-300 px-5 py-3 text-center font-bold text-slate-950" href={`/admin/archives/print?date=${selectedDate}`}>Print Daily Record</Link>
        </form>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm">
          <p className="font-semibold text-slate-700">Showing {records.length} unit records for {selectedDate}</p>
          <div className="flex flex-wrap gap-2">
            <Link className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" href={`/admin/archives/export?${csvParams.toString()}&mode=simple`}>Simple CSV</Link>
            <Link className="rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-950" href={`/admin/archives/export?${csvParams.toString()}&mode=detailed`}>Detailed CSV</Link>
          </div>
        </div>
        <section className="grid gap-3 md:grid-cols-5">
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Checked</p>
            <p className="mt-2 text-3xl font-black text-green-700">{summary.checked}</p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Incomplete</p>
            <p className="mt-2 text-3xl font-black text-yellow-700">{summary.incomplete}</p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Not Started</p>
            <p className="mt-2 text-3xl font-black text-red-700">{summary.not_started}</p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Not Required</p>
            <p className="mt-2 text-3xl font-black text-slate-700">{summary.not_required}</p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Exceptions</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{totalExceptions}</p>
          </div>
        </section>
        <div className="grid gap-4 lg:grid-cols-2">
          {records.length === 0 ? <div className="rounded-3xl bg-white p-6 text-slate-600 shadow-sm">No daily ledger records were found for this date.</div> : null}
          {records.map((record) => (
            <article key={`${record.date}-${record.unitId}`} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">{record.shiftName}</p>
                  <h2 className="mt-1 text-2xl font-black">{record.unitName}</h2>
                  <p className="mt-1 text-sm font-semibold capitalize text-slate-600">{record.unitStatus.replaceAll("_", " ")}{record.archived ? " | Archived" : ""}</p>
                </div>
                <span className={`rounded-full px-3 py-2 text-xs font-black ring-1 ${checkStatusClasses[record.checkStatus]}`}>{checkStatusLabels[record.checkStatus]}</span>
              </div>
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                <div className="rounded-2xl bg-slate-100 p-3"><p className="text-xs font-black uppercase text-slate-500">Sections</p><p className="mt-1 font-black">{record.completedCompartments}/{record.totalCompartments}</p></div>
                <div className="rounded-2xl bg-slate-100 p-3"><p className="text-xs font-black uppercase text-slate-500">Completion</p><p className="mt-1 font-black">{record.completionPercentage}%</p></div>
                <div className="rounded-2xl bg-slate-100 p-3"><p className="text-xs font-black uppercase text-slate-500">Exceptions</p><p className="mt-1 font-black">{record.exceptions.length}</p></div>
              </div>
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div><p className="text-xs font-black uppercase text-slate-500">Crew</p><p className="mt-1 font-semibold text-slate-700">{record.crewLocked ? record.providerNames || "Locked" : "Not locked"}</p></div>
                <div><p className="text-xs font-black uppercase text-slate-500">Checked By</p><p className="mt-1 font-semibold text-slate-700">{record.checkedByName || "Not recorded"}</p></div>
                <div><p className="text-xs font-black uppercase text-slate-500">Started</p><p className="mt-1 font-semibold text-slate-700">{formatTimestamp(record.startedAt)}</p></div>
                <div><p className="text-xs font-black uppercase text-slate-500">Submitted</p><p className="mt-1 font-semibold text-slate-700">{formatTimestamp(record.submittedAt)}</p></div>
                <div><p className="text-xs font-black uppercase text-slate-500">Duration</p><p className="mt-1 font-semibold text-slate-700">{formatDuration(record.timeToCompleteSeconds) || "Not recorded"}</p></div>
                <div><p className="text-xs font-black uppercase text-slate-500">Snapshot</p><p className="mt-1 font-semibold text-slate-700">{record.statusNote || "No status note"}</p></div>
              </div>
              {record.exceptions.length > 0 ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-950"><p className="font-black">Exceptions</p>{record.exceptions.slice(0, 4).map((exception) => <p key={`${exception.targetName}-${exception.itemName}-${exception.actual}`} className="mt-1">{exception.targetName}: {exception.itemName} - {exception.issue} ({exception.actual} / {exception.expected})</p>)}</div> : null}
              {record.comments ? <div className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-100 p-3 text-sm text-slate-700"><p className="mb-1 font-black text-slate-950">Comments</p>{record.comments}</div> : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {record.archiveId ? <Link className="rounded-2xl border border-slate-300 px-4 py-2 font-bold !text-pink-600 visited:!text-pink-600" href={`/admin/archives/${record.archiveId}`}>View</Link> : <span className="rounded-2xl border border-slate-200 px-4 py-2 font-bold text-slate-400">No archive</span>}
                <Link className="rounded-2xl bg-red-700 px-4 py-2 font-bold text-white" href={`/admin/archives/print?date=${record.date}`}>Print</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
