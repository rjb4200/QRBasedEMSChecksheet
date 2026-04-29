import Link from "next/link";
import { QrScanner } from "./qr-scanner";

export default function ScanPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white">
      <section className="mx-auto max-w-md space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-300">Physical Scan</p>
          <h1 className="mt-2 text-4xl font-black">Scan Compartment QR</h1>
          <p className="mt-2 text-slate-300">Scan the QR sticker mounted on the unit compartment.</p>
        </div>
        <QrScanner />
        <Link className="block rounded-2xl border border-white/20 px-5 py-3 text-center font-bold" href="/units">Back to Units</Link>
      </section>
    </main>
  );
}
