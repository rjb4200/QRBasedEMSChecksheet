"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RestockingGroup, ManualRestockItem } from "@/lib/restocking-list";
import {
  toggleRestockAddressed,
  getRestockAddressed,
  addManualRestockItem,
  toggleManualRestockAddressed,
  deleteManualRestockItem,
  getManualRestockAddressed,
} from "@/app/units/[id]/actions";

function buildRestockingText(groups: RestockingGroup[], manualItems: ManualRestockItem[]) {
  let text = groups
    .map((group) => {
      const entries = group.entries.map((entry) => `  - ${entry.itemName} — ${entry.detail}`).join("\n");
      return `${group.sourceName}\n${entries}`;
    })
    .join("\n\n");

  if (manualItems.length > 0) {
    const manualBlock = manualItems
      .map((item) => `  [${item.addressed ? "x" : " "}] ${item.itemName}${item.note ? ` — ${item.note}` : ""}`)
      .join("\n");
    text = text ? `${text}\n\nManual\n${manualBlock}` : `Manual\n${manualBlock}`;
  }

  return text;
}

function buildPrintHtml(groups: RestockingGroup[], manualItems: ManualRestockItem[], unitName?: string) {
  const title = unitName ? `Restocking List — ${unitName}` : "Restocking List";
  const date = new Date().toLocaleDateString();
  const rows = groups
    .flatMap((group) =>
      group.entries.map((entry) => `<tr><td class="source">${group.sourceName}</td><td>${entry.itemName}</td><td>${entry.detail}</td></tr>`),
    )
    .join("");

  const manualRows = manualItems
    .map((item) => `<tr><td class="source">${item.sourceName}</td><td>${item.itemName}${item.note ? ` (${item.note})` : ""}</td><td>${item.addressed ? "Addressed" : "Needed"}</td></tr>`)
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
    <tbody>${rows}${manualRows}</tbody>
  </table>
</body>
</html>`;
}

function handlePrint(groups: RestockingGroup[], manualItems: ManualRestockItem[], unitName?: string) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(buildPrintHtml(groups, manualItems, unitName));
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };
}

function IconAdd() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function IconShare() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" strokeLinecap="round" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect height="13" rx="2" ry="2" width="13" x="9" y="9" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconPrint() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" strokeLinecap="round" />
      <path d="M6 14h12v8H6z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14" strokeLinecap="round" />
      <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    </svg>
  );
}

function IconChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d={expanded ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} strokeLinecap="round" />
    </svg>
  );
}

type Props = {
  restockingList: RestockingGroup[];
  manualItems?: ManualRestockItem[];
  unitName?: string;
  unitId?: string;
  shiftDate?: string;
  shiftPeriod?: string;
  addressedKeySet: Set<string>;
};

const POLL_INTERVAL_MS = 15000;
const MANUAL_KEY_PREFIX = "manual:";

export function RestockingListSection({ restockingList, manualItems = [], unitName, unitId, shiftDate, shiftPeriod, addressedKeySet: initialAddressed }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addressedKeySet, setAddressedKeySet] = useState(initialAddressed);
  const savingRef = useRef(false);
  const tabHiddenRef = useRef(false);

  // Manual items state
  const [localManualItems, setLocalManualItems] = useState(manualItems);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addItemName, setAddItemName] = useState("");
  const [addItemNote, setAddItemNote] = useState("");
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState("");

  // Sync manualItems prop when it changes from server
  useEffect(() => {
    setLocalManualItems(manualItems);
  }, [manualItems]);

  const hasContent = restockingList.length > 0 || localManualItems.length > 0;

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

  // Polling for both generated and manual addressed state
  useEffect(() => {
    if (!expanded || !unitId || !shiftDate || !shiftPeriod) return;

    let mounted = true;

    async function poll() {
      if (tabHiddenRef.current || savingRef.current) return;
      try {
        const [exceptionRows, manualRows] = await Promise.all([
          getRestockAddressed(unitId!, shiftDate!, shiftPeriod!),
          getManualRestockAddressed(unitId!, shiftDate!, shiftPeriod!),
        ]);
        if (!mounted) return;
        setAddressedKeySet((current) => {
          const next = new Set(current);
          exceptionRows.forEach((row) => next.add(`${row.target_id}:${row.item_id}`));
          manualRows.forEach((row) => next.add(`${MANUAL_KEY_PREFIX}${row.id}`));
          return next;
        });
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

  // Copy handler
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildRestockingText(restockingList, localManualItems));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable.
    }
  }

  // Share handler
  async function handleShare() {
    const text = buildRestockingText(restockingList, localManualItems);
    const title = unitName ? `Restocking List — ${unitName}` : "Restocking List";

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback to copy
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard API unavailable.
      }
    }
  }

  // Generated exception toggle
  async function handleToggle(group: RestockingGroup, entry: RestockingGroup["entries"][number]) {
    const key = addressedKey(group, entry);
    const currentlyAddressed = addressedKeySet.has(key);

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

  // Manual item toggle
  async function handleManualToggle(item: ManualRestockItem) {
    const key = `${MANUAL_KEY_PREFIX}${item.id}`;
    const currentlyAddressed = addressedKeySet.has(key);

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
    try {
      await toggleManualRestockAddressed({
        itemId: item.id,
        unitId,
        shiftDate,
        shiftPeriod,
        addressed: !currentlyAddressed,
      });
    } catch {
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

  // Manual item delete
  async function handleManualDelete(item: ManualRestockItem) {
    if (!unitId) return;
    setLocalManualItems((prev) => prev.filter((i) => i.id !== item.id));
    try {
      await deleteManualRestockItem({ itemId: item.id, unitId });
    } catch {
      setLocalManualItems((prev) => [...prev, item]);
    }
  }

  // Add manual item
  async function handleAddSubmit() {
    const trimmed = addItemName.trim();
    if (!trimmed) {
      setAddError("Item name is required.");
      return;
    }
    if (!unitId || !shiftDate || !shiftPeriod) return;

    setAddSubmitting(true);
    setAddError("");
    try {
      const result = await addManualRestockItem({
        unitId,
        shiftDate,
        shiftPeriod,
        itemName: trimmed,
        note: addItemNote.trim(),
        sourceName: "Manual",
      });
      setLocalManualItems((prev) => [
        ...prev,
        { id: result.id, itemName: result.item_name, note: result.note, sourceName: result.source_name, addressed: false },
      ]);
      setAddItemName("");
      setAddItemNote("");
      setShowAddForm(false);
    } catch (error: unknown) {
      setAddError(error instanceof Error ? error.message : "Failed to add item.");
    } finally {
      setAddSubmitting(false);
    }
  }

  function handleAddClick() {
    if (!expanded) setExpanded(true);
    setShowAddForm(!showAddForm);
    setAddError("");
  }

  if (!hasContent) return null;

  return (
    <section className="rounded-3xl border border-red-200 bg-white shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 rounded-3xl p-5">
        <button
          className="flex-1 text-left"
          onClick={() => setExpanded(!expanded)}
          type="button"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-700">Restocking List</p>
        </button>
        <div className="flex items-center gap-1">
          {/* Add */}
          <button
            aria-label="Add restocking item"
            className="rounded-lg p-2 text-slate-700 hover:bg-red-50 hover:text-red-700"
            onClick={(event) => { event.stopPropagation(); handleAddClick(); }}
            type="button"
          >
            <IconAdd />
          </button>
          {/* Share */}
          <button
            aria-label="Share restocking list"
            className="rounded-lg p-2 text-slate-700 hover:bg-red-50 hover:text-red-700"
            onClick={(event) => { event.stopPropagation(); void handleShare(); }}
            type="button"
          >
            <IconShare />
          </button>
          {/* Copy */}
          <button
            aria-label="Copy restocking list"
            className="rounded-lg p-2 text-slate-700 hover:bg-red-50 hover:text-red-700"
            onClick={(event) => { event.stopPropagation(); void handleCopy(); }}
            type="button"
          >
            {copied ? <span className="text-xs font-bold text-red-700">Copied</span> : <IconCopy />}
          </button>
          {/* Print */}
          <button
            aria-label="Print restocking list"
            className="rounded-lg p-2 text-slate-700 hover:bg-red-50 hover:text-red-700"
            onClick={(event) => { event.stopPropagation(); handlePrint(restockingList, localManualItems, unitName); }}
            type="button"
          >
            <IconPrint />
          </button>
          {/* Expand/collapse */}
          <button
            className="rounded-lg p-2 text-red-700 hover:bg-red-50"
            onClick={() => setExpanded(!expanded)}
            type="button"
          >
            <IconChevron expanded={expanded} />
          </button>
        </div>
      </div>

      {expanded ? (
        <div className="px-5 pb-5">
          {/* Inline Add form */}
          {showAddForm ? (
            <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="space-y-3">
                <div>
                  <input
                    autoFocus
                    className="w-full rounded-xl border border-red-300 px-3 py-2 text-sm font-semibold text-red-950 placeholder-red-400"
                    maxLength={200}
                    onChange={(event) => { setAddItemName(event.target.value); setAddError(""); }}
                    placeholder="Item name (e.g. Replace cabinet seal)"
                    type="text"
                    value={addItemName}
                    disabled={addSubmitting}
                  />
                </div>
                <div>
                  <input
                    className="w-full rounded-xl border border-red-300 px-3 py-2 text-sm text-red-900 placeholder-red-400"
                    maxLength={1000}
                    onChange={(event) => setAddItemNote(event.target.value)}
                    placeholder="Note / reason (optional)"
                    type="text"
                    value={addItemNote}
                    disabled={addSubmitting}
                  />
                </div>
                {addError ? (
                  <p className="text-xs font-bold text-red-700">{addError}</p>
                ) : null}
                <div className="flex gap-2">
                  <button
                    className="rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                    disabled={addSubmitting}
                    onClick={() => void handleAddSubmit()}
                    type="button"
                  >
                    {addSubmitting ? "Adding..." : "Add Item"}
                  </button>
                  <button
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700"
                    onClick={() => { setShowAddForm(false); setAddError(""); }}
                    type="button"
                    disabled={addSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Complaint groups */}
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

            {/* Manual items group */}
            {localManualItems.length > 0 ? (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-red-950">
                <p className="font-black">Manual</p>
                <ul className="mt-2 space-y-1 text-sm font-semibold">
                  {localManualItems.map((item) => {
                    const key = `${MANUAL_KEY_PREFIX}${item.id}`;
                    const checked = addressedKeySet.has(key);
                    return (
                      <li key={item.id} className="flex items-center gap-2">
                        <input
                          className="h-4 w-4 shrink-0 accent-red-700"
                          checked={checked}
                          onChange={() => void handleManualToggle(item)}
                          type="checkbox"
                        />
                        <span className="flex-1">
                          {item.itemName}
                          {item.note ? <span className="text-xs text-red-800"> — {item.note}</span> : null}
                        </span>
                        <button
                          aria-label={`Delete ${item.itemName}`}
                          className="shrink-0 rounded p-1 text-red-400 hover:bg-red-100 hover:text-red-700"
                          onClick={() => void handleManualDelete(item)}
                          type="button"
                        >
                          <IconTrash />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
