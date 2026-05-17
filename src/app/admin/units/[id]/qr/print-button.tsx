"use client";

import { useState, useCallback } from "react";

type QrCode = {
  id: string;
  code: string;
  name: string;
  url: string;
  dataUrl: string;
};

const AVERY_94237_LABELS_PER_SHEET = 8;

function getAvery94237Position(index: number) {
  const row = Math.floor(index / 2);
  const column = index % 2;

  return {
    top: `${0.75 + row * 2.5}in`,
    left: `${1 + column * 3.5}in`,
  };
}

export function PrintButton({ onBeforePrint }: { onBeforePrint?: () => void }) {
  return (
    <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white print:hidden" onClick={() => {
      onBeforePrint?.();
      setTimeout(() => window.print(), 0);
    }} type="button">
      Print / Save as PDF
    </button>
  );
}

function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable.
    }
  }, [url]);

  return (
    <button
      className="rounded-2xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
      onClick={(event) => { event.stopPropagation(); void handleCopy(); }}
      type="button"
    >
      {copied ? "Copied" : "Copy URL"}
    </button>
  );
}

function buildPrintLabels(codes: QrCode[], selectedIds: Set<string>, secondCopyIds: Set<string>) {
  return codes.flatMap((code) => {
    if (!selectedIds.has(code.id)) return [];
    return secondCopyIds.has(code.id) ? [code, code] : [code];
  });
}

function useLabelPrintSelection(codes: QrCode[], maxPhysicalLabels?: number) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(codes.slice(0, maxPhysicalLabels).map((code) => code.id)));
  const [secondCopyIds, setSecondCopyIds] = useState<Set<string>>(() => new Set());
  const [printAttemptedWithNone, setPrintAttemptedWithNone] = useState(false);
  const [limitAttempted, setLimitAttempted] = useState(false);
  const printLabels = buildPrintLabels(codes, selectedIds, secondCopyIds);
  const maxReached = typeof maxPhysicalLabels === "number" && printLabels.length >= maxPhysicalLabels;

  function wouldExceedLimit(nextSelectedIds: Set<string>, nextSecondCopyIds: Set<string>) {
    return typeof maxPhysicalLabels === "number" && buildPrintLabels(codes, nextSelectedIds, nextSecondCopyIds).length > maxPhysicalLabels;
  }

  function selectAll() {
    setSelectedIds(new Set(codes.slice(0, maxPhysicalLabels).map((code) => code.id)));
    setSecondCopyIds(new Set());
    setPrintAttemptedWithNone(false);
    setLimitAttempted(false);
  }

  function deselectAll() {
    setSelectedIds(new Set());
    setLimitAttempted(false);
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (wouldExceedLimit(next, secondCopyIds)) {
          setLimitAttempted(true);
          return current;
        }
      }
      setLimitAttempted(false);
      return next;
    });
    setPrintAttemptedWithNone(false);
  }

  function toggleSecondCopy(id: string) {
    setSecondCopyIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (wouldExceedLimit(selectedIds, next)) {
          setLimitAttempted(true);
          return current;
        }
      }
      setLimitAttempted(false);
      return next;
    });
  }

  function canSelect(code: QrCode) {
    if (selectedIds.has(code.id) || typeof maxPhysicalLabels !== "number") return true;
    const nextSelectedIds = new Set(selectedIds);
    nextSelectedIds.add(code.id);
    return !wouldExceedLimit(nextSelectedIds, secondCopyIds);
  }

  function canAddSecondCopy(code: QrCode) {
    if (secondCopyIds.has(code.id)) return true;
    if (!selectedIds.has(code.id)) return false;
    if (typeof maxPhysicalLabels !== "number") return true;
    const nextSecondCopyIds = new Set(secondCopyIds);
    nextSecondCopyIds.add(code.id);
    return !wouldExceedLimit(selectedIds, nextSecondCopyIds);
  }

  function printSelected() {
    if (printLabels.length === 0) {
      setPrintAttemptedWithNone(true);
      return;
    }

    setPrintAttemptedWithNone(false);
    setTimeout(() => window.print(), 0);
  }

  return {
    deselectAll,
    canAddSecondCopy,
    canSelect,
    limitAttempted,
    maxPhysicalLabels,
    maxReached,
    printAttemptedWithNone,
    printLabels,
    printSelected,
    secondCopyIds,
    selectAll,
    selectedIds,
    toggleSecondCopy,
    toggleSelected,
  };
}

