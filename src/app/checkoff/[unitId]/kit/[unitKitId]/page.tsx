import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoffForm } from "../../[compartmentId]/checkoff-form";
import { takeOverKitCheckoff } from "../../[compartmentId]/actions";
import { getCurrentShift } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { shouldShowMonthlyCheckReminder } from "@/lib/monthly-check";
import { MonthlyCheckReminderBanner } from "@/components/monthly-check-banner";

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

async function getRecentCompletedKitData(
  supabase: ReturnType<typeof createAdminClient>,
  unitId: string,
  unitKitId: string,
  currentShift: { shiftDate: string; shiftPeriod: "daily" },
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
    .eq("unit_kit_id", unitKitId)
    .eq("shift_date", crew.shift_date)
    .eq("shift_period", crew.shift_period)
    .maybeSingle();

  if (previousCheckError) throw new Error(previousCheckError.message);
  return (previousCheck?.item_data ?? {}) as Record<string, unknown>;
}

export default async function KitCheckoffPage({ params, searchParams }: { params: Promise<{ unitId: string; unitKitId: string }>; searchParams: Promise<{ mode?: string }> }) {
  const { unitId, unitKitId } = await params;
  const { mode } = await searchParams;
  const supabase = createAdminClient();
  const currentShift = getCurrentShift();
  const [{ data: unit }, { data: unitKit }, { data: check }] = await Promise.all([
    supabase.from("units").select("id, name, status, monthly_check_day").eq("id", unitId).is("deleted_at", null).single(),
    supabase.from("unit_kits").select("id, kit_id, kits(id, name, photo_url, kit_item_groups(id, name, sort_order, created_at), kit_items(id, group_id, sort_order, par_level, input_type, equipment_catalog(name)))").eq("id", unitKitId).eq("unit_id", unitId).single(),
    supabase.from("compartment_checks").select("*, users(full_name, email)").eq("unit_id", unitId).eq("unit_kit_id", unitKitId).eq("shift_date", currentShift.shiftDate).eq("shift_period", currentShift.shiftPeriod).maybeSingle(),
  ]);

  const kit = Array.isArray(unitKit?.kits) ? unitKit?.kits[0] : unitKit?.kits;
  if (!unit || !unitKit || !kit) redirect("/units");
  if (unit.status !== "in_service") {
    return <main className="min-h-screen bg-slate-100 p-5"><div className="rounded-3xl bg-red-50 p-5 font-bold text-red-800">{unit.name} is out of service.</div></main>;
  }

  const stale = isStale(check?.last_activity_at);
  const ownedByOther = check?.status === "in_progress" && Boolean(check.checked_by) && !stale;
  const readOnly = mode === "view";

  if (ownedByOther && !readOnly) {
    const owner = Array.isArray(check.users) ? check.users[0] : check.users;
    return (
      <main className="min-h-screen bg-slate-950 px-5 py-8 text-white">
        <section className="mx-auto max-w-md rounded-[2rem] border border-yellow-300/40 bg-yellow-100 p-6 text-yellow-950">
          <p className="text-sm font-bold uppercase tracking-[0.25em]">Locked</p>
          <h1 className="mt-3 text-3xl font-black">{kit.name}</h1>
          <p className="mt-3">In progress by {owner?.full_name ?? owner?.email ?? "another provider"}.</p>
          <div className="mt-6 grid gap-3">
            <Link className="rounded-2xl bg-slate-950 px-5 py-3 text-center font-bold text-white" href={`/checkoff/${unitId}/kit/${unitKitId}?mode=view`}>View Only</Link>
            <form action={takeOverKitCheckoff}>
              <input name="unitId" type="hidden" value={unitId} />
              <input name="unitKitId" type="hidden" value={unitKitId} />
              <button className="w-full rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Take Over</button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  const currentItemData = (check?.item_data ?? {}) as Record<string, unknown>;
  const hasCurrentItemData = Object.keys(currentItemData).length > 0;
  const previousItemData = await getRecentCompletedKitData(supabase, unitId, unitKitId, currentShift);
  const initialItemData = hasCurrentItemData ? currentItemData : previousItemData;
  const carriedForwardData = carriedForwardItemData(currentItemData, previousItemData, check?.status);

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-6 text-slate-950">
      <section className="mx-auto max-w-3xl space-y-5">
        {shouldShowMonthlyCheckReminder(unit?.monthly_check_day ?? null) ? <MonthlyCheckReminderBanner /> : null}
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">{unit.name} | Shared Kit</p>
          <h1 className="mt-2 text-3xl font-black">{kit.name}</h1>
          {readOnly ? <p className="mt-2 font-bold text-yellow-700">View Only</p> : null}
          {kit.photo_url ? <img alt={kit.name} className="mt-4 max-h-72 w-full rounded-3xl object-cover" src={kit.photo_url} /> : null}
        </div>
        <CheckoffForm
          compartmentId={unitKitId}
          carriedForwardData={carriedForwardData}
          initialData={initialItemData}
          items={kit.kit_items ?? []}
          groups={kit.kit_item_groups ?? []}
          previousData={previousItemData}
          readOnly={readOnly}
          targetType="kit"
          unitId={unitId}
        />
      </section>
    </main>
  );
}
