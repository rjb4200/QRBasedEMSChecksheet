import Link from "next/link";
import { copyKit, createKit, createKitFromCompartment, deleteKit } from "./actions";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { IconEdit, IconTrash } from "@/components/icons";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { KitAssignmentEditor } from "./kit-assignment-editor";

export default async function AdminKitsPage() {
  const supabase = createAdminClient();
  const [{ data: kits }, { data: sourceCompartments }, { data: allUnits }, { data: allUnitKits }] = await Promise.all([
    supabase
      .from("kits")
      .select("id, name, description, sort_order, active, kit_items(id)")
      .order("sort_order")
      .order("name"),
    supabase.from("unit_compartments").select("id, name, units(name)").order("name"),
    supabase.from("units").select("id, name").is("deleted_at", null).order("name"),
    supabase.from("unit_kits").select("id, kit_id, unit_id"),
  ]);

  const unitNameMap = new Map((allUnits ?? []).map((u: any) => [u.id, u.name]));
  const assignmentsByKit = new Map<string, { unitKitId: string; unitId: string; unitName: string }[]>();
  for (const uk of (allUnitKits ?? []) as any[]) {
    const list = assignmentsByKit.get(uk.kit_id) ?? [];
    list.push({ unitKitId: uk.id, unitId: uk.unit_id, unitName: unitNameMap.get(uk.unit_id) ?? uk.unit_id });
    assignmentsByKit.set(uk.kit_id, list);
  }

  const allUnitInfos = (allUnits ?? []).map((u: any) => ({ id: u.id, name: u.name }));

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-4xl font-black">Shared Layouts</h1>
          <p className="mt-2 max-w-3xl text-slate-600">Kits are shared equipment layouts assigned to units by reference. Edit kit contents here; unit pages show assigned kits read-only.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <form action={createKit} className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Create Kit</h2>
            <input className="rounded-2xl border border-slate-300 px-4 py-3" name="name" placeholder="Kit name" required />
            <textarea className="rounded-2xl border border-slate-300 px-4 py-3" name="description" placeholder="Description" rows={3} />
            <input className="rounded-2xl border border-slate-300 px-4 py-3" name="sortOrder" placeholder="Sort order" type="number" />
            <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Create Kit</button>
          </form>

          <form action={createKitFromCompartment} className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Create Kit From Compartment</h2>
            <select className="rounded-2xl border border-slate-300 px-4 py-3" name="sourceCompartmentId" required>
              <option value="">Select source compartment</option>
              {(sourceCompartments ?? []).map((compartment: any) => {
                const unit = Array.isArray(compartment.units) ? compartment.units[0] : compartment.units;
                return <option key={compartment.id} value={compartment.id}>{unit?.name} - {compartment.name}</option>;
              })}
            </select>
            <input className="rounded-2xl border border-slate-300 px-4 py-3" name="name" placeholder="New kit name" required />
            <input className="rounded-2xl border border-slate-300 px-4 py-3" name="sortOrder" placeholder="Sort order" type="number" />
            <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Copy Compartment Into Kit</button>
          </form>
        </div>

        <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-red-700">Kit</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(kits ?? []).map((kit: any) => {
            const assignments = assignmentsByKit.get(kit.id) ?? [];
            return (
              <article key={kit.id} className="rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="mt-2 text-2xl font-black">{kit.name}</h2>
                    <p className="mt-1 text-sm text-slate-600">{kit.description || "No description"}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${kit.active ? "bg-green-100 text-green-800 border-green-200" : "bg-slate-100 text-slate-700 border-slate-300"}`}>{kit.active ? "Active" : "Inactive"}</span>
                </div>
                <p className="mt-3 text-sm font-bold">{kit.kit_items?.length ?? 0} items</p>
                <KitAssignmentEditor
                  kitId={kit.id}
                  assignments={assignments}
                  allUnits={allUnitInfos}
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link className="rounded-2xl border border-slate-300 p-3 text-slate-600" href={`/admin/kits/${kit.id}`} title={`Edit ${kit.name}`}>
                    <IconEdit />
                  </Link>
                  <DeleteConfirmButton
                    disabled={assignments.length > 0}
                    formAction={deleteKit}
                    hiddenInputs={[{ name: "id", value: kit.id }]}
                  />
                </div>
                <form action={copyKit} className="mt-4 grid gap-2 rounded-2xl bg-slate-100 p-3">
                  <input name="kitId" type="hidden" value={kit.id} />
                  <input className="rounded-xl bg-white px-3 py-2" name="name" placeholder={`Copy of ${kit.name}`} required />
                  <button className="rounded-xl border border-slate-300 bg-white px-3 py-2 font-bold" type="submit">Copy Kit</button>
                </form>
              </article>
            );
          })}
          </div>
        </div>
      </section>
    </main>
  );
}