function LabelPrintControls({ count, max, onDeselectAll, onPrint, onSelectAll }: { count: number; max?: number; onDeselectAll: () => void; onPrint: () => void; onSelectAll?: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" onClick={onPrint} type="button">
        Print Selected
      </button>
      <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" onClick={onDeselectAll} type="button">
        Deselect All
      </button>
      {onSelectAll ? (
        <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" onClick={onSelectAll} type="button">
          Select All
        </button>
      ) : null}
      <p className={`rounded-2xl px-4 py-2 text-sm font-black ${max && count >= max ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-700"}`}>
        {count}{max ? `/${max}` : ""} physical label{count === 1 ? "" : "s"} selected
      </p>
    </div>
  );
}

function EmptyPrintMessage({ show }: { show: boolean }) {
  return show ? <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800 print:hidden">No labels selected.</p> : null;
}

function SelectionLimitMessage({ max, show }: { max?: number; show: boolean }) {
  return show && max ? <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900 print:hidden">Avery 94237 supports up to {max} physical labels per print. Deselect a label or turn off a second copy before adding another.</p> : null;
}

function LabelSelectionControls({ checked, disabledSecondCopy, disabledSelected, secondCopyChecked, onToggleSecondCopy, onToggleSelected }: { checked: boolean; disabledSecondCopy?: boolean; disabledSelected?: boolean; secondCopyChecked: boolean; onToggleSecondCopy: () => void; onToggleSelected: () => void }) {
  return (
    <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-slate-800 print:hidden">
      <label className={`flex items-center gap-2 ${disabledSelected ? "text-slate-400" : ""}`}>
        <input checked={checked} className="h-5 w-5 accent-red-700 disabled:accent-slate-300" disabled={disabledSelected} onChange={onToggleSelected} type="checkbox" />
        Print label
      </label>
      <label className={`flex items-center gap-2 ${disabledSecondCopy ? "text-slate-400" : ""}`}>
        <input checked={secondCopyChecked} className="h-5 w-5 accent-red-700 disabled:accent-slate-300" disabled={disabledSecondCopy} onChange={onToggleSecondCopy} type="checkbox" />
        Print second copy
      </label>
    </div>
  );
}

