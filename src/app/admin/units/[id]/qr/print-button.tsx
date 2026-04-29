"use client";

import { useState } from "react";

type QrCode = {
  id: string;
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

      <div className="grid gap-3 print:grid-cols-3 print:gap-3">
        {codes.map((code) => {
          const expanded = expandedIds.has(code.id);

          return (
            <article id={`qr-${code.id}`} key={code.id} className="qr-card break-inside-avoid rounded-3xl border border-slate-300 bg-white p-4 print:rounded-xl print:p-3">
              <button className="flex w-full items-center justify-between gap-4 text-left print:hidden" onClick={() => toggle(code.id)} type="button">
                <span>
                  <span className="block text-lg font-black">{code.name}</span>
                  <span className="text-sm font-semibold text-slate-600">{unitName}</span>
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">{expanded ? "Collapse" : "Expand"}</span>
              </button>

              <div className={`${expanded ? "mt-4" : "hidden"} text-center print:mt-0 print:block`}>
                <img alt={`${unitName} ${code.name} QR code`} className="mx-auto h-56 w-56 print:h-40 print:w-40" src={code.dataUrl} />
                <h2 className="mt-4 text-xl font-black print:text-base">{unitName}</h2>
                <p className="font-semibold text-slate-700 print:text-sm">{code.name}</p>
                <p className="mt-2 break-all text-xs text-slate-500 print:hidden">{code.url}</p>
                <PrintSingleQrButton targetId={`qr-${code.id}`} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
