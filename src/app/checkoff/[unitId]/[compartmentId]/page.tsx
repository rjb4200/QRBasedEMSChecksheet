import Link from "next/link";
import { redirect } from "next/navigation";
import { takeOverCheckoff } from "./actions";
import { CheckoffForm } from "./checkoff-form";
import { getCurrentShift, getPreviousShift } from "@/lib/shifts";
import { createClient } from "@/lib/supabase/server";

function isStale(lastActivityAt?: string | null) {
  if (!lastActivityAt) return false;
  return Date.now() - new Date(lastActivityAt).getTime() > 30 * 60 * 1000;
}

export default async function CheckoffPage({ params, searchParams }: { params: Promise<{ unitId: string; compartmentId: string }>; searchParams: Promise<{ mode?: string }> }) {
  const { unitId, compartmentId } = await params;
  const { mode } = await searchParams;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const currentShift = getCurrentShift();
  const previousShift = getPreviousShift();
  const [{ data: unit }, { data: compartment }, { data: check }, { data: previousArchive }] = await Promise.all([
    supabase.from("units").select("id, name, status").eq("id", unitId).single(),
    supabase.from("unit_compartments").select("id, name, photo_url, unit_compartment_items(id, par_level, input_type, equipment_catalog(name))").eq("id", compartmentId).eq("unit_id", unitId).single(),
    supabase.from("compartment_checks").select("*, users(full_name, email)").eq("unit_id", unitId).eq("compartment_id", compartmentId).eq("shift_date", currentShift.shiftDate).eq("shift_period", currentShift.shiftPeriod).maybeSingle(),
    supabase.from("shift_archives").select("check_data").eq("unit_id", unitId).eq("shift_date", previousShift.shiftDate).eq("shift_period", previousShift.shiftPeriod).maybeSingle(),
  ]);

  if (!unit || !compartment) redirect("/units");
  if (unit.status !== "in_service") {
    return <main className="min-h-screen bg-slate-100 p-5"><div className="rounded-3xl bg-red-50 p-5 font-bold text-red-800">{unit.name} is out of service.</div></main>;
  }

  const stale = isStale(check?.last_activity_at);
  const ownedByOther = check?.status === "in_progress" && check.checked_by !== auth.user.id && !stale;
  const readOnly = mode === "view";

  if (!ownedByOther && !readOnly && check?.status !== "completed") {
    await supabase.from("compartment_checks").upsert({
      unit_id: unitId,
      compartment_id: compartmentId,
      shift_date: currentShift.shiftDate,
      shift_period: currentShift.shiftPeriod,
      status: "in_progress",
      checked_by: auth.user.id,
      item_data: check?.item_data ?? {},
      last_activity_at: new Date().toISOString(),
    }, { onConflict: "unit_id,compartment_id,shift_date,shift_period" });
  }

  if (ownedByOther && !readOnly) {
    const owner = Array.isArray(check.users) ? check.users[0] : check.users;
    return (
      <main className="min-h-screen bg-slate-950 px-5 py-8 text-white">
        <section className="mx-auto max-w-md rounded-[2rem] border border-yellow-300/40 bg-yellow-100 p-6 text-yellow-950">
          <p className="text-sm font-bold uppercase tracking-[0.25em]">Locked</p>
          <h1 className="mt-3 text-3xl font-black">{compartment.name}</h1>
          <p className="mt-3">In progress by {owner?.full_name ?? owner?.email ?? "another provider"}.</p>
          <div className="mt-6 grid gap-3">
            <Link className="rounded-2xl bg-slate-950 px-5 py-3 text-center font-bold text-white" href={`/checkoff/${unitId}/${compartmentId}?mode=view`}>View Only</Link>
            <form action={takeOverCheckoff}>
              <input name="unitId" type="hidden" value={unitId} />
              <input name="compartmentId" type="hidden" value={compartmentId} />
              <button className="w-full rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Take Over</button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  const previousCheck = Array.isArray(previousArchive?.check_data)
    ? previousArchive.check_data.find((item) => item.compartment_id === compartmentId)
    : null;

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-6 text-slate-950">
      <section className="mx-auto max-w-3xl space-y-5">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">{unit.name}</p>
          <h1 className="mt-2 text-3xl font-black">{compartment.name}</h1>
          {readOnly ? <p className="mt-2 font-bold text-yellow-700">View Only</p> : null}
          {compartment.photo_url ? <img alt={compartment.name} className="mt-4 max-h-72 w-full rounded-3xl object-cover" src={compartment.photo_url} /> : null}
        </div>
        <CheckoffForm
          compartmentId={compartmentId}
          initialData={(check?.item_data ?? {}) as Record<string, unknown>}
          items={compartment.unit_compartment_items ?? []}
          previousData={(previousCheck?.item_data ?? {}) as Record<string, unknown>}
          readOnly={readOnly}
          unitId={unitId}
        />
      </section>
    </main>
  );
}
