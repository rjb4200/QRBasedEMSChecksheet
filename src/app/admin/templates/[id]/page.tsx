import { addTemplateCompartment, addTemplateItem, deleteTemplateCompartment } from "../actions";
import { createClient } from "@/lib/supabase/server";

const inputTypes = ["quantity", "checkbox", "condition"] as const;

export default async function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: template }, { data: equipment }] = await Promise.all([
    supabase.from("templates").select("id, name, description, template_compartments(id, name, sort_order, template_compartment_items(id, par_level, input_type, equipment_catalog(name)))").eq("id", id).single(),
    supabase.from("equipment_catalog").select("id, name, default_par_level, input_type").order("name"),
  ]);

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Template Builder</p>
          <h1 className="mt-2 text-4xl font-black">{template?.name}</h1>
          <p className="mt-2 text-slate-600">{template?.description}</p>
        </div>

        <form action={addTemplateCompartment} className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_130px_auto]">
          <input name="templateId" type="hidden" value={id} />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" name="name" placeholder="Compartment name" required />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" name="sortOrder" placeholder="Order" type="number" />
          <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Add Compartment</button>
        </form>

        <div className="grid gap-4">
          {(template?.template_compartments ?? []).sort((a, b) => a.sort_order - b.sort_order).map((compartment) => (
            <section key={compartment.id} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black">{compartment.name}</h2>
                <form action={deleteTemplateCompartment}>
                  <input name="templateId" type="hidden" value={id} />
                  <input name="id" type="hidden" value={compartment.id} />
                  <button className="rounded-2xl border border-red-200 px-4 py-2 font-bold text-red-700" type="submit">Remove</button>
                </form>
              </div>

              <ul className="mt-4 grid gap-2">
                {(compartment.template_compartment_items ?? []).map((item) => (
                  <li key={item.id} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm">
                    <span className="font-bold">{Array.isArray(item.equipment_catalog) ? (item.equipment_catalog[0] as any)?.name : (item.equipment_catalog as any)?.name}</span>
                    <span className="text-slate-600"> | {item.input_type} | Par {item.par_level ?? "-"}</span>
                  </li>
                ))}
              </ul>

              <form action={addTemplateItem} className="mt-4 grid gap-3 sm:grid-cols-[1fr_160px_120px_auto]">
                <input name="templateId" type="hidden" value={id} />
                <input name="compartmentId" type="hidden" value={compartment.id} />
                <select className="rounded-2xl border border-slate-300 px-4 py-3" name="equipmentId" required>
                  <option value="">Select equipment</option>
                  {(equipment ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
                <select className="rounded-2xl border border-slate-300 px-4 py-3" name="inputType">
                  {inputTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                <input className="rounded-2xl border border-slate-300 px-4 py-3" name="parLevel" placeholder="Par" type="number" />
                <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" type="submit">Add Item</button>
              </form>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
