import { deleteEquipment, saveEquipment } from "./actions";
import { createAdminClient } from "@/lib/supabase/server-admin";

const inputTypes = ["quantity", "checkbox", "condition"] as const;

export default async function EquipmentPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const params = await searchParams;
  const supabase = await createAdminClient();
  let query = supabase.from("equipment_catalog").select("*").order("category").order("name");

  if (params.q) {
    query = query.ilike("name", `%${params.q}%`);
  }

  if (params.category) {
    query = query.eq("category", params.category);
  }

  const [{ data: equipment }, { data: categories }] = await Promise.all([
    query,
    supabase.from("equipment_catalog").select("category").order("category"),
  ]);

  const uniqueCategories = Array.from(new Set((categories ?? []).map((item) => item.category)));

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Admin</p>
          <h1 className="mt-2 text-4xl font-black">Equipment Catalog</h1>
          <p className="mt-2 text-slate-600">Reusable equipment definitions for unit compartments.</p>
        </div>

        <form className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_220px_auto]">
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={params.q} name="q" placeholder="Search equipment" />
          <select className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={params.category} name="category">
            <option value="">All categories</option>
            {uniqueCategories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Filter</button>
        </form>

        <form action={saveEquipment} className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_160px_140px_auto]">
          <input className="rounded-2xl border border-slate-300 px-4 py-3" name="name" placeholder="Item name" required />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" name="category" placeholder="Category" required />
          <select className="rounded-2xl border border-slate-300 px-4 py-3" name="inputType">
            {inputTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <input className="rounded-2xl border border-slate-300 px-4 py-3" min="0" name="defaultParLevel" placeholder="Par" step="1" type="number" />
          <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Add</button>
        </form>

        <div className="grid gap-3">
          {(equipment ?? []).map((item) => (
            <div key={item.id} className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_160px_140px_120px_auto]">
              <form action={saveEquipment} className="contents">
                <input name="id" type="hidden" value={item.id} />
                <input className="rounded-2xl border border-slate-300 px-4 py-3 font-semibold" name="name" defaultValue={item.name} />
                <input className="rounded-2xl border border-slate-300 px-4 py-3" name="category" defaultValue={item.category} />
                <select className="rounded-2xl border border-slate-300 px-4 py-3" name="inputType" defaultValue={item.input_type}>
                  {inputTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                <input className="rounded-2xl border border-slate-300 px-4 py-3" name="defaultParLevel" defaultValue={item.default_par_level ?? ""} min="0" step="1" type="number" />
                <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950" type="submit">Save</button>
              </form>
              <form action={deleteEquipment} className="lg:col-start-5">
                <input name="id" type="hidden" value={item.id} />
                <button className="w-full rounded-2xl border border-red-200 px-5 py-3 font-bold text-red-700" type="submit">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
