import Link from "next/link";
import { AutoRefresh } from "@/components/auto-refresh";
import { FleetMatrix } from "@/components/fleet-matrix";
import { getFleetStatus } from "@/lib/fleet";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ unitKind?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const units = await getFleetStatus(supabase, params.unitKind);

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <AutoRefresh />
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Admin Dashboard</p>
            <h1 className="mt-2 text-4xl font-black">Fleet Matrix</h1>
            <p className="mt-2 text-slate-600">Auto-refreshes every 30 seconds.</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            <Link className="rounded-2xl bg-slate-950 px-4 py-3 font-bold text-white" href="/admin/units">Units</Link>
            <Link className="rounded-2xl bg-slate-950 px-4 py-3 font-bold text-white" href="/admin/equipment">Equipment</Link>
            <Link className="rounded-2xl bg-slate-950 px-4 py-3 font-bold text-white" href="/admin/templates">Templates</Link>
            <Link className="rounded-2xl bg-slate-950 px-4 py-3 font-bold text-white" href="/admin/users">Users</Link>
          </nav>
        </div>

        <form className="flex gap-3 rounded-3xl bg-white p-4 shadow-sm">
          <select className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={params.unitKind ?? ""} name="unitKind">
            <option value="">All unit types</option>
            <option value="EC">EC</option>
            <option value="Medic">Medic</option>
          </select>
          <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Filter</button>
        </form>

        <FleetMatrix admin units={units} />
      </section>
    </main>
  );
}
