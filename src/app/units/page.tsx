import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { hasRole, type AppRole } from "@/lib/auth/roles";

export default async function UnitsPage() {
  const supabase = createAdminClient();
  const authClient = await createClient();
  const { data: auth } = await authClient.auth.getUser();
  const [{ data: units }, { data: roleRow }] = await Promise.all([
    supabase
    .from("units")
    .select("id, name, unit_kind, unit_compartments(id)")
    .eq("status", "in_service")
      .order("name"),
    auth.user ? supabase.from("user_roles").select("role").eq("user_id", auth.user.id).maybeSingle() : Promise.resolve({ data: null }),
  ]);
  const role = roleRow?.role as AppRole | undefined;
  const canAccessAdmin = hasRole(role, "admin");

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white">
      <section className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-300">Crew Checkoff</p>
            <h1 className="mt-2 text-4xl font-black">Select Unit</h1>
            <p className="mt-2 text-slate-300">Only in-service units are available for checkoff. No login is required for crew checkoffs.</p>
          </div>
          {canAccessAdmin ? (
            <Link className="rounded-2xl bg-red-700 px-5 py-3 text-center font-bold text-white" href="/admin">Admin Dashboard</Link>
          ) : null}
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