export function QrCodeGrid({ codes, unitName }: { codes: QrCode[]; unitName: string }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(codes.map((code) => code.id)));
  const selection = useLabelPrintSelection(codes);
  const allExpanded = expandedIds.size === codes.length;

  function expandAll() {
    setExpandedIds(new Set(codes.map((code) => code.id)));
  }

  function collapseAll() {
    setExpandedIds(new Set());
  }

  function toggle(id: string) {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="space-y-4 print:space-y-0">
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <LabelPrintControls count={selection.printLabels.length} onDeselectAll={selection.deselectAll} onPrint={selection.printSelected} onSelectAll={selection.selectAll} />
        <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" onClick={allExpanded ? collapseAll : expandAll} type="button">
          {allExpanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <EmptyPrintMessage show={selection.printAttemptedWithNone} />

      <div className="grid gap-3 print:hidden">
        {codes.map((code) => {
          const expanded = expandedIds.has(code.id);

          return (
            <article id={`qr-${code.id}`} key={code.id} className="qr-card break-inside-avoid rounded-3xl border border-slate-300 bg-white p-4">
              <button className="flex w-full items-center justify-between gap-4 text-left print:hidden" onClick={() => toggle(code.id)} type="button">
                  <span>
                    <span className="block text-lg font-black">{code.name}</span>
                    <span className="text-sm font-semibold text-slate-600">{unitName}</span>
                    <span className="mt-1 block font-mono text-sm font-black text-red-700">{code.code}</span>
                  </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">{expanded ? "Collapse" : "Expand"}</span>
              </button>

              <div className={`${expanded ? "mt-4" : "hidden"} text-center print:mt-0 print:block`}>
                <img alt={`${unitName} ${code.name} QR code`} className="mx-auto h-56 w-56 print:h-[216px] print:w-[216px]" src={code.dataUrl} />
                <h2 className="mt-4 text-xl font-black print:text-xs print:mt-0.5">{unitName}</h2>
                <p className="font-semibold text-slate-700 print:text-xs">{code.name}</p>
                <p className="mt-1 font-mono text-sm font-black text-red-700 print:hidden">Code: {code.code}</p>
                <div className="mt-2 flex items-center justify-center gap-2 print:hidden">
                  <p className="break-all text-xs text-slate-500">{code.url}</p>
                  <CopyUrlButton url={code.url} />
                </div>
                <LabelSelectionControls
                  checked={selection.selectedIds.has(code.id)}
                  disabledSecondCopy={!selection.canAddSecondCopy(code)}
                  disabledSelected={!selection.canSelect(code)}
                  onToggleSecondCopy={() => selection.toggleSecondCopy(code.id)}
                  onToggleSelected={() => selection.toggleSelected(code.id)}
                  secondCopyChecked={selection.secondCopyIds.has(code.id)}
                />
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden print:mx-auto print:grid print:max-w-[576px] print:grid-cols-2 print:gap-0">
        {selection.printLabels.map((code, index) => (
          <article id={`qr-print-${code.id}-${index}`} key={`${code.id}-${index}`} className="qr-card break-inside-avoid bg-white p-1 text-center print:h-[288px] print:w-[288px]">
            <img alt={`${unitName} ${code.name} QR code`} className="mx-auto h-[216px] w-[216px]" src={code.dataUrl} />
            <h2 className="mt-0.5 text-xs font-black">{unitName}</h2>
            <p className="text-xs font-semibold text-slate-700">{code.name}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function RotatedLabelGrid({ codes, unitName }: { codes: QrCode[]; unitName: string }) {
  const [expanded, setExpanded] = useState(true);
  const selection = useLabelPrintSelection(codes, AVERY_94237_LABELS_PER_SHEET);

  const sheets: QrCode[][] = [];
  for (let index = 0; index < selection.printLabels.length; index += AVERY_94237_LABELS_PER_SHEET) {
    sheets.push(selection.printLabels.slice(index, index + AVERY_94237_LABELS_PER_SHEET));
  }

  return (
    <div className="space-y-4 print:space-y-0">
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <LabelPrintControls count={selection.printLabels.length} max={selection.maxPhysicalLabels} onDeselectAll={selection.deselectAll} onPrint={selection.printSelected} />
        <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" onClick={() => setExpanded(!expanded)} type="button">
          {expanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <EmptyPrintMessage show={selection.printAttemptedWithNone} />
      <SelectionLimitMessage max={selection.maxPhysicalLabels} show={selection.limitAttempted || selection.maxReached} />

      <div className={`${expanded ? "" : "hidden"} grid gap-3 md:grid-cols-2 print:hidden`}>
        {codes.map((code) => (
          <article key={code.id} className="rounded-3xl border border-slate-300 bg-white p-4 shadow-sm">
            <div className="flex gap-4">
              <img
                alt={`${unitName} ${code.name} QR code`}
                src={code.dataUrl}
                className="h-28 w-28 shrink-0 rounded-xl border border-slate-200 bg-white p-1"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">{unitName}</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">{code.name}</h2>
                <p className="mt-1 font-mono text-sm font-black text-red-700">Code: {code.code}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <p className="break-all text-xs text-slate-500">{code.url}</p>
                  <CopyUrlButton url={code.url} />
                </div>
                <LabelSelectionControls
                  checked={selection.selectedIds.has(code.id)}
                  disabledSecondCopy={!selection.canAddSecondCopy(code)}
                  disabledSelected={!selection.canSelect(code)}
                  onToggleSecondCopy={() => selection.toggleSecondCopy(code.id)}
                  onToggleSelected={() => selection.toggleSelected(code.id)}
                  secondCopyChecked={selection.secondCopyIds.has(code.id)}
                />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden print:block print:m-0 print:p-0">
        {sheets.map((sheet, sheetIndex) => (
          <section className="qr-label-sheet" key={sheetIndex}>
            {sheet.map((code, labelIndex) => (
              <div key={`${code.id}-${labelIndex}`} className="qr-label" style={getAvery94237Position(labelIndex)}>
                <div className="qr-label-rotated">
                  <img
                    alt={`${unitName} ${code.name} QR code`}
                    src={code.dataUrl}
                    style={{ width: "1.92in", height: "1.92in", objectFit: "contain" }}
                  />
                  <div style={{ textAlign: "center", lineHeight: "1.1", maxWidth: "1.92in" }}>
                    <p style={{ fontSize: "9pt", fontWeight: 700, margin: 0, overflowWrap: "anywhere" }}>{code.name}</p>
                    <p style={{ fontSize: "6pt", margin: "1px 0 0", overflowWrap: "anywhere" }}>{unitName}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
