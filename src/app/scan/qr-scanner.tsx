"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

export function QrScanner() {
  const id = useId().replace(/:/g, "");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(id, { fps: 10, qrbox: { width: 260, height: 260 } }, false);
    scanner.render(
      (decodedText) => {
        try {
          const url = new URL(decodedText, window.location.origin);
          if (!url.pathname.startsWith("/checkoff/") && !url.pathname.startsWith("/q/")) {
            setError("This QR code is not a valid Winchester EMS checkoff code.");
            return;
          }
          scanner.clear().finally(() => router.push(url.pathname));
        } catch {
          setError("This QR code could not be read as a checkoff URL.");
        }
      },
      () => undefined,
    );

    return () => {
      scanner.clear().catch(() => undefined);
    };
  }, [id, router]);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-4 text-slate-950 shadow-2xl shadow-black/30">
        <div className="mb-3 rounded-2xl bg-slate-100 px-4 py-3">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-700">Camera Scanner</p>
          <p className="mt-1 text-sm font-semibold text-slate-600">Use the camera box below. If asked, allow camera access.</p>
        </div>
        <div className="overflow-hidden rounded-2xl border-2 border-slate-900 bg-slate-950" id={id} />
      </div>
      {error ? <div className="rounded-2xl border border-red-300 bg-red-950 p-4 text-sm font-bold text-red-100">{error}</div> : null}
      <style>{`
        #${id} {
          border: 0 !important;
          padding: 0 !important;
          color: #0f172a;
          font-family: inherit;
        }

        #${id} video,
        #${id} canvas {
          width: 100% !important;
          border-radius: 1rem;
        }

        #${id}__scan_region {
          background: #020617;
          padding: 0.75rem;
        }

        #${id}__dashboard {
          background: #ffffff;
          padding: 1rem !important;
          text-align: left;
        }

        #${id}__dashboard_section,
        #${id}__dashboard_section_csr,
        #${id}__dashboard_section_swaplink {
          margin: 0.75rem 0 !important;
        }

        #${id} select {
          width: 100%;
          border: 2px solid #cbd5e1;
          border-radius: 0.875rem;
          background: #f8fafc;
          color: #0f172a;
          font-weight: 700;
          padding: 0.75rem;
        }

        #${id} button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 2.75rem;
          border: 0;
          border-radius: 999px;
          background: #b91c1c;
          color: #ffffff;
          cursor: pointer;
          font-weight: 900;
          padding: 0.75rem 1rem;
          text-transform: uppercase;
        }

        #${id} a {
          color: #b91c1c !important;
          font-weight: 900;
          text-decoration: underline;
        }

        #${id} span,
        #${id} div {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
