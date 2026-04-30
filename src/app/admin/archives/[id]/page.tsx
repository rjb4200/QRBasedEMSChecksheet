import { createClient } from "@/lib/supabase/server";

export default async function ArchiveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: archive } = await supabase.from("shift_archives").select("*, units(name)").eq("id", id).single();
  const unit = Array.isArray(archive?.units) ? archive?.units[0] : archive?.units;
  const checks = Array.isArray(archive?.check_data) ? archive.check_data : [];

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Archive</p>
          <h1 className="mt-2 text-4xl font-black">{unit?.name} | {archive?.shift_date} {archive?.shift_period}</h1>
          <p className="mt-2 font-semibold capitalize">{archive?.status?.replace("_", " ")} ({archive?.completed_compartments}/{archive?.total_compartments}, {archive?.completion_percentage}%)</p>
        </div>
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">Compartment Data</h2>
          <pre className="mt-4 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-white">{JSON.stringify(checks, null, 2)}</pre>
        </section>
      </section>
    </main>
  );
}
