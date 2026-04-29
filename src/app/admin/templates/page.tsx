import Link from "next/link";
import { createTemplate, createTemplateFromUnit, deleteTemplate } from "./actions";
import { createClient } from "@/lib/supabase/server";

export default async function TemplatesPage() {
  const supabase = await createClient();
  const [{ data: templates }, { data: units }] = await Promise.all([
    supabase.from("templates").select("id, name, description, template_compartments(id, template_compartment_items(id))").order("name"),
    supabase.from("units").select("id, name").order("name"),
  ]);

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Admin</p>
          <h1 className="mt-2 text-4xl font-black">Templates</h1>
          <p className="mt-2 text-slate-600">Reusable starting layouts. Units copied from templates remain independent.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <form action={createTemplate} className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Create from scratch</h2>
            <input className="mt-4 w-full rounded-2xl border border-slate-300 px-4 py-3" name="name" placeholder="Template name" required />
            <textarea className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3" name="description" placeholder="Description" />
            <button className="mt-3 rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Create</button>
          </form>

          <form action={createTemplateFromUnit} className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Create from existing unit</h2>
            <input className="mt-4 w-full rounded-2xl border border-slate-300 px-4 py-3" name="name" placeholder="New template name" required />
            <select className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3" name="unitId" required>
              <option value="">Select unit</option>
              {(units ?? []).map((unit) => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
            </select>
            <textarea className="mt-3 w-full rounded-2xl border border-slate-300 px-4 py-3" name="description" placeholder="Description" />
            <button className="mt-3 rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white" type="submit">Copy Unit</button>
          </form>
        </div>

        <div className="grid gap-3">
          {(templates ?? []).map((template) => {
            const compartmentCount = template.template_compartments?.length ?? 0;
            const itemCount = template.template_compartments?.reduce((sum, comp) => sum + (comp.template_compartment_items?.length ?? 0), 0) ?? 0;
            return (
              <div key={template.id} className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-black">{template.name}</h2>
                  <p className="text-sm text-slate-600">{template.description}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">{compartmentCount} compartments | {itemCount} items</p>
                </div>
                <div className="flex gap-2">
                  <Link className="rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white" href={`/admin/templates/${template.id}`}>Edit</Link>
                  <form action={deleteTemplate}>
                    <input name="id" type="hidden" value={template.id} />
                    <button className="rounded-2xl border border-red-200 px-5 py-3 font-bold text-red-700" type="submit">Delete</button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
