"use client";

export function PrintButton() {
  return (
    <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white print:hidden" onClick={() => window.print()} type="button">
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
