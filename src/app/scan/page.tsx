import Link from "next/link";
import { QrScanner } from "./qr-scanner";

export default function ScanPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-6 text-white">
      <section className="mx-auto max-w-md space-y-5">
        <div className="rounded-3xl bg-gradient-to-br from-red-700 to-slate-900 p-5 shadow-xl shadow-black/30">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-300">Physical Scan</p>
          <h1 className="mt-2 text-3xl font-black">Scan Compartment QR</h1>
          <p className="mt-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-slate-100">Point the camera at the compartment QR sticker. The checkoff opens automatically when the code is read.</p>
        </div>
        <QrScanner />
        <Link className="block rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-center font-bold text-white" href="/units">Back to Units</Link>
      </section>
    </main>
  );
}
