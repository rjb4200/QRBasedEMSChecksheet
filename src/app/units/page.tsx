import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function UnitsPage() {
  const supabase = await createClient();
  const { data: units } = await supabase
    .from("units")
    .select("id, name, unit_kind, unit_compartments(id)")
    .eq("status", "in_service")
    .order("name");

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white">
      <section className="mx-auto max-w-4xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-300">Crew Checkoff</p>
          <h1 className="mt-2 text-4xl font-black">Select Unit</h1>
          <p className="mt-2 text-slate-300">Only in-service units are available for checkoff.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(units ?? []).map((unit) => (
            <Link key={unit.id} className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl transition hover:bg-white/15" href={`/units/${unit.id}`}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-200">{unit.unit_kind}</p>
              <h2 className="mt-3 text-3xl font-black">{unit.name}</h2>
              <p className="mt-3 text-slate-300">{unit.unit_compartments?.length ?? 0} compartments</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
