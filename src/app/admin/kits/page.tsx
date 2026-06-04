import Link from "next/link";
import { copyKit, createKit, createKitFromCompartment, deleteKit } from "./actions";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { IconEdit, IconTrash } from "@/components/icons";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";

function unitNames(assignments: any[] | null | undefined) {
  const names = (assignments ?? []).map((assignment) => {
    const unit = Array.isArray(assignment.units) ? assignment.units[0] : assignment.units;
    return unit;
  }).filter((unit) => unit?.deleted_at == null).map((unit) => unit.name).filter(Boolean);
  return names.length === 0 ? "Not assigned" : names.join(", ");
}

function activeAssignmentCount(assignments: any[] | null | undefined) {
  return (assignments ?? []).filter((assignment) => {
    const unit = Array.isArray(assignment.units) ? assignment.units[0] : assignment.units;
    return unit?.deleted_at == null;
  }).length;
}

export default async function AdminKitsPage() {
  const supabase = createAdminClient();
  const [{ data: kits }, { data: sourceCompartments }] = await Promise.all([
    supabase
      .from("kits")
      .select("id, name, description, sort_order, active, unit_kits(id, units(name, deleted_at)), kit_items(id)")
      .order("sort_order")
      .order("name"),
    supabase.from("unit_compartments").select("id, name, units(name)").order("name"),
  ]);

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-4xl font-black">Shared Layouts</h1>
          <p className="mt-2 max-w-3xl text-slate-600">Kits are shared equipment layouts assigned to units by reference. Edit kit contents here; unit pages show assigned kits read-only.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <form action={createKit} className="grid gap-3 rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Create Kit</h2>
            <input className="rounded-2xl border border-slate-300 px-4 py-3" name="name" placeholder="Kit name" required />
            <textarea className="rounded-2xl border border-slate-300 px-4 py-3" name="description" placeholder="Description" rows={3} />
            <input className="rounded-2xl border border-slate-300 px-4 py-3" name="sortOrder" placeholder="Sort order" type="number" />
            <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Create Kit</button>
          </form>

          <form action={createKitFromCompartment} className="grid gap-3 rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Create Kit From Compartment</h2>
            <select className="rounded-2xl border border-slate-300 px-4 py-3" name="sourceCompartmentId" required>
              <option value="">Select source compartment</option>
              {(sourceCompartments ?? []).map((compartment: any) => {
                const unit = Array.isArray(compartment.units) ? compartment.units[0] : compartment.units;
                return <option key={compartment.id} value={compartment.id}>{unit?.name} - {compartment.name}</option>;
              })}
            </select>
            <input className="rounded-2xl border border-slate-300 px-4 py-3" name="name" placeholder="New kit name" required />
            <input className="rounded-2xl border border-slate-300 px-4 py-3" name="sortOrder" placeholder="Sort order" type="number" />
            <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" type="submit">Copy Compartment Into Kit</button>
          </form>
        </div>

        <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-red-700">Kit</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(kits ?? []).map((kit: any) => {
            const assignments = kit.unit_kits ?? [];
            return (
              <article key={kit.id} className="rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="mt-2 text-2xl font-black">{kit.name}</h2>
                    <p className="mt-1 text-sm text-slate-600">{kit.description || "No description"}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${kit.active ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-700"}`}>{kit.active ? "Active" : "Inactive"}</span>
                </div>
                <p className="mt-3 text-sm font-bold">{kit.kit_items?.length ?? 0} items</p>
                <p className="mt-1 text-sm text-slate-600">Attached to {activeAssignmentCount(assignments)} unit{activeAssignmentCount(assignments) !== 1 ? "s" : ""}: {unitNames(assignments)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link className="rounded-2xl border border-slate-300 p-3 text-slate-600" href={`/admin/kits/${kit.id}`} title={`Edit ${kit.name}`}>
                    <IconEdit />
                  </Link>
                  <DeleteConfirmButton
                    disabled={activeAssignmentCount(assignments) > 0}
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
