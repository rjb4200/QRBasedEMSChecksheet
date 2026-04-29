import Link from "next/link";
import { createUnit, deleteUnit, toggleUnitStatus } from "./actions";
import { createAdminClient } from "@/lib/supabase/server-admin";

export const dynamic = "force-dynamic";

export default async function AdminUnitsPage() {
  const supabase = createAdminClient();
  const { data: units } = await supabase.from("units").select("id, name, unit_kind, status, unit_compartments(id)").order("name");

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Admin</p>
          <h1 className="mt-2 text-4xl font-black">Units</h1>
          <p className="mt-2 text-slate-600">Build each unit independently from scratch or by copying an existing unit.</p>
        </div>

        <form action={createUnit} className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm md:grid-cols-[1fr_120px_240px_auto]">
          <input className="rounded-2xl border border-slate-300 px-4 py-3" name="name" placeholder="Unit name (EC1, Medic 1)" required />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" name="unitKind" placeholder="Type" defaultValue="EC" />
          <select className="rounded-2xl border border-slate-300 px-4 py-3" name="sourceUnitId">
            <option value="">From scratch</option>
            {(units ?? []).map((unit) => <option key={unit.id} value={unit.id}>Copy {unit.name}</option>)}
          </select>
          <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Create</button>
        </form>

        <div className="grid gap-3">
          {(units ?? []).map((unit) => (
            <div key={unit.id} className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-5 shadow-sm sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-black">{unit.name}</h2>
                <p className="text-sm text-slate-600">{unit.unit_kind} | {unit.unit_compartments?.length ?? 0} compartments | {unit.status.replace("_", " ")}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" href={`/admin/units/${unit.id}`}>Edit</Link>
                <Link className="rounded-2xl border border-slate-300 px-5 py-3 font-bold" href={`/admin/units/${unit.id}/qr`}>QR Codes</Link>
                <form action={toggleUnitStatus}>
                  <input name="id" type="hidden" value={unit.id} />
                  <input name="status" type="hidden" value={unit.status === "in_service" ? "out_of_service" : "in_service"} />
                  <button className="rounded-2xl border border-slate-300 px-5 py-3 font-bold" type="submit">{unit.status === "in_service" ? "Set OOS" : "Set In-Service"}</button>
                </form>
                <form action={deleteUnit}>
                  <input name="id" type="hidden" value={unit.id} />
                  <button className="rounded-2xl border border-red-200 px-5 py-3 font-bold text-red-700" type="submit">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
