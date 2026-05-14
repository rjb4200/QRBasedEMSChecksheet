"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RestockingGroup } from "@/lib/restocking-list";
import { toggleRestockAddressed, getRestockAddressed } from "@/app/units/[id]/actions";

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

type Props = {
  restockingList: RestockingGroup[];
  unitName?: string;
  unitId?: string;
  shiftDate?: string;
  shiftPeriod?: string;
  addressedKeySet: Set<string>;
};

const POLL_INTERVAL_MS = 15000;

export function RestockingListSection({ restockingList, unitName, unitId, shiftDate, shiftPeriod, addressedKeySet: initialAddressed }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addressedKeySet, setAddressedKeySet] = useState(initialAddressed);
  const savingRef = useRef(false);
  const tabHiddenRef = useRef(false);

  const addressedKey = useCallback((group: RestockingGroup, entry: RestockingGroup["entries"][number]) =>
    `${group.sourceId}:${entry.itemId}`,
  []);

  useEffect(() => {
    function handleVisibility() {
      tabHiddenRef.current = document.hidden;
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (!expanded || !unitId || !shiftDate || !shiftPeriod) return;

    let mounted = true;

    async function poll() {
      if (tabHiddenRef.current || savingRef.current) return;
      try {
        const rows = await getRestockAddressed(unitId!, shiftDate!, shiftPeriod!);
        if (!mounted) return;
        setAddressedKeySet(new Set(rows.map((row) => `${row.target_type}:${row.target_id}:${row.item_id}`)));
      } catch {
        // Polling failure degrades silently.
      }
    }

    const timer = setInterval(() => {
      void poll();
    }, POLL_INTERVAL_MS);

    void poll();

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [expanded, shiftDate, shiftPeriod, unitId]);

  useEffect(() => {
    setAddressedKeySet(initialAddressed);
  }, [initialAddressed]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildRestockingText(restockingList));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable.
    }
  }

  async function handleToggle(group: RestockingGroup, entry: RestockingGroup["entries"][number]) {
    const key = addressedKey(group, entry);
    const currentlyAddressed = addressedKeySet.has(key);

    // Optimistic toggle
    setAddressedKeySet((current) => {
      const next = new Set(current);
      if (currentlyAddressed) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });

    if (!unitId || !shiftDate || !shiftPeriod) return;

    savingRef.current = true;
    const targetType = group.sourceName.includes("(Kit)") ? "kit" as const : "compartment" as const;
    const issueMap: Record<string, "missing" | "below_par" | "condition_issue"> = {
      "Missing": "missing",
      "Below par": "below_par",
      "Condition issue": "condition_issue",
    };

    try {
      await toggleRestockAddressed({
        unitId,
        shiftDate,
        shiftPeriod,
        targetType,
        targetId: group.sourceId,
        itemId: entry.itemId,
        issueType: issueMap[entry.issue] ?? "missing",
        addressed: !currentlyAddressed,
      });
    } catch {
      // Revert on failure
      setAddressedKeySet((current) => {
        const next = new Set(current);
        if (currentlyAddressed) {
          next.add(key);
        } else {
          next.delete(key);
        }
        return next;
      });
    } finally {
      savingRef.current = false;
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
                  {group.entries.map((entry) => {
                    const key = addressedKey(group, entry);
                    const checked = addressedKeySet.has(key);
                    return (
                      <li key={key} className="flex items-center gap-2">
                        <input
                          className="h-4 w-4 shrink-0 accent-red-700"
                          checked={checked}
                          onChange={() => void handleToggle(group, entry)}
                          type="checkbox"
                        />
                        <span>{entry.itemName} - {entry.detail}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
