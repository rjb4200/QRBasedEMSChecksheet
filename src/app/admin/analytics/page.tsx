import { createClient } from "@/lib/supabase/server";

export default async function ProviderAnalyticsPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string; unitId?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  let query = supabase.from("compartment_checks").select("checked_by, time_on_page, item_data, unit_id, compartment_id, unit_kit_id, users(full_name, email), units(name)").eq("status", "completed");
  if (params.from) query = query.gte("shift_date", params.from);
  if (params.to) query = query.lte("shift_date", params.to);
  if (params.unitId) query = query.eq("unit_id", params.unitId);
  const [{ data: checks }, { data: units }, { data: configuredItems }, { data: kitItems }] = await Promise.all([
    query,
    supabase.from("units").select("id, name").is("deleted_at", null).order("name"),
    supabase.from("unit_compartment_items").select("id, compartment_id, par_level"),
    supabase.from("kit_items").select("id, kit_id, par_level"),
  ]);
  const parMap = new Map<string, { parLevel: number | null }>([
    ...(configuredItems ?? []).map((item) => [item.id, { parLevel: item.par_level }] as [string, { parLevel: number | null }]),
    ...(kitItems ?? []).map((item) => [item.id, { parLevel: item.par_level }] as [string, { parLevel: number | null }]),
  ]);

  const stats = new Map<string, { name: string; count: number; seconds: number; discrepancies: number; itemCount: number }>();
  for (const check of checks ?? []) {
    if (!check.checked_by) continue;
    const user = Array.isArray(check.users) ? check.users[0] : check.users;
    const current = stats.get(check.checked_by) ?? { name: user?.full_name ?? user?.email ?? "Unknown", count: 0, seconds: 0, discrepancies: 0, itemCount: 0 };
    current.count += 1;
    current.seconds += check.time_on_page ?? 0;
    for (const [itemId, value] of Object.entries(check.item_data ?? {})) {
      const configuredItem = parMap.get(itemId);
      current.itemCount += 1;
      if (typeof value === "number" && configuredItem?.parLevel !== null && configuredItem?.parLevel !== undefined && value !== Number(configuredItem.parLevel)) {
        current.discrepancies += 1;
      }
    }
    stats.set(check.checked_by, current);
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="mt-2 text-4xl font-black">Provider Analytics</h1>
          <p className="mt-2 text-slate-600">Time-on-page data is for manual review only.</p>
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
          {Array.from(stats.entries()).map(([id, stat]) => (
            <article key={id} className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black">{stat.name}</h2>
              <p className="mt-2">Completed checks: <strong>{stat.count}</strong></p>
              <p>Average time: <strong>{stat.count ? Math.round(stat.seconds / stat.count) : 0}s</strong></p>
              <p>Discrepancy rate: <strong>{stat.itemCount ? Math.round((stat.discrepancies / stat.itemCount) * 100) : 0}%</strong></p>
              <p>Tracked item entries: <strong>{stat.itemCount}</strong></p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
