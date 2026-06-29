import Link from "next/link";
import { addKitItem, createKitGroup, deleteKit, deleteKitGroup, deleteKitItem, updateKit, updateKitGroup, updateKitItem, uploadKitPhoto } from "../actions";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { IconSave } from "@/components/icons";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { SubmitButton } from "@/components/submit-button";
import { groupItems } from "@/lib/item-groups";

function equipmentName(item: any) {
  const equipment = Array.isArray(item.equipment_catalog) ? item.equipment_catalog[0] : item.equipment_catalog;
  return equipment?.name ?? "Unknown item";
}

export default async function AdminKitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const [{ data: kit }, { data: equipment }] = await Promise.all([
    supabase
      .from("kits")
      .select("id, name, description, sort_order, photo_url, active, kit_item_groups(id, name, sort_order, created_at), kit_items(id, equipment_id, group_id, sort_order, par_level, input_type, equipment_catalog(name)), unit_kits(id, units(name))")
      .eq("id", id)
      .single(),
    supabase.from("equipment_catalog").select("id, name, default_par_level, input_type").order("name"),
  ]);

  const assignments = kit?.unit_kits ?? [];
  const groups = [...(kit?.kit_item_groups ?? [])].sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const sections = groupItems(kit?.kit_items ?? [], groups);

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Kit Builder</p>
            <h1 className="mt-2 text-4xl font-black">{kit?.name}</h1>
            <p className="mt-2 text-slate-600">Shared kit definition. Unit assignments are read-only from unit pages.</p>
          </div>
          <Link className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold" href="/admin/kits">Back to Kits</Link>
        </div>

        {kit ? (
          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <form action={updateKit} className="grid gap-3 rounded-3xl bg-white p-5 shadow-sm">
                <input name="id" type="hidden" value={kit.id} />
                <label className="grid gap-1 font-bold">Name<input className="rounded-2xl border border-slate-300 px-4 py-3 font-normal" defaultValue={kit.name} name="name" required /></label>
                <label className="grid gap-1 font-bold">Description<textarea className="rounded-2xl border border-slate-300 px-4 py-3 font-normal" defaultValue={kit.description ?? ""} name="description" rows={3} /></label>
                <label className="grid gap-1 font-bold">Sort order<input className="rounded-2xl border border-slate-300 px-4 py-3 font-normal" defaultValue={kit.sort_order ?? 0} name="sortOrder" type="number" /></label>
                <label className="flex items-center gap-2 font-bold"><input defaultChecked={kit.active} name="active" type="checkbox" /> Available for unit assignment</label>
                <SubmitButton className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white inline-flex items-center gap-2" title="Save kit"><IconSave /> Save Kit</SubmitButton>
              </form>

              <form action={uploadKitPhoto} className="grid gap-3 rounded-3xl bg-white p-5 shadow-sm">
                <input name="kitId" type="hidden" value={kit.id} />
                <h2 className="text-2xl font-black">Photo</h2>
                {kit.photo_url ? <img alt={kit.name} className="max-h-72 rounded-3xl object-cover" src={kit.photo_url} /> : <p className="text-sm text-slate-600">No photo uploaded.</p>}
                <input accept="image/png,image/jpeg,image/webp" className="rounded-2xl border border-slate-300 px-4 py-3" name="photo" type="file" />
                <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold" type="submit">Upload Photo</button>
              </form>
            </div>

            <aside className="space-y-4">
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <h2 className="text-2xl font-black">Assigned Units</h2>
                {assignments.length === 0 ? <p className="mt-2 text-slate-600">Not assigned.</p> : null}
                <ul className="mt-3 grid gap-2">
                  {assignments.map((assignment: any) => {
                    const unit = Array.isArray(assignment.units) ? assignment.units[0] : assignment.units;
                    return <li key={assignment.id} className="rounded-2xl bg-slate-100 px-4 py-3 font-bold">{unit?.name ?? "Unknown unit"}</li>;
                  })}
                </ul>
              </div>
              <form action={deleteKit} className="rounded-3xl bg-white p-5 shadow-sm">
                <input name="id" type="hidden" value={kit.id} />
                <button className="w-full rounded-2xl border border-red-200 px-5 py-3 font-bold text-red-700 disabled:opacity-50" disabled={assignments.length > 0} type="submit">Delete Kit</button>
                {assignments.length > 0 ? <p className="mt-2 text-sm font-bold text-red-700">Remove this kit from units before deleting.</p> : null}
              </form>
            </aside>
          </div>
        ) : null}

        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">Equipment</h2>
          <div className="mt-4 rounded-2xl bg-slate-100 p-3">
            <h3 className="font-black">Item Groups</h3>
            <div className="mt-3 grid gap-2">
              {groups.map((group: any) => (
                <div key={group.id} className="grid gap-2 rounded-xl bg-white p-2 md:grid-cols-[1fr_100px_auto_auto]">
                  <form action={updateKitGroup} className="contents">
                    <input name="kitId" type="hidden" value={id} />
                    <input name="groupId" type="hidden" value={group.id} />
                    <input className="rounded-xl border border-slate-300 px-3 py-2" defaultValue={group.name} name="name" />
                    <input className="rounded-xl border border-slate-300 px-3 py-2" defaultValue={group.sort_order ?? 0} name="sortOrder" type="number" />
                    <SubmitButton className="rounded-xl bg-red-700 p-2 text-white" title="Save group"><IconSave /></SubmitButton>
                  </form>
                  <DeleteConfirmButton
                    formAction={deleteKitGroup}
                    hiddenInputs={[{ name: "kitId", value: id }, { name: "groupId", value: group.id }]}
                  />
                </div>
              ))}
            </div>
            <form action={createKitGroup} className="mt-3 grid gap-2 sm:grid-cols-[1fr_100px_auto]">
              <input name="kitId" type="hidden" value={id} />
              <input className="rounded-xl border border-slate-300 px-3 py-2" name="name" placeholder="New group name" required />
              <input className="rounded-xl border border-slate-300 px-3 py-2" name="sortOrder" placeholder="Order" type="number" />
              <button className="rounded-xl bg-red-700 px-3 py-2 font-bold text-white" type="submit">Add Group</button>
            </form>
          </div>

          <form action={addKitItem} className="mt-4 grid gap-3 sm:grid-cols-[1fr_180px_auto]">
            <input name="kitId" type="hidden" value={id} />
            <select className="rounded-2xl border border-slate-300 px-4 py-3" name="equipmentId" required>
              <option value="">Select equipment</option>
              {(equipment ?? []).map((item: any) => <option key={item.id} value={item.id}>{item.name} ({item.input_type}{item.default_par_level === null ? "" : `, par ${item.default_par_level}`})</option>)}
            </select>
            <select className="rounded-2xl border border-slate-300 px-4 py-3" name="groupId">
              <option value="">Ungrouped</option>
              {groups.map((group: any) => <option key={group.id} value={group.id}>{group.name}</option>)}
            </select>
            <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold" type="submit">Add Equipment</button>
          </form>
          <div className="mt-4 grid gap-3">
            {sections.map((section) => (
              <details key={section.group?.id ?? "ungrouped"} className="rounded-2xl bg-slate-50 p-3" open>
                <summary className="cursor-pointer font-black">{section.group?.name ?? "Ungrouped"}</summary>
                <ul className="mt-3 grid gap-2">
            {section.items.map((item: any) => (
              <li key={item.id} className="grid gap-2 rounded-2xl bg-slate-100 px-4 py-3 md:grid-cols-[1fr_100px_120px_180px_auto_auto] md:items-center">
                <div>
                  <span className="font-bold">{equipmentName(item)}</span>
                  <span className="text-slate-600"> | {item.input_type}</span>
                </div>
                <form action={updateKitItem} className="contents">
                  <input name="kitId" type="hidden" value={id} />
                  <input name="itemId" type="hidden" value={item.id} />
                  <input className="rounded-xl bg-white px-3 py-2" defaultValue={item.par_level ?? ""} name="parLevel" placeholder="Par" type="number" />
                  <input className="rounded-xl bg-white px-3 py-2" defaultValue={item.sort_order ?? 0} name="sortOrder" placeholder="Order" type="number" />
                  <select className="rounded-xl bg-white px-3 py-2" defaultValue={item.group_id ?? ""} name="groupId">
                    <option value="">Ungrouped</option>
                    {groups.map((group: any) => <option key={group.id} value={group.id}>{group.name}</option>)}
                  </select>
                  <SubmitButton className="rounded-xl bg-red-700 p-2 text-white" title="Save item"><IconSave /></SubmitButton>
                </form>
                <DeleteConfirmButton
                  formAction={deleteKitItem}
                  hiddenInputs={[{ name: "kitId", value: id }, { name: "itemId", value: item.id }]}
                />
              </li>
            ))}
                </ul>
              </details>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
