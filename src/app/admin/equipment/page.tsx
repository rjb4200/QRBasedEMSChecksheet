import Link from "next/link";
import { saveEquipment } from "./actions";
import { EquipmentBackToTop, EquipmentPageSizeSelector } from "./equipment-catalog-controls";
import { EditableCatalogRow } from "./editable-catalog-row";
import { DestructiveActionsToggle } from "./destructive-toggle";
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

  const [{ count }, { data: categories }, { data: compUsage }, { data: kitUsage }] = await Promise.all([
    countQuery,
    supabase.from("equipment_catalog").select("category").order("category"),
    supabase.from("unit_compartment_items").select("equipment_id, unit_compartments(name, units(name))"),
    supabase.from("kit_items").select("equipment_id, kits(name, unit_kits(units(name)))"),
  ]);

  const usageBadgesMap = new Map<string, { unitName: string; targetName: string }[]>();
  for (const row of (compUsage ?? []) as any[]) {
    const comp = Array.isArray(row.unit_compartments) ? row.unit_compartments[0] : row.unit_compartments;
    const unit = comp?.units ? (Array.isArray(comp.units) ? comp.units[0] : comp.units) : null;
    const badge = { unitName: unit?.name ?? "Unknown", targetName: comp?.name ?? "Unknown" };
    const existing = usageBadgesMap.get(row.equipment_id) ?? [];
    usageBadgesMap.set(row.equipment_id, [...existing, badge]);
  }
  for (const row of (kitUsage ?? []) as any[]) {
    const kit = Array.isArray(row.kits) ? row.kits[0] : row.kits;
    const unitKits = kit?.unit_kits ? (Array.isArray(kit.unit_kits) ? kit.unit_kits : [kit.unit_kits]) : [];
    for (const uk of unitKits) {
      const unit = Array.isArray(uk.units) ? uk.units[0] : uk.units;
      const badge = { unitName: unit?.name ?? "Unknown", targetName: `${kit?.name ?? "Unknown"} (Kit)` };
      const existing = usageBadgesMap.get(row.equipment_id) ?? [];
      const dup = existing.some((e) => e.unitName === badge.unitName && e.targetName === badge.targetName);
      if (!dup) usageBadgesMap.set(row.equipment_id, [...existing, badge]);
    }
  }

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

  const catalogItems = (equipment ?? []).map((item) => ({ ...item, usageBadges: usageBadgesMap.get(item.id) ?? [] }));

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section id="equipment-catalog-top" className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-4xl font-black">Equipment Catalog</h1>
          <p className="mt-2 text-slate-600">Reusable equipment definitions for unit compartments.</p>
        </div>

        <form className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_220px_auto_auto]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700 sm:col-span-4">Filter</p>
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={params.q} name="q" placeholder="Search equipment" />
          <select className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={params.category} name="category">
            <option value="">All categories</option>
            {uniqueCategories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <input name="pageSize" type="hidden" value={currentPageSizeParam} />
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" title="Filter equipment catalog" aria-label="Filter equipment catalog" type="submit">
            <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeLinecap="round" />
            </svg>
            Filter
          </button>
          <Link className="rounded-2xl border border-slate-300 px-5 py-3 text-center font-bold text-slate-950" href={`/admin/equipment?pageSize=${currentPageSizeParam}`}>Reset</Link>
        </form>

        <form action={saveEquipment} className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_160px_140px_auto]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700 md:col-span-5">Add</p>
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

        <DestructiveActionsToggle>
        <div className="grid gap-3">
          {visibleCount === 0 ? <div className="rounded-3xl bg-white p-6 text-slate-600 shadow-sm">No results match these filters.</div> : null}
          {catalogItems.map((item) => (
            <EditableCatalogRow key={item.id} item={item} />
          ))}
        </div>
        </DestructiveActionsToggle>
        <EquipmentBackToTop />
      </section>
    </main>
  );
}
