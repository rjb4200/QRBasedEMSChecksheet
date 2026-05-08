import Link from "next/link";
import { redirect } from "next/navigation";
import { takeOverCheckoff } from "./actions";
import { CheckoffForm } from "./checkoff-form";
import { getCurrentShift, type ShiftPeriod } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";

function isStale(lastActivityAt?: string | null) {
  if (!lastActivityAt) return false;
  return Date.now() - new Date(lastActivityAt).getTime() > 30 * 60 * 1000;
}

function dateDaysAgo(shiftDate: string, days: number) {
  const date = new Date(`${shiftDate}T12:00:00`);
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function carriedForwardItemData(
  current: Record<string, unknown>,
  previous: Record<string, unknown>,
  status?: string | null,
) {
  if (Object.keys(current).length === 0) return previous;
  if (status !== "in_progress") return {};

  return Object.fromEntries(
    Object.entries(current).filter(([key, value]) => JSON.stringify(value) === JSON.stringify(previous[key])),
  );
}

async function getRecentCompletedCompartmentData(
  supabase: ReturnType<typeof createAdminClient>,
  unitId: string,
  compartmentId: string,
  currentShift: { shiftDate: string; shiftPeriod: ShiftPeriod },
) {
  const { data: crew, error: crewError } = await supabase
    .from("daily_unit_crews")
    .select("shift_date, shift_period")
    .eq("unit_id", unitId)
    .eq("locked", true)
    .gte("shift_date", dateDaysAgo(currentShift.shiftDate, 7))
    .lte("shift_date", currentShift.shiftDate)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (crewError) throw new Error(crewError.message);
  if (!crew) return {};

  const { data: previousCheck, error: previousCheckError } = await supabase
    .from("compartment_checks")
    .select("item_data")
    .eq("unit_id", unitId)
    .eq("compartment_id", compartmentId)
    .eq("shift_date", crew.shift_date)
    .eq("shift_period", crew.shift_period)
    .maybeSingle();

  if (previousCheckError) throw new Error(previousCheckError.message);
  return (previousCheck?.item_data ?? {}) as Record<string, unknown>;
}

export default async function CheckoffPage({ params, searchParams }: { params: Promise<{ unitId: string; compartmentId: string }>; searchParams: Promise<{ mode?: string }> }) {
  const { unitId, compartmentId } = await params;
  const { mode } = await searchParams;
  const supabase = createAdminClient();

  const currentShift = getCurrentShift();
  const [{ data: unit }, { data: compartment }, { data: check }] = await Promise.all([
    supabase.from("units").select("id, name, status").eq("id", unitId).is("deleted_at", null).single(),
    supabase.from("unit_compartments").select("id, name, photo_url, unit_compartment_item_groups(id, name, sort_order, created_at), unit_compartment_items(id, group_id, sort_order, par_level, input_type, equipment_catalog(name))").eq("id", compartmentId).eq("unit_id", unitId).single(),
    supabase.from("compartment_checks").select("*, users(full_name, email)").eq("unit_id", unitId).eq("compartment_id", compartmentId).eq("shift_date", currentShift.shiftDate).eq("shift_period", currentShift.shiftPeriod).maybeSingle(),
  ]);

  if (!unit || !compartment) redirect("/units");
  if (unit.status !== "in_service") {
    return <main className="min-h-screen bg-slate-100 p-5"><div className="rounded-3xl bg-red-50 p-5 font-bold text-red-800">{unit.name} is out of service.</div></main>;
  }

  const stale = isStale(check?.last_activity_at);
  const ownedByOther = check?.status === "in_progress" && Boolean(check.checked_by) && !stale;
  const readOnly = mode === "view";
  const currentItemData = (check?.item_data ?? {}) as Record<string, unknown>;
  const hasCurrentItemData = Object.keys(currentItemData).length > 0;
  const recentCompletedData = await getRecentCompletedCompartmentData(supabase, unitId, compartmentId, currentShift);
  const initialItemData = hasCurrentItemData ? currentItemData : recentCompletedData;
  const carriedForwardData = carriedForwardItemData(currentItemData, recentCompletedData, check?.status);

  if (!ownedByOther && !readOnly && check?.status !== "completed") {
    const payload = {
      unit_id: unitId,
      compartment_id: compartmentId,
      unit_kit_id: null,
      shift_date: currentShift.shiftDate,
      shift_period: currentShift.shiftPeriod,
      status: "in_progress",
      checked_by: null,
      item_data: initialItemData,
      last_activity_at: new Date().toISOString(),
    };
    if (check?.id) {
      await supabase.from("compartment_checks").update(payload).eq("id", check.id);
    } else {
      await supabase.from("compartment_checks").insert(payload);
    }
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
          carriedForwardData={carriedForwardData}
          initialData={initialItemData}
          items={compartment.unit_compartment_items ?? []}
          groups={compartment.unit_compartment_item_groups ?? []}
          previousData={recentCompletedData}
          readOnly={readOnly}
          unitId={unitId}
        />
      </section>
    </main>
  );
}
