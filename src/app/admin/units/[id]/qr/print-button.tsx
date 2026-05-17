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

export function PrintSingleQrButton({ targetId }: { targetId: string }) {
  return (
    <button
      className="mt-4 rounded-2xl border border-slate-300 bg-white px-4 py-2 font-bold text-slate-950 print:hidden"
      onClick={() => {
        const target = document.getElementById(targetId);
        if (!target) return;

        const printWindow = window.open("", "_blank", "width=520,height=700");
        if (!printWindow) return;

        printWindow.document.write(`<!doctype html><html><head><title>QR Code</title><style>body{font-family:Arial,sans-serif;margin:24px;color:#020617}.qr-card{border:1px solid #cbd5e1;border-radius:24px;padding:24px;text-align:center}.qr-card img{width:320px;height:320px}button,.print-hidden{display:none}h2{font-size:28px;margin:16px 0 4px}p{font-size:18px;margin:0;color:#334155}</style></head><body>${target.outerHTML}<script>window.onload=()=>{window.print();window.close();}</script></body></html>`);
        printWindow.document.close();
      }}
      type="button"
    >
      Print This QR
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
    <div className="space-y-4 print:space-y-0">
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
                <PrintSingleQrButton targetId={`qr-${code.id}`} />
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
  const labelSheets: QrCode[][] = [];

  for (let index = 0; index < codes.length; index += 10) {
    labelSheets.push(codes.slice(index, index + 10));
  }

  return (
    <div className="space-y-4 print:space-y-0">
      <div className="flex flex-wrap gap-2 print:hidden">
        <PrintButton />
        <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" onClick={() => setExpanded(!expanded)} type="button">
          {expanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className={`${expanded ? "" : "hidden"} qr-label-print`}>
        {labelSheets.map((sheet, sheetIndex) => (
          <section className="qr-label-sheet" key={sheetIndex}>
            {sheet.map((code) => (
              <div key={code.id} className="qr-label">
                <div className="qr-label-rotated">
                  <img
                    alt={`${unitName} ${code.name} QR code`}
                    src={code.dataUrl}
                    style={{ width: "2in", height: "2in", objectFit: "contain" }}
                  />
                  <div style={{ textAlign: "center", lineHeight: "1.1", maxWidth: "2in" }}>
                    <p style={{ fontSize: "9pt", fontWeight: 700, margin: 0, overflowWrap: "anywhere" }}>{code.name}</p>
                    <p style={{ fontSize: "6pt", margin: "1px 0 0", overflowWrap: "anywhere" }}>{unitName}</p>
                    <p style={{ fontSize: "5pt", margin: "1px 0 0", fontFamily: "monospace", overflowWrap: "anywhere" }}>/q/{code.code}</p>
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
