import Link from "next/link";
import { PrintButton } from "../../checksheets/print/print-button";
import { getDailyUnitRecords, type DailyUnitCheckStatus } from "@/lib/archive-records";
import { getCurrentShift } from "@/lib/shifts";

const WFD_LOGO_SRC = "/images/WFD_Logo_1848.jpg";
const CITY_SEAL_SRC = "/images/City of winchester Seal.png";

const statusLabels: Record<DailyUnitCheckStatus, string> = {
  checked: "Checked",
  incomplete: "Incomplete",
  not_started: "Not started",
  not_required: "Not required",
};

function formatTimestamp(value: string | null) {
  return value ? new Date(value).toLocaleString("en-US", { timeZone: "America/New_York" }) : "Not recorded";
}

export default async function PrintDailyRecordPage({ searchParams }: { searchParams: Promise<{ date?: string; unitId?: string }> }) {
  const params = await searchParams;
  const date = params.date ?? getCurrentShift().shiftDate;
  const { records } = await getDailyUnitRecords({ unitId: params.unitId, from: date, to: date });
  const summary = records.reduce((counts, record) => {
    counts[record.checkStatus] += 1;
    return counts;
  }, { checked: 0, incomplete: 0, not_started: 0, not_required: 0 });
  const totalExceptions = records.reduce((count, record) => count + record.exceptions.length, 0);

  return (
    <main className="min-h-screen bg-slate-200 p-4 text-slate-950 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-6xl flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm print:hidden">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Daily Readiness Record</p>
          <h1 className="text-2xl font-black">{date}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="rounded-2xl border border-slate-300 px-5 py-3 font-bold" href={`/admin/archives?date=${date}`}>Back to Records</Link>
          <PrintButton />
        </div>
      </div>

      <section className="mx-auto max-w-6xl bg-white p-6 shadow-sm print:max-w-none print:p-0 print:shadow-none">
        <header className="border-b-2 border-slate-950 pb-3 print:pb-2">
          <div className="flex items-end justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <img alt="Winchester Fire Department logo" className="h-14 w-14 shrink-0 object-contain print:h-10 print:w-10" src={WFD_LOGO_SRC} />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700 print:text-[7pt]">Winchester Fire Department</p>
                <h1 className="text-3xl font-black print:text-[16pt]">Daily Unit Readiness Ledger</h1>
                <p className="text-sm font-bold text-slate-700 print:text-[9pt]">Operational Date: {date} | {records[0]?.shiftName ?? ""}</p>
              </div>
            </div>
            <div className="text-right">
              <img alt="City of Winchester seal" className="ml-auto mb-1 h-10 w-10 object-contain opacity-70 print:h-8 print:w-8" src={CITY_SEAL_SRC} />
              <p className="text-sm font-bold print:text-[7pt]">Generated {new Date().toLocaleString()}</p>
              <p className="text-xs font-bold print:text-[6pt]">{records.length} units | {totalExceptions} exceptions</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2 text-center text-sm font-black print:mt-2 print:text-[8pt]">
            <div className="border border-slate-300 p-2">Checked<br />{summary.checked}</div>
            <div className="border border-slate-300 p-2">Incomplete<br />{summary.incomplete}</div>
            <div className="border border-slate-300 p-2">Not Started<br />{summary.not_started}</div>
            <div className="border border-slate-300 p-2">Not Required<br />{summary.not_required}</div>
            <div className="border border-slate-300 p-2">Exceptions<br />{totalExceptions}</div>
          </div>
        </header>

        <table className="mt-6 w-full border-collapse text-left text-sm print:mt-3 print:text-[8pt]">
          <thead>
            <tr className="border-b-2 border-slate-950">
              <th className="p-2 align-bottom">Unit</th>
              <th className="p-2 align-bottom">Service</th>
              <th className="p-2 align-bottom">Check Status</th>
              <th className="p-2 align-bottom">Sections</th>
              <th className="p-2 align-bottom">Exceptions</th>
              <th className="p-2 align-bottom">Comments</th>
              <th className="p-2 align-bottom">Crew</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? <tr><td className="p-2 text-slate-500" colSpan={7}>No daily ledger records were found for this date.</td></tr> : null}
            {records.map((record) => (
              <tr key={`${record.date}-${record.unitId}`} className="break-inside-avoid border-b border-slate-300">
                <td className="p-2 align-top font-black">{record.unitName}</td>
                <td className="p-2 align-top capitalize">{record.unitStatus.replaceAll("_", " ")}{record.archived ? " / archived" : ""}</td>
                <td className="p-2 align-top font-bold">
                  {statusLabels[record.checkStatus]}
                  {record.checkStatus === "checked" ? <><br /><span className="font-normal">{formatTimestamp(record.submittedAt)}</span></> : null}
                </td>
                <td className="p-2 align-top font-bold">{record.completedCompartments}/{record.totalCompartments}<br />{record.completionPercentage}%</td>
                <td className="p-2 align-top">
                  {record.exceptions.length === 0 ? "None" : record.exceptions.map((exception) => `${exception.targetName}: ${exception.itemName} - ${exception.issue} (${exception.actual}/${exception.expected})`).join("; ")}
                </td>
                <td className="max-w-[22rem] whitespace-pre-wrap p-2 align-top">{record.comments || "-"}</td>
                <td className="p-2 align-top">{record.crewLocked ? record.providerNames || "Locked" : "Not locked"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <style>{`
        @page { size: letter landscape; margin: 0.25in; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          thead { display: table-header-group; }
          tr { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>
    </main>
  );
}
