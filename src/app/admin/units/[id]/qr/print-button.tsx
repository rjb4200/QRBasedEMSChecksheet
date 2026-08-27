"use client";

import { useState, useCallback } from "react";

type QrCode = {
  id: string;
  code: string;
  name: string;
  url: string;
  dataUrl: string;
};

const PIXCUT_PNG_WIDTH = 900;
const PIXCUT_PNG_HEIGHT = 600;

const AVERY_94237_LABELS_PER_SHEET = 8;
const R011_LABELS_PER_SHEET = 10;
const SPARTAN_S004_LABELS_PER_SHEET = 6;
const PIXCUT_LABELS_PER_SHEET = 3;

function getPixCutPosition(index: number) {
  const positions = [
    { top: "0in", left: "0.5in" },
    { top: "0in", left: "3.5in" },
    { top: "2in", left: "0.5in" },
  ];

  return positions[index];
}

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

function getR011Position(index: number) {
  const row = Math.floor(index / 2);
  const column = index % 2;

  return {
    top: `${0.25 + row * 2.115}in`,
    left: `${1.16 + column * 3.125}in`,
  };
}

function getSpartanS004Position(index: number) {
  const row = Math.floor(index / 2);
  const column = index % 2;

  return {
    top: `${1 + row * 3}in`,
    left: `${1.25 + column * 3}in`,
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

function SelectionLimitMessage({ labelName, max, show }: { labelName: string; max?: number; show: boolean }) {
  return show && max ? <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900 print:hidden">{labelName} supports up to {max} physical labels per print. Deselect a label or turn off a second copy before adding another.</p> : null;
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
  const [expanded, setExpanded] = useState(true);
  const selection = useLabelPrintSelection(codes, SPARTAN_S004_LABELS_PER_SHEET);

  return (
    <div className="space-y-4 print:space-y-0">
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <LabelPrintControls count={selection.printLabels.length} max={selection.maxPhysicalLabels} onDeselectAll={selection.deselectAll} onPrint={selection.printSelected} />
        <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" onClick={() => setExpanded(!expanded)} type="button">
          {expanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <EmptyPrintMessage show={selection.printAttemptedWithNone} />
      <SelectionLimitMessage labelName="Spartan S004 3x3" max={selection.maxPhysicalLabels} show={selection.limitAttempted || selection.maxReached} />

      <div className={`${expanded ? "" : "hidden"} grid gap-3 md:grid-cols-2 print:hidden`}>
        {codes.map((code) => (
          <article id={`qr-${code.id}`} key={code.id} className="qr-card break-inside-avoid rounded-3xl border border-slate-300 bg-white p-4 shadow-sm">
            <div className="flex gap-4">
              <img
                alt={`${unitName} ${code.name} QR code`}
                src={code.dataUrl}
                className="h-28 w-28 shrink-0 rounded-xl border border-slate-200 bg-white p-1"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">{unitName}</p>
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
        <section className="qr-spartan-sheet">
        {selection.printLabels.map((code, index) => (
          <article id={`qr-print-${code.id}-${index}`} key={`${code.id}-${index}`} className="qr-spartan-label" style={getSpartanS004Position(index)}>
            <img alt={`${unitName} ${code.name} QR code`} src={code.dataUrl} style={{ width: "2.18in", height: "2.18in", objectFit: "contain" }} />
            <div style={{ textAlign: "center", lineHeight: "1.1", maxWidth: "2.7in" }}>
              <h2 style={{ fontSize: "9pt", fontWeight: 900, margin: "0.03in 0 0" }}>{unitName}</h2>
              <p style={{ fontSize: "8pt", fontWeight: 600, margin: "0.03in 0 0", overflowWrap: "anywhere" }}>{code.name}</p>
            </div>
          </article>
        ))}
        </section>
      </div>
    </div>
  );
}

export function RotatedLabelGrid({
  codes,
  unitName,
  labelName = "Avery 94237",
  labelsPerSheet = AVERY_94237_LABELS_PER_SHEET,
  positionForIndex = getAvery94237Position,
}: {
  codes: QrCode[];
  unitName: string;
  labelName?: string;
  labelsPerSheet?: number;
  positionForIndex?: (index: number) => { left: string; top: string };
}) {
  const [expanded, setExpanded] = useState(true);
  const selection = useLabelPrintSelection(codes, labelsPerSheet);

  const sheets: QrCode[][] = [];
  for (let index = 0; index < selection.printLabels.length; index += labelsPerSheet) {
    sheets.push(selection.printLabels.slice(index, index + labelsPerSheet));
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
      <SelectionLimitMessage labelName={labelName} max={selection.maxPhysicalLabels} show={selection.limitAttempted || selection.maxReached} />

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
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">{unitName}</p>
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
              <div key={`${code.id}-${labelIndex}`} className="qr-label" style={positionForIndex(labelIndex)}>
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

function safeFilenamePart(value: string) {
  return value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "label";
}

async function downloadPixCutLabel(code: QrCode, unitName: string) {
  const qrImage = new Image();
  qrImage.src = code.dataUrl;
  await new Promise<void>((resolve, reject) => {
    qrImage.onload = () => resolve();
    qrImage.onerror = () => reject(new Error("Unable to create the QR label image."));
  });

  const canvas = document.createElement("canvas");
  canvas.width = PIXCUT_PNG_WIDTH;
  canvas.height = PIXCUT_PNG_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) return;

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Match the R011 template: create the portrait label artwork, then rotate it into the 3x2 label.
  context.save();
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(Math.PI / 2);
  context.drawImage(qrImage, -288, -432, 576, 576);
  context.fillStyle = "#020617";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "700 27px Arial";
  context.fillText(unitName, 0, 230, 540);
  context.font = "700 24px Arial";
  const words = code.name.split(/\s+/);
  const lines = words.reduce<string[]>((current, word) => {
    const lastLine = current.at(-1) ?? "";
    if (lastLine && context.measureText(`${lastLine} ${word}`).width > 240) {
      current.push(word);
    } else if (lastLine) {
      current[current.length - 1] = `${lastLine} ${word}`;
    } else {
      current.push(word);
    }
    return current;
  }, []);
  lines.slice(0, 3).forEach((line, index) => context.fillText(line, 0, 275 + index * 31, 540));
  context.restore();

  const download = document.createElement("a");
  download.href = canvas.toDataURL("image/png");
  download.download = `${safeFilenamePart(unitName)}-${safeFilenamePart(code.name)}-qr-label.png`;
  document.body.appendChild(download);
  download.click();
  download.remove();
}

export function PixCutLabelGrid({ codes, unitName }: { codes: QrCode[]; unitName: string }) {
  const [expanded, setExpanded] = useState(true);
  const [downloadError, setDownloadError] = useState(false);
  const selection = useLabelPrintSelection(codes, PIXCUT_LABELS_PER_SHEET);
  const sheets: QrCode[][] = [];

  for (let index = 0; index < selection.printLabels.length; index += PIXCUT_LABELS_PER_SHEET) {
    sheets.push(selection.printLabels.slice(index, index + PIXCUT_LABELS_PER_SHEET));
  }

  async function downloadSelected() {
    try {
      setDownloadError(false);
      await Promise.all(selection.printLabels.map((code) => downloadPixCutLabel(code, unitName)));
    } catch {
      setDownloadError(true);
    }
  }

  return (
    <div className="space-y-4 print:space-y-0">
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" disabled={selection.printLabels.length === 0} onClick={() => void downloadSelected()} type="button">
          Download Selected PNGs
        </button>
        <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" onClick={selection.deselectAll} type="button">
          Deselect All
        </button>
        <p className={`rounded-2xl px-4 py-2 text-sm font-black ${selection.maxReached ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-700"}`}>
          {selection.printLabels.length}/{PIXCUT_LABELS_PER_SHEET} individual PNG{selection.printLabels.length === 1 ? "" : "s"} selected
        </p>
        <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" onClick={() => setExpanded(!expanded)} type="button">
          {expanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <EmptyPrintMessage show={selection.printAttemptedWithNone} />
      <SelectionLimitMessage labelName="Liene PixCut S1 4x7" max={selection.maxPhysicalLabels} show={selection.limitAttempted || selection.maxReached} />
      {downloadError ? <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800 print:hidden">Unable to create one or more PNG labels. Please try again.</p> : null}

      <div className={`${expanded ? "" : "hidden"} grid gap-3 md:grid-cols-2 print:hidden`}>
        {codes.map((code) => (
          <article key={code.id} className="rounded-3xl border border-slate-300 bg-white p-4 shadow-sm">
            <div className="flex gap-4">
              <img alt={`${unitName} ${code.name} QR code`} src={code.dataUrl} className="h-28 w-28 shrink-0 rounded-xl border border-slate-200 bg-white p-1" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">{unitName}</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">{code.name}</h2>
                <p className="mt-1 font-mono text-sm font-black text-red-700">Code: {code.code}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <p className="break-all text-xs text-slate-500">{code.url}</p>
                  <CopyUrlButton url={code.url} />
                  <button className="rounded-2xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50" onClick={() => void downloadPixCutLabel(code, unitName).catch(() => setDownloadError(true))} type="button">
                    Download PNG
                  </button>
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
          <section className="pixcut-label-sheet" key={sheetIndex}>
            {sheet.map((code, labelIndex) => (
              <article className="pixcut-label" key={`${code.id}-${labelIndex}`} style={getPixCutPosition(labelIndex)}>
                <div className="pixcut-label-content">
                  <img alt={`${unitName} ${code.name} QR code`} src={code.dataUrl} style={{ width: "1.92in", height: "1.92in", objectFit: "contain" }} />
                  <div style={{ textAlign: "center", lineHeight: "1.1", maxWidth: "1.92in" }}>
                    <p style={{ fontSize: "9pt", fontWeight: 700, margin: 0, overflowWrap: "anywhere" }}>{code.name}</p>
                    <p style={{ fontSize: "6pt", margin: "1px 0 0", overflowWrap: "anywhere" }}>{unitName}</p>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

export { getR011Position, R011_LABELS_PER_SHEET };
