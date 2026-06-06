import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { IconCancel, IconFilter, IconReset } from "@/components/icons";
import { formatLogSummary } from "@/lib/log-summary";
import { getDatabaseUsage } from "@/lib/database-usage";

export const dynamic = "force-dynamic";

type SearchParams = {
  area?: string;
  result?: string;
  q?: string;
  from?: string;
  to?: string;
  page?: string;
};

type SystemLogRow = {
  id: string;
  created_at: string;
  actor_type: string;
  actor_name: string | null;
  action: string;
  area: string;
  target_type: string | null;
  target_id: string | null;
  target_name: string | null;
  result: string;
  message: string | null;
  before_data: Record<string, unknown> | null;
  after_data: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
};

const PAGE_SIZE = 50;
const areas = ["checkoff", "equipment", "fleet", "kits", "reporting", "restocking"];
const results = ["success", "failure", "warning"];

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short", timeZone: "America/New_York" });
}

function prettyJson(value: Record<string, unknown> | null) {
  return value ? JSON.stringify(value, null, 2) : "None";
}

function resultClasses(result: string) {
  if (result === "failure") return "bg-red-100 text-red-800 ring-red-200";
  if (result === "warning") return "bg-yellow-100 text-yellow-900 ring-yellow-200";
  return "bg-green-100 text-green-800 ring-green-200";
}

function sanitizedSearch(value?: string) {
  return value?.trim().replace(/[%,()]/g, "").slice(0, 100) || "";
}

function buildPageHref(params: SearchParams, page: number) {
  const nextParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && key !== "page") nextParams.set(key, value);
  });
  nextParams.set("page", String(page));
  return `/admin/system-log?${nextParams.toString()}`;
}

export default async function SystemLogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = Math.max(Number(params.page ?? "1") || 1, 1);
  const offset = (page - 1) * PAGE_SIZE;
  const q = sanitizedSearch(params.q);
  const supabase = createAdminClient();

  const dbUsage = await getDatabaseUsage();

  let query = supabase
    .from("system_logs")
    .select("id, created_at, actor_type, actor_name, action, area, target_type, target_id, target_name, result, message, before_data, after_data, metadata", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (params.area) query = query.eq("area", params.area);
  if (params.result) query = query.eq("result", params.result);
  if (params.from) query = query.gte("created_at", `${params.from}T00:00:00.000Z`);
  if (params.to) query = query.lte("created_at", `${params.to}T23:59:59.999Z`);
  if (q) query = query.or(`actor_name.ilike.%${q}%,target_name.ilike.%${q}%,action.ilike.%${q}%,message.ilike.%${q}%`);

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as SystemLogRow[];
  const total = count ?? rows.length;
  const hasNext = offset + rows.length < total;

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-4xl font-black">System Log</h1>
          <p className="mt-2 max-w-3xl text-slate-600">Review administrative, crew, and scheduled system activity from the last 3 months.</p>
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm">
          <p className="font-semibold text-slate-700">
            Database usage:{' '}
            <span className={dbUsage.percentage >= 95 ? "text-red-700 font-black" : dbUsage.percentage >= 90 ? "text-orange-600 font-black" : dbUsage.percentage >= 80 ? "text-amber-600 font-black" : ""}>
              {dbUsage.percentage}% used
            </span>
            {' — '}{dbUsage.sizeMB} MB of {dbUsage.limitMB} MB
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Last checked: {new Date().toLocaleString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>

        <form className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm md:grid-cols-6">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700 md:col-span-6">Filter</p>
          <input className="rounded-2xl border border-slate-300 px-4 py-3 md:col-span-2" defaultValue={params.q ?? ""} name="q" placeholder="Search actor, target, action, message" />
          <select className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={params.area ?? ""} name="area">
            <option value="">All areas</option>
            {areas.map((area) => <option key={area} value={area}>{area}</option>)}
          </select>
          <select className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={params.result ?? ""} name="result">
            <option value="">All results</option>
            {results.map((result) => <option key={result} value={result}>{result}</option>)}
          </select>
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={params.from ?? ""} name="from" type="date" />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" defaultValue={params.to ?? ""} name="to" type="date" />
          <div className="flex gap-2 md:col-span-6">
            <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white inline-flex items-center gap-2" type="submit"><IconFilter /> Filter</button>
            <Link className="rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-950 inline-flex items-center gap-2" href="/admin/system-log"><IconReset /> Reset</Link>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm">
          <p className="font-semibold text-slate-700">Showing {rows.length} of {total} matching log rows</p>
          <div className="flex gap-2">
            {page > 1 ? <Link className="rounded-2xl border border-slate-300 px-4 py-2 font-bold" href={buildPageHref(params, page - 1)}>Previous</Link> : null}
            {hasNext ? <Link className="rounded-2xl border border-slate-300 px-4 py-2 font-bold" href={buildPageHref(params, page + 1)}>Next</Link> : null}
          </div>
        </div>

        <div className="space-y-3">
          {rows.length === 0 ? <div className="rounded-3xl bg-white p-6 text-slate-600 shadow-sm">No system log rows match these filters.</div> : null}
          {rows.map((row) => (
            <details key={row.id} className={`rounded-3xl bg-white p-5 shadow-sm ${row.result === "failure" ? "ring-2 ring-red-200" : ""}`}>
               <summary className="cursor-pointer list-none">
                 <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                   <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ring-1 ${resultClasses(row.result)}`}>{row.result}</span>
                   <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase text-slate-600">{row.area}</span>
                   <span className="text-sm font-semibold text-slate-500">{formatTimestamp(row.created_at)}</span>
                   <span className="text-sm font-black text-slate-800">{row.action}</span>
                   <span className="text-sm text-slate-600">— {formatLogSummary(row)}</span>
                 </div>
               </summary>
              <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5 lg:grid-cols-2">
                <div className="rounded-2xl bg-slate-100 p-4 lg:col-span-2">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Message</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm font-semibold text-slate-700">{row.message ?? "None"}</p>
                </div>
                <div className="rounded-2xl bg-slate-950 p-4 text-slate-100">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Before</p>
                  <pre className="mt-2 overflow-x-auto text-xs">{prettyJson(row.before_data)}</pre>
                </div>
                <div className="rounded-2xl bg-slate-950 p-4 text-slate-100">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">After</p>
                  <pre className="mt-2 overflow-x-auto text-xs">{prettyJson(row.after_data)}</pre>
                </div>
                <div className="rounded-2xl bg-slate-950 p-4 text-slate-100 lg:col-span-2">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Metadata</p>
                  <pre className="mt-2 overflow-x-auto text-xs">{prettyJson(row.metadata)}</pre>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
