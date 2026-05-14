"use client";

import { useState } from "react";
import type { RestockingGroup } from "@/lib/restocking-list";

function buildRestockingText(groups: RestockingGroup[]) {
  return groups
    .map((group) => {
      const entries = group.entries.map((entry) => `  - ${entry.itemName} — ${entry.detail}`).join("\n");
      return `${group.sourceName}\n${entries}`;
    })
    .join("\n\n");
}

function buildPrintHtml(groups: RestockingGroup[], unitName?: string) {
  const title = unitName ? `Restocking List — ${unitName}` : "Restocking List";
  const date = new Date().toLocaleDateString();
  const rows = groups
    .flatMap((group) =>
      group.entries.map((entry) => `<tr><td class="source">${group.sourceName}</td><td>${entry.itemName}</td><td>${entry.detail}</td></tr>`),
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><title>${title}</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; margin: 0.5in; color: #1e293b; }
  h1 { font-size: 16pt; margin-bottom: 0; }
  .date { font-size: 9pt; color: #64748b; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th, td { padding: 6px 8px; text-align: left; font-size: 10pt; border-bottom: 1px solid #e2e8f0; }
  th { font-weight: 800; text-transform: uppercase; font-size: 8pt; color: #475569; border-bottom: 2px solid #1e293b; }
  .source { font-weight: 700; }
  @media print { body { margin: 0.25in; } }
</style></head>
<body>
  <h1>${title}</h1>
  <p class="date">${date}</p>
  <table>
    <thead><tr><th>Section</th><th>Item</th><th>Deficiency</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
}

function handlePrint(groups: RestockingGroup[], unitName?: string) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(buildPrintHtml(groups, unitName));
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };
}

export function RestockingListSection({ restockingList, unitName }: { restockingList: RestockingGroup[]; unitName?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildRestockingText(restockingList));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — button remains visible but does nothing.
    }
  }

  return (
    <section className="rounded-3xl border border-red-200 bg-white shadow-sm">
      <button
        className="flex w-full items-center justify-between rounded-3xl p-5 text-left"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-700">Restocking List</p>
        <span className="text-sm font-black text-red-700">{expanded ? "\u25B2" : "\u25BC"}</span>
      </button>

      {expanded ? (
        <div className="px-5 pb-5">
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              className="rounded-2xl bg-red-700 px-4 py-2 text-sm font-bold text-white"
              onClick={(event) => { event.stopPropagation(); handlePrint(restockingList, unitName); }}
              type="button"
            >
              Print
            </button>
            <button
              className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700"
              onClick={(event) => { event.stopPropagation(); void handleCopy(); }}
              type="button"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="space-y-3">
            {restockingList.map((group) => (
              <div key={group.sourceId} className="rounded-2xl bg-red-50 px-4 py-3 text-red-950">
                <p className="font-black">{group.sourceName}</p>
                <ul className="mt-2 space-y-1 text-sm font-semibold">
                  {group.entries.map((entry) => (
                    <li key={`${group.sourceId}-${entry.itemId}`}>{entry.itemName} - {entry.detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
