import { FleetMatrix } from "@/components/fleet-matrix";
import { getFleetStatus } from "@/lib/fleet";
import { createClient } from "@/lib/supabase/server";

export default async function SupervisorDashboardPage() {
  const supabase = await createClient();
  const units = await getFleetStatus(supabase);

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Supervisor Dashboard</p>
          <h1 className="mt-2 text-4xl font-black">Fleet Readiness</h1>
          <p className="mt-2 text-slate-600">View-only fleet status and completion percentages.</p>
        </div>
        <FleetMatrix initialUnits={units} />
      </section>
    </main>
  );
}
