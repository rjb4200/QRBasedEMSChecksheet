import Link from "next/link";
import { PrintButton } from "./print-button";
import { getDailyChecksheetDocument } from "@/lib/checksheet-documents";
import { getCurrentShift } from "@/lib/shifts";

function formatValue(value: unknown) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  if (value === undefined || value === null || value === "") return "-";
  return String(value);
}

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

      <article className="mx-auto max-w-5xl bg-white p-6 shadow-sm print:max-w-none print:p-0 print:shadow-none">
        <header className="mb-3 border-b-2 border-slate-950 pb-2 print:mb-1 print:pb-1">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700 print:text-[7pt]">EMS Daily Check Sheets</p>
              <h1 className="text-3xl font-black print:text-[15pt]">{document.date}</h1>
            </div>
            <p className="text-sm font-bold print:text-[7pt]">Generated {new Date(document.generatedAt).toLocaleString()}</p>
          </div>
        </header>

        <div className="columns-1 gap-4 md:columns-2 print:columns-3 print:gap-3">
          {document.units.map((unit) => (
            <section key={unit.id} className="mb-3 break-inside-avoid rounded-2xl border border-slate-950 p-2 print:mb-1 print:rounded-none print:p-1.5">
              <div className="mb-1 flex items-start justify-between gap-2 border-b border-slate-300 pb-1">
                <div>
                  <h2 className="text-xl font-black print:text-[10pt]">{unit.name}</h2>
                  <p className="text-xs font-bold uppercase text-slate-600 print:text-[6pt]">{unit.status.replace("_", " ")} | {unit.archiveStatus.replace("_", " ")}</p>
                  {unit.providerNames ? <p className="mt-0.5 text-xs font-bold print:text-[6pt]">Crew: {unit.providerNames}</p> : null}
                </div>
                <p className="text-lg font-black print:text-[9pt]">{unit.completedCompartments}/{unit.totalCompartments}</p>
              </div>
              <div className="space-y-1">
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
                          <tr key={`${compartment.id}-${item.name}`} className={item.status === "ok" ? "" : "font-bold text-red-700 print:text-black"}>
                            <td className="w-[58%] pr-1 align-top">{item.name}</td>
                            <td className="w-[18%] pr-1 align-top">{formatValue(item.actual)}</td>
                            <td className="w-[24%] align-top">{item.expected === null ? "" : `Par ${formatValue(item.expected)}`}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
      <style>{`
        @page { size: letter; margin: 0.25in; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </main>
  );
}
