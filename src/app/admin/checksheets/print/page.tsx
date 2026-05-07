import Link from "next/link";
import { PrintButton } from "./print-button";
import { formatChecksheetTimestamp, formatChecksheetValue, getDailyChecksheetDocument } from "@/lib/checksheet-documents";
import { formatDuration } from "@/lib/archive-records";
import { getCurrentShift } from "@/lib/shifts";

const WFD_LOGO_SRC = "/images/WFD_Logo_1848.jpg";
const CITY_SEAL_SRC = "/images/City of winchester Seal.png";

export default async function PrintChecksheetsPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const params = await searchParams;
  const date = params.date ?? getCurrentShift().shiftDate;
  const document = await getDailyChecksheetDocument(date);

  return (
    <main className="min-h-screen bg-slate-200 p-4 text-slate-950 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-5xl flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm print:hidden">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Daily Check Sheets</p>
          <h1 className="text-2xl font-black">{document.date}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="rounded-2xl border border-slate-300 px-5 py-3 font-bold" href="/admin">Back to Fleet</Link>
          <PrintButton />
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-4 print:max-w-none print:space-y-0">
        {document.units.map((unit) => (
          <table key={unit.id} className="unit-print-page block w-full border-collapse bg-white p-6 shadow-sm print:table print:p-0 print:shadow-none">
            <thead className="block print:table-header-group">
              <tr className="block print:table-row">
                <td className="block p-0 print:table-cell">
                  <header className="mb-3 border-b-2 border-slate-950 pb-2 print:mb-1 print:pb-1">
                    <div className="flex items-end justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <img alt="Winchester Fire Department logo" className="h-14 w-14 shrink-0 object-contain print:h-10 print:w-10" src={WFD_LOGO_SRC} />
                        <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700 print:text-[7pt]">Winchester Fire Department</p>
                        <h1 className="text-3xl font-black print:text-[15pt]">EMS Equipment Check Sheet</h1>
                        <p className="text-lg font-black print:text-[9pt]">{unit.name} | {document.date} | {unit.shiftName}</p>
                        <p className="text-xs font-bold uppercase text-slate-600 print:text-[6pt]">{unit.status.replace("_", " ")} | {unit.archiveStatus.replace("_", " ")}</p>
                        {unit.providerNames ? <p className="mt-0.5 text-xs font-bold print:text-[6pt]">Crew: {unit.providerNames}</p> : null}
                        <p className="mt-0.5 text-xs font-bold print:text-[6pt]">Checked By: {unit.checkedByName || "Not recorded"}</p>
                        <p className="mt-0.5 text-xs font-bold print:text-[6pt]">Started: {formatChecksheetTimestamp(unit.startedAt)} | Submitted: {formatChecksheetTimestamp(unit.submittedAt)} | Duration: {formatDuration(unit.timeToCompleteSeconds) || "Not recorded"}</p>
                        {unit.comments ? <p className="mt-0.5 text-xs font-bold print:text-[6pt]">Comments: {unit.comments}</p> : null}
                        </div>
                      </div>
                      <div className="text-right">
                        <img alt="City of Winchester seal" className="ml-auto mb-1 h-10 w-10 object-contain opacity-70 print:h-8 print:w-8" src={CITY_SEAL_SRC} />
                        <p className="text-sm font-bold print:text-[7pt]">Generated {new Date(document.generatedAt).toLocaleString()}</p>
                        <p className="text-lg font-black print:text-[9pt]">{unit.completedCompartments}/{unit.totalCompartments}</p>
                      </div>
                    </div>
                  </header>
                </td>
              </tr>
            </thead>
            <tbody className="block print:table-row-group">
              <tr className="block print:table-row">
                <td className="block p-0 print:table-cell">
                  <section className="rounded-2xl border border-slate-950 p-2 print:rounded-md print:border-slate-700 print:p-1.5">
                    <div className="columns-1 gap-4 md:columns-2 print:columns-3 print:gap-3">
                      {unit.compartments.map((compartment) => (
                        <div key={compartment.id} className="break-inside-avoid border-b border-slate-200 pb-1 last:border-b-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-sm font-black print:text-[7pt]">{compartment.name}</h3>
                            <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-black uppercase print:text-[5.5pt]">{compartment.checkStatus.replace("_", " ")}</span>
                          </div>
                          {compartment.items.length === 0 ? <p className="text-xs text-slate-500 print:text-[5.5pt]">No configured items.</p> : null}
                          <table className="w-full text-left text-xs leading-tight print:text-[5.8pt]">
                            <tbody>
                              {compartment.items.map((item) => (
                                <tr key={`${compartment.id}-${item.name}`} className={item.status === "ok" ? "" : "exception-row font-bold text-red-700"}>
                                  <td className="w-[58%] pr-1 align-top">{item.name}</td>
                                  <td className="w-[18%] pr-1 align-top">{formatChecksheetValue(item.actual)}</td>
                                  <td className="w-[24%] align-top">{item.expected === null ? "" : `Par ${formatChecksheetValue(item.expected)}`}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  </section>
                </td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
      <style>{`
        @page { size: letter; margin: 0.25in; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }

          section {
            box-decoration-break: clone;
            -webkit-box-decoration-break: clone;
            break-inside: auto;
            border-radius: 0.35rem;
          }

          .unit-print-page {
            break-after: page;
            page-break-after: always;
          }

          .unit-print-page:last-child {
            break-after: auto;
            page-break-after: auto;
          }

          .exception-row td {
            color: #b91c1c !important;
            border-bottom: 1px solid #b91c1c;
            border-top: 1px solid #b91c1c;
          }

          .exception-row td:first-child {
            border-left: 1px solid #b91c1c;
            border-radius: 0.2rem 0 0 0.2rem;
            padding-left: 0.1rem;
          }

          .exception-row td:last-child {
            border-right: 1px solid #b91c1c;
            border-radius: 0 0.2rem 0.2rem 0;
          }
        }
      `}</style>
    </main>
  );
}
