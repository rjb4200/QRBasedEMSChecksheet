import Link from "next/link";
import { deleteEquipment, saveEquipment } from "./actions";
import { EquipmentBackToTop, EquipmentPageSizeSelector } from "./equipment-catalog-controls";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { SaveButton } from "@/components/save-feedback";

const inputTypes = ["quantity", "checkbox", "condition"] as const;
const pageSizeOptions = [25, 50, 100] as const;
const defaultPageSize = 50;

type EquipmentSearchParams = {
  q?: string;
  category?: string;
  page?: string;
  pageSize?: string;
};

function parsePage(value?: string) {
  const parsed = Number(value ?? "1");
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function parsePageSize(value?: string) {
  if (value === "all") return "all" as const;
  const parsed = Number(value ?? defaultPageSize);
  return pageSizeOptions.includes(parsed as (typeof pageSizeOptions)[number]) ? parsed : defaultPageSize;
}

function buildPageHref(params: EquipmentSearchParams, page: number) {
  const nextParams = new URLSearchParams();
  if (params.q) nextParams.set("q", params.q);
  if (params.category) nextParams.set("category", params.category);
  if (params.pageSize) nextParams.set("pageSize", params.pageSize);
  if (page > 1) nextParams.set("page", String(page));
  const query = nextParams.toString();
  return query ? `/admin/equipment?${query}` : "/admin/equipment";
}

export default async function EquipmentPage({ searchParams }: { searchParams: Promise<EquipmentSearchParams> }) {
  const params = await searchParams;
  const supabase = await createAdminClient();
  const pageSize = parsePageSize(params.pageSize);
  const requestedPage = parsePage(params.page);
  const currentPageSizeParam = pageSize === "all" ? "all" : String(pageSize);

  let countQuery = supabase.from("equipment_catalog").select("id", { count: "exact", head: true });

  if (params.q) {
    countQuery = countQuery.ilike("name", `%${params.q}%`);
  }

  if (params.category) {
    countQuery = countQuery.eq("category", params.category);
  }

  const [{ count }, { data: categories }] = await Promise.all([
    countQuery,
    supabase.from("equipment_catalog").select("category").order("category"),
  ]);

  const totalCount = count ?? 0;
  const totalPages = pageSize === "all" ? 1 : Math.max(Math.ceil(totalCount / pageSize), 1);
  const currentPage = Math.min(requestedPage, totalPages);
  const from = pageSize === "all" ? 0 : (currentPage - 1) * pageSize;
  const to = pageSize === "all" ? undefined : from + pageSize - 1;

  let query = supabase.from("equipment_catalog").select("*").order("category").order("name");

  if (params.q) {
    query = query.ilike("name", `%${params.q}%`);
  }

  if (params.category) {
    query = query.eq("category", params.category);
  }

  if (to !== undefined) {
    query = query.range(from, to);
  }

  const { data: equipment } = await query;
  const visibleCount = equipment?.length ?? 0;
  const rangeStart = totalCount === 0 ? 0 : from + 1;
  const rangeEnd = pageSize === "all" ? totalCount : Math.min(from + visibleCount, totalCount);
  const hasPreviousPage = pageSize !== "all" && currentPage > 1;
  const hasNextPage = pageSize !== "all" && currentPage < totalPages;

  const uniqueCategories = Array.from(new Set((categories ?? []).map((item) => item.category)));

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section id="equipment-catalog-top" className="mx-auto max-w-6xl space-y-6">
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
          <input name="pageSize" type="hidden" value={currentPageSizeParam} />
          <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Filter</button>
          <Link className="rounded-2xl border border-slate-300 px-5 py-3 text-center font-bold text-slate-950 sm:col-span-3" href={`/admin/equipment?pageSize=${currentPageSizeParam}`}>Clear filters</Link>
        </form>

        <form action={saveEquipment} className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_160px_140px_auto]">
          <input className="rounded-2xl border border-slate-300 px-4 py-3" name="name" placeholder="Item name" required />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" name="category" placeholder="Category" required />
          <select className="rounded-2xl border border-slate-300 px-4 py-3" name="inputType">
            {inputTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <input className="rounded-2xl border border-slate-300 px-4 py-3" min="0" name="defaultParLevel" placeholder="Par" step="1" type="number" />
          <SaveButton className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white">Add</SaveButton>
        </form>

        <div className="flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-slate-700">Showing {rangeStart}-{rangeEnd} of {totalCount} equipment items</p>
          <div className="flex flex-wrap items-center gap-2">
            <EquipmentPageSizeSelector currentPageSize={currentPageSizeParam} />
            <div className="flex items-center gap-2" aria-label="Equipment catalog pagination">
              {hasPreviousPage ? <Link className="rounded-2xl border border-slate-300 px-4 py-2 font-bold" href={buildPageHref({ ...params, pageSize: currentPageSizeParam }, currentPage - 1)}>Previous</Link> : <span className="rounded-2xl border border-slate-200 px-4 py-2 font-bold text-slate-400">Previous</span>}
              <span className="px-2 text-sm font-bold text-slate-600">Page {currentPage} of {totalPages}</span>
              {hasNextPage ? <Link className="rounded-2xl border border-slate-300 px-4 py-2 font-bold" href={buildPageHref({ ...params, pageSize: currentPageSizeParam }, currentPage + 1)}>Next</Link> : <span className="rounded-2xl border border-slate-200 px-4 py-2 font-bold text-slate-400">Next</span>}
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          {visibleCount === 0 ? <div className="rounded-3xl bg-white p-6 text-slate-600 shadow-sm">No results match these filters.</div> : null}
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
                <SaveButton className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-950">Save</SaveButton>
              </form>
              <form action={deleteEquipment} className="lg:col-start-5">
                <input name="id" type="hidden" value={item.id} />
                <button className="w-full rounded-2xl border border-red-200 px-5 py-3 font-bold text-red-700" type="submit">Delete</button>
              </form>
            </div>
          ))}
        </div>
        <EquipmentBackToTop />
      </section>
    </main>
  );
}
