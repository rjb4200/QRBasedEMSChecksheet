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
          if (!url.pathname.startsWith("/checkoff/")) {
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
      <div className="overflow-hidden rounded-3xl bg-white p-3 text-slate-950" id={id} />
      {error ? <div className="rounded-2xl border border-red-400/40 bg-red-950/60 p-4 text-sm text-red-100">{error}</div> : null}
    </div>
  );
}
