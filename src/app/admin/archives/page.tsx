import Link from "next/link";
import { formatDuration, getDailyUnitRecords } from "@/lib/archive-records";
import { getDefaultRotationRange, getRotationDateAvailability } from "@/lib/data-rotation";
import { getCurrentShift } from "@/lib/shifts";
import ClearRecordsSection from "./clear-records-section";
import CompletionTrendChart from "@/components/completion-trend-chart";

function formatTimestamp(value: string | null) {
  return value ? new Date(value).toLocaleString("en-US", { timeZone: "America/New_York" }) : "Unavailable";
}

function MetadataField({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-black uppercase text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-700">{value}</p></div>;
}

const checkStatusLabels = {
  checked: "Checked",
  incomplete: "Incomplete",
  not_started: "Not started",
  not_required: "Not required",
};

const checkStatusClasses = {
  checked: "bg-green-100 text-green-800 border-green-200",
  incomplete: "bg-amber-100 text-amber-800 border-amber-200",
  not_started: "bg-red-100 text-red-800 border-red-200",
  not_required: "bg-slate-100 text-slate-700 border-slate-300",
};

export default async function ArchivesPage({ searchParams }: { searchParams: Promise<{ unitId?: string; date?: string; from?: string; to?: string }> }) {
  const params = await searchParams;
  const selectedDate = params.date ?? params.from ?? getCurrentShift().shiftDate;
  const [{ range, records, units }, { groups: trendGroups }, deleteAvailability] = await Promise.all([
    getDailyUnitRecords({ unitId: params.unitId, from: selectedDate, to: selectedDate }),
    getDailyUnitRecords({}),
    getRotationDateAvailability(params.unitId),
  ]);
  const deleteRange = getDefaultRotationRange(deleteAvailability, selectedDate);
  const summary = records.reduce((counts, record) => {
    counts[record.checkStatus] += 1;
    return counts;
  }, { checked: 0, incomplete: 0, not_started: 0, not_required: 0 });
  const totalExceptions = records.reduce((count, record) => count + record.exceptions.length, 0);

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-4xl font-black">Daily Readiness Records</h1>
          <p className="mt-2 max-w-3xl text-slate-600">Review the selected operational date as the historical ledger for unit readiness.</p>
        </div>
        <CompletionTrendChart groups={trendGroups} />
        <form action="/admin/archives" className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm md:grid-cols-4" method="get">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700 md:col-span-4">Filter</p>
          <select className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={params.unitId ?? ""} name="unitId">
            <option value="">All units</option>
            {units.map((unit) => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
          </select>
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={selectedDate} name="date" type="date" />
          <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Filter</button>
          <button className="rounded-2xl border border-slate-300 px-5 py-3 text-center font-bold text-slate-950" formAction="/admin/archives/print" formMethod="get" type="submit">Print Daily Record</button>
        </form>
        <section className="grid gap-3 md:grid-cols-5">
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Checked</p>
            <p className="mt-2 text-3xl font-black text-green-700">{summary.checked}</p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Incomplete</p>
            <p className="mt-2 text-3xl font-black text-amber-700">{summary.incomplete}</p>
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
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-red-700">{selectedDate}</p>
          <div className="grid gap-4 lg:grid-cols-2">
          {records.length === 0 ? <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">No daily ledger records were found for this date.</div> : null}
          {records.map((record) => (
            <article key={`${record.date}-${record.unitId}`} className="rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">{record.shiftName}</p>
                  <h2 className="mt-1 text-2xl font-black">{record.unitName}</h2>
                  <p className="mt-1 text-sm font-semibold capitalize text-slate-600">{record.unitStatus.replaceAll("_", " ")}{record.archived ? " | Archived" : ""}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${checkStatusClasses[record.checkStatus]}`}>{checkStatusLabels[record.checkStatus]}</span>
              </div>
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                <div className="rounded-2xl bg-slate-100 p-3"><p className="text-xs font-black uppercase text-slate-500">Sections</p><p className="mt-1 font-black">{record.completedCompartments}/{record.totalCompartments}</p></div>
                <div className="rounded-2xl bg-slate-100 p-3"><p className="text-xs font-black uppercase text-slate-500">Completion</p><p className="mt-1 font-black">{record.completionPercentage}%</p></div>
                <div className="rounded-2xl bg-slate-100 p-3"><p className="text-xs font-black uppercase text-slate-500">Exceptions</p><p className="mt-1 font-black">{record.exceptions.length}</p></div>
              </div>
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div><p className="text-xs font-black uppercase text-slate-500">Crew</p><p className="mt-1 font-semibold text-slate-700">{record.crewLocked ? record.providerNames || "Locked" : "Not locked"}</p></div>
                {record.checkedByName ? <MetadataField label="Checked By" value={record.checkedByName} /> : null}
                {record.startedAt ? <MetadataField label="Started" value={formatTimestamp(record.startedAt)} /> : null}
                {record.submittedAt ? <MetadataField label={record.hasArchive ? "Archived At" : "Submitted"} value={formatTimestamp(record.submittedAt)} /> : null}
                {formatDuration(record.timeToCompleteSeconds) ? <MetadataField label="Duration" value={formatDuration(record.timeToCompleteSeconds)} /> : null}
                {record.statusNote.trim() ? <MetadataField label="Snapshot" value={record.statusNote.trim()} /> : null}
              </div>
              {record.restockingList.length > 0 ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-950"><p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Restocking List</p>{record.restockingList.map((group) => <div key={group.sourceId} className="mt-2"><p className="font-bold">{group.sourceName}</p>{group.entries.map((entry) => <p key={`${group.sourceId}-${entry.itemId}`} className="ml-3">{entry.itemName} - {entry.detail}</p>)}</div>)}</div> : null}
              {record.comments ? <div className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-100 p-3 text-sm text-slate-700"><p className="mb-1 font-black text-slate-950">Comments</p>{record.comments}</div> : null}
              {record.sectionComments.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="mb-1 font-black text-slate-950">Section Comments</p>
                  {record.sectionComments.map((sc, i) => (
                    <p key={i} className="mt-1"><span className="font-bold">{sc.sourceName}:</span> {sc.comment}</p>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
        </div>
        <form action="/admin/archives/export-package" className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm" method="get">
          <input type="hidden" name="unitId" value={params.unitId ?? ""} />
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Export</p>
          <div className="flex flex-wrap items-center gap-3">
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={selectedDate} name="from" type="date" />
          <span className="text-slate-400">to</span>
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={selectedDate} name="to" type="date" />
          <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" formAction="/admin/archives/export?mode=simple" formMethod="get" type="submit">Simple CSV</button>
          <button className="rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-950" formAction="/admin/archives/export?mode=detailed" formMethod="get" type="submit">Detailed CSV</button>
          <button className="rounded-2xl bg-slate-800 px-5 py-3 font-bold text-white" type="submit">Full Package</button>
          </div>
        </form>
        <ClearRecordsSection availability={deleteAvailability} defaultFrom={deleteRange.from} defaultTo={deleteRange.to} unitId={params.unitId ?? ""} />
      </section>
    </main>
  );
}
