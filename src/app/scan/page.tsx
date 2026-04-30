import Link from "next/link";
import { QrScanner } from "./qr-scanner";

export default function ScanPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-4 text-white">
      <section className="mx-auto max-w-md space-y-3">
        <QrScanner />
        <Link className="block rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-center font-bold text-white" href="/units">Back to Units</Link>
      </section>
    </main>
  );
}
