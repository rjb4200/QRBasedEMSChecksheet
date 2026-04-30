import { AutoRefresh } from "@/components/auto-refresh";
import { FleetMatrix } from "@/components/fleet-matrix";
import { getFleetStatus } from "@/lib/fleet";
import { createAdminClient } from "@/lib/supabase/server-admin";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();
  const units = await getFleetStatus(supabase);

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <AutoRefresh />
      <section className="mx-auto max-w-7xl space-y-6">
        <div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Admin Dashboard</p>
            <h1 className="mt-2 text-4xl font-black">Fleet Matrix</h1>
            <p className="mt-2 text-slate-600">Shows all units for the current checkoff day. Auto-refreshes every 30 seconds.</p>
          </div>
        </div>

        <FleetMatrix admin units={units} />
      </section>
    </main>
  );
}
