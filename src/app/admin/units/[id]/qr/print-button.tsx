"use client";

import { useState, useCallback } from "react";

type QrCode = {
  id: string;
  code: string;
  name: string;
  url: string;
  dataUrl: string;
};

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

export function QrCodeGrid({ codes, unitName }: { codes: QrCode[]; unitName: string }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
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
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 print:hidden">
        <PrintButton onBeforePrint={expandAll} />
        <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" onClick={allExpanded ? collapseAll : expandAll} type="button">
          {allExpanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="grid gap-3 print:grid-cols-2 print:gap-0 print:mx-auto print:max-w-[576px]">
        {codes.map((code) => {
          const expanded = expandedIds.has(code.id);

          return (
            <article id={`qr-${code.id}`} key={code.id} className="qr-card break-inside-avoid rounded-3xl border border-slate-300 bg-white p-4 print:rounded-none print:border-none print:p-1 print:w-[288px] print:h-[288px] print:mx-auto">
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
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function RotatedLabelGrid({ codes, unitName }: { codes: QrCode[]; unitName: string }) {
  const [expanded, setExpanded] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(codes.map((code) => code.id)));
  const [secondCopyIds, setSecondCopyIds] = useState<Set<string>>(() => new Set());
  const [printAttemptedWithNone, setPrintAttemptedWithNone] = useState(false);

  const printLabels = codes.flatMap((code) => {
    if (!selectedIds.has(code.id)) return [];
    return secondCopyIds.has(code.id) ? [code, code] : [code];
  });

  const sheets: QrCode[][] = [];
  for (let index = 0; index < printLabels.length; index += 10) {
    sheets.push(printLabels.slice(index, index + 10));
  }

  function selectAll() {
    setSelectedIds(new Set(codes.map((code) => code.id)));
    setPrintAttemptedWithNone(false);
  }

  function deselectAll() {
    setSelectedIds(new Set());
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
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
      }
      return next;
    });
  }

  function printSelected() {
    if (printLabels.length === 0) {
      setPrintAttemptedWithNone(true);
      return;
    }

    setPrintAttemptedWithNone(false);
    setTimeout(() => window.print(), 0);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" onClick={printSelected} type="button">
          Print Selected
        </button>
        <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" onClick={deselectAll} type="button">
          Deselect All
        </button>
        <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" onClick={selectAll} type="button">
          Select All
        </button>
        <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" onClick={() => setExpanded(!expanded)} type="button">
          {expanded ? "Collapse All" : "Expand All"}
        </button>
        <p className="text-sm font-bold text-slate-600">{printLabels.length} physical label{printLabels.length === 1 ? "" : "s"} selected</p>
      </div>

      {printAttemptedWithNone ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800 print:hidden">No labels selected.</p>
      ) : null}

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
                <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-slate-800">
                  <label className="flex items-center gap-2">
                    <input checked={selectedIds.has(code.id)} className="h-5 w-5 accent-red-700" onChange={() => toggleSelected(code.id)} type="checkbox" />
                    Print label
                  </label>
                  <label className="flex items-center gap-2">
                    <input checked={secondCopyIds.has(code.id)} className="h-5 w-5 accent-red-700" onChange={() => toggleSecondCopy(code.id)} type="checkbox" />
                    Print second copy
                  </label>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden print:block">
        {sheets.map((sheet, sheetIndex) => (
          <section className="qr-label-sheet" key={sheetIndex}>
            {sheet.map((code, labelIndex) => (
              <div key={`${code.id}-${labelIndex}`} className="qr-label">
                <div className="qr-label-rotated">
                  <img
                    alt={`${unitName} ${code.name} QR code`}
                    src={code.dataUrl}
                    style={{ width: "2in", height: "2in", objectFit: "contain" }}
                  />
                  <div style={{ textAlign: "center", lineHeight: "1.1", maxWidth: "2in" }}>
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
