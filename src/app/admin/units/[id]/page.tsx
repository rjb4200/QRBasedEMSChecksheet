import Link from "next/link";
import { addUnitCompartment, addUnitItem, assignKitToUnit, cloneKitToUnitCompartment, deleteUnitCompartment, deleteUnitItem, importUnitCompartment, removeKitFromUnit, toggleUnitStatus, uploadCompartmentPhoto } from "../actions";
import { createAdminClient } from "@/lib/supabase/server-admin";

export default async function UnitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createAdminClient();
  const [{ data: unit }, { data: equipment }, { data: sourceCompartments }, { data: kits }] = await Promise.all([
    supabase.from("units").select("id, name, status, unit_compartments(id, name, sort_order, photo_url, unit_compartment_items(id, par_level, input_type, equipment_catalog(name))), unit_kits(id, sort_order, kits(id, name, description, photo_url, kit_items(id, par_level, input_type, sort_order, equipment_catalog(name))))").eq("id", id).is("deleted_at", null).single(),
    supabase.from("equipment_catalog").select("id, name, default_par_level, input_type").order("name"),
    supabase.from("unit_compartments").select("id, name, units(name)").order("name"),
    supabase.from("kits").select("id, name, active").eq("active", true).order("name"),
  ]);
  const compartments = (unit?.unit_compartments ?? []).map((compartment: any) => ({ type: "compartment" as const, sortOrder: compartment.sort_order ?? 0, compartment }));
  const assignedKits = (unit?.unit_kits ?? []).map((assignment: any) => ({ type: "kit" as const, sortOrder: assignment.sort_order ?? 0, assignment }));
  const layoutItems = [...compartments, ...assignedKits].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Unit Builder</p>
            <h1 className="mt-2 text-4xl font-black">{unit?.name}</h1>
            <p className="mt-2 capitalize text-slate-600">{unit?.status?.replace("_", " ")}</p>
          </div>
          {unit ? (
            <div className="flex flex-wrap gap-2">
              <Link className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" href={`/admin/units/${unit.id}/qr`}>View / Print QR Codes</Link>
              <form action={toggleUnitStatus}>
                <input name="id" type="hidden" value={unit.id} />
                <input name="status" type="hidden" value={unit.status === "in_service" ? "out_of_service" : "in_service"} />
                <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" type="submit">Toggle Status</button>
              </form>
            </div>
          ) : null}
        </div>

        <form action={addUnitCompartment} className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_130px_auto]">
          <input name="unitId" type="hidden" value={id} />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" name="name" placeholder="Compartment name" required />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" name="sortOrder" placeholder="Order" type="number" />
          <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Add Compartment</button>
        </form>

        <form action={importUnitCompartment} className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_1fr_130px_auto]">
          <input name="unitId" type="hidden" value={id} />
          <select className="rounded-2xl border border-slate-300 px-4 py-3" name="sourceCompartmentId" required>
            <option value="">Import one compartment</option>
            {(sourceCompartments ?? []).filter((compartment) => !unit?.unit_compartments?.some((existing) => existing.id === compartment.id)).map((compartment) => {
              const sourceUnit = Array.isArray(compartment.units) ? compartment.units[0] : compartment.units;
              return <option key={compartment.id} value={compartment.id}>{sourceUnit?.name} - {compartment.name}</option>;
            })}
          </select>
          <input className="rounded-2xl border border-slate-300 px-4 py-3" name="name" placeholder="Optional new name" />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" name="sortOrder" placeholder="Order" type="number" />
          <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Import</button>
        </form>

        <div className="grid gap-4 lg:grid-cols-2">
          <form action={assignKitToUnit} className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_130px_auto]">
            <input name="unitId" type="hidden" value={id} />
            <select className="rounded-2xl border border-slate-300 px-4 py-3" name="kitId" required>
              <option value="">Add kit to unit</option>
              {(kits ?? []).map((kit) => <option key={kit.id} value={kit.id}>{kit.name}</option>)}
            </select>
            <input className="rounded-2xl border border-slate-300 px-4 py-3" name="sortOrder" placeholder="Order" type="number" />
            <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Assign Kit</button>
          </form>

          <form action={cloneKitToUnitCompartment} className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_1fr_130px_auto]">
            <input name="unitId" type="hidden" value={id} />
            <select className="rounded-2xl border border-slate-300 px-4 py-3" name="kitId" required>
              <option value="">Create compartment from kit</option>
              {(kits ?? []).map((kit) => <option key={kit.id} value={kit.id}>{kit.name}</option>)}
            </select>
            <input className="rounded-2xl border border-slate-300 px-4 py-3" name="name" placeholder="Optional compartment name" />
            <input className="rounded-2xl border border-slate-300 px-4 py-3" name="sortOrder" placeholder="Order" type="number" />
            <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" type="submit">Clone</button>
          </form>
        </div>

        <div className="grid gap-4">
          {layoutItems.map((item) => {
            if (item.type === "kit") {
              const assignment = item.assignment;
              const kit = Array.isArray(assignment.kits) ? assignment.kits[0] : assignment.kits;
              const kitItems = [...(kit?.kit_items ?? [])].sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
              return (
                <details key={assignment.id} className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm">
                  <summary className="cursor-pointer list-none">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-700">Shared Kit</p>
                        <h2 className="mt-1 text-2xl font-black">{kit?.name}</h2>
                        <p className="mt-1 text-sm text-slate-600">Read-only on unit page. Edit this shared kit from the Kits page.</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link className="rounded-2xl bg-red-700 px-4 py-2 font-bold text-white" href={`/admin/kits/${kit?.id}`}>Edit Kit</Link>
                        <form action={removeKitFromUnit}>
                          <input name="unitId" type="hidden" value={id} />
                          <input name="unitKitId" type="hidden" value={assignment.id} />
                          <button className="rounded-2xl border border-red-200 px-4 py-2 font-bold text-red-700" type="submit">Remove From Unit</button>
                        </form>
                      </div>
                    </div>
                  </summary>
                  {kit?.photo_url ? <img alt={kit.name} className="mt-4 max-h-52 rounded-2xl object-cover" src={kit.photo_url} /> : null}
                  <ul className="mt-4 grid gap-2">
                    {kitItems.map((kitItem: any) => {
                      const equipment = Array.isArray(kitItem.equipment_catalog) ? kitItem.equipment_catalog[0] : kitItem.equipment_catalog;
                      return (
                        <li key={kitItem.id} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm">
                          <span className="font-bold">{equipment?.name ?? "Unknown item"}</span>
                          <span className="text-slate-600"> | {kitItem.input_type} | Par {kitItem.par_level ?? "-"}</span>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              );
            }

            const compartment = item.compartment;
            return (
            <section key={compartment.id} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h2 className="text-2xl font-black">{compartment.name}</h2>
                  {compartment.photo_url ? <img alt={compartment.name} className="mt-3 max-h-52 rounded-2xl object-cover" src={compartment.photo_url} /> : null}
                </div>
                <form action={deleteUnitCompartment}>
                  <input name="unitId" type="hidden" value={id} />
                  <input name="id" type="hidden" value={compartment.id} />
                  <button className="rounded-2xl border border-red-200 px-4 py-2 font-bold text-red-700" type="submit">Remove</button>
                </form>
              </div>

              <form action={uploadCompartmentPhoto} className="mt-4 flex flex-col gap-3 rounded-2xl bg-slate-100 p-3 sm:flex-row">
                <input name="unitId" type="hidden" value={id} />
                <input name="compartmentId" type="hidden" value={compartment.id} />
                <input accept="image/png,image/jpeg,image/webp" className="flex-1 rounded-xl bg-white px-3 py-2" name="photo" type="file" />
                <button className="rounded-xl bg-red-700 px-4 py-2 font-bold text-white" type="submit">Upload Photo</button>
              </form>

              <ul className="mt-4 grid gap-2">
                {(compartment.unit_compartment_items ?? []).map((item: any) => (
                  <li key={item.id} className="flex flex-col justify-between gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm sm:flex-row sm:items-center">
                    <div>
                      <span className="font-bold">{Array.isArray(item.equipment_catalog) ? (item.equipment_catalog[0] as any)?.name : (item.equipment_catalog as any)?.name}</span>
                      <span className="text-slate-600"> | {item.input_type} | Par {item.par_level ?? "-"}</span>
                    </div>
                    <form action={deleteUnitItem}>
                      <input name="unitId" type="hidden" value={id} />
                      <input name="id" type="hidden" value={item.id} />
                      <button className="rounded-xl border border-red-200 bg-white px-3 py-2 font-bold text-red-700" type="submit">Delete Item</button>
                    </form>
                  </li>
                ))}
              </ul>

              <form action={addUnitItem} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                <input name="unitId" type="hidden" value={id} />
                <input name="compartmentId" type="hidden" value={compartment.id} />
                <select className="rounded-2xl border border-slate-300 px-4 py-3" name="equipmentId" required>
                  <option value="">Select equipment</option>
                  {(equipment ?? []).map((item) => <option key={item.id} value={item.id}>{item.name} ({item.input_type}{item.default_par_level === null ? "" : `, par ${item.default_par_level}`})</option>)}
                </select>
                <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" type="submit">Add Item From Defaults</button>
              </form>
            </section>
          );
          })}
        </div>
      </section>
    </main>
  );
}
