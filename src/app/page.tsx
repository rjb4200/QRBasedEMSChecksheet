import Link from "next/link";

const statusCards = [
  { label: "Physical QR", value: "Required", detail: "Compartment forms open from truck-mounted QR codes." },
  { label: "Shift Reset", value: "06:00 / 18:00", detail: "Completed and partial work is archived every shift." },
  { label: "Fleet", value: "EC1-7 + Medic 1", detail: "Each unit can be configured independently." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-8 sm:px-8">
        <div className="flex flex-1 flex-col justify-center gap-10">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-300">Winchester Fire-EMS</p>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-black tracking-tight sm:text-7xl">EMS Asset & Compliance Tracker</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Mobile-first, QR-driven vehicle readiness checks with accountable shift history and supervisor visibility.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {statusCards.map((card) => (
              <div key={card.label} className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
                <p className="text-sm text-slate-300">{card.label}</p>
                <p className="mt-2 text-2xl font-bold">{card.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{card.detail}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="rounded-full bg-red-700 px-6 py-4 text-center font-bold shadow-lg shadow-red-950/40" href="/units">
              Select Unit
            </Link>
            <Link className="rounded-full border border-white/20 px-6 py-4 text-center font-bold text-slate-200" href="/admin">
              Admin Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
