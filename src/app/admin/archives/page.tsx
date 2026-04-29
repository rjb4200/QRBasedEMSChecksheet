import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ArchivesPage({ searchParams }: { searchParams: Promise<{ unitId?: string; from?: string; to?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  let query = supabase.from("shift_archives").select("id, shift_date, shift_period, status, completion_percentage, completed_compartments, total_compartments, units(id, name)").order("shift_date", { ascending: false });
  if (params.unitId) query = query.eq("unit_id", params.unitId);
  if (params.from) query = query.gte("shift_date", params.from);
  if (params.to) query = query.lte("shift_date", params.to);
  const [{ data: archives }, { data: units }] = await Promise.all([query, supabase.from("units").select("id, name").order("name")]);

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Admin</p>
          <h1 className="mt-2 text-4xl font-black">Archive History</h1>
        </div>
        <form className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm md:grid-cols-4">
          <select className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={params.unitId ?? ""} name="unitId">
            <option value="">All units</option>
            {(units ?? []).map((unit) => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
          </select>
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={params.from} name="from" type="date" />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={params.to} name="to" type="date" />
          <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Filter</button>
        </form>
        <div className="grid gap-3">
          {(archives ?? []).map((archive) => {
            const unit = Array.isArray(archive.units) ? archive.units[0] : archive.units;
            return (
              <Link key={archive.id} className="rounded-3xl bg-white p-5 shadow-sm" href={`/admin/archives/${archive.id}`}>
                <h2 className="text-xl font-black">{unit?.name} | {archive.shift_date} {archive.shift_period}</h2>
                <p className="mt-2 font-semibold capitalize">{archive.status.replace("_", " ")} ({archive.completed_compartments}/{archive.total_compartments} compartments, {archive.completion_percentage}%)</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
