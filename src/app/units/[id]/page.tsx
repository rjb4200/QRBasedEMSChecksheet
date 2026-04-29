import Link from "next/link";
import { signOffUnit } from "./actions";
import { ShiftResetWarning } from "./shift-reset-warning";
import { getCurrentShift, getPreviousShift, getShiftLabel } from "@/lib/shifts";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";

const statusStyles = {
  grey: "border-slate-300 bg-slate-200 text-slate-800",
  yellow: "border-yellow-300 bg-yellow-100 text-yellow-900",
  green: "border-green-300 bg-green-100 text-green-900",
};

export default async function UnitDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const authClient = await createClient();
  const { data: auth } = await authClient.auth.getUser();
  const currentShift = getCurrentShift();
  const previousShift = getPreviousShift();
  const [{ data: unit }, { data: checks }, { data: previousArchive }, { data: signatures }] = await Promise.all([
    supabase.from("units").select("id, name, status, unit_compartments(id, name, sort_order)").eq("id", id).single(),
    supabase.from("compartment_checks").select("compartment_id, status").eq("unit_id", id).eq("shift_date", currentShift.shiftDate).eq("shift_period", currentShift.shiftPeriod),
    supabase.from("shift_archives").select("completed_compartments, total_compartments, completion_percentage").eq("unit_id", id).eq("shift_date", previousShift.shiftDate).eq("shift_period", previousShift.shiftPeriod).maybeSingle(),
    supabase.from("personnel_signatures").select("id, signed_at, users(full_name, email)").eq("unit_id", id).eq("shift_date", currentShift.shiftDate).eq("shift_period", currentShift.shiftPeriod).order("signed_at"),
  ]);
  const compartments = (unit?.unit_compartments ?? []).sort((a, b) => a.sort_order - b.sort_order);
  const checkMap = new Map((checks ?? []).map((check) => [check.compartment_id, check.status]));
  const completed = checks?.filter((check) => check.status === "completed").length ?? 0;
  const total = compartments.length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-6 text-slate-950">
      <section className="mx-auto max-w-5xl space-y-5">
        <div className="sticky top-0 z-10 -mx-5 border-b border-slate-200 bg-white/95 px-5 py-4 shadow-sm backdrop-blur">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">{getShiftLabel()}</p>
              <h1 className="text-3xl font-black">{unit?.name}</h1>
            </div>
            <Link className="rounded-2xl bg-red-700 px-5 py-3 text-center font-bold text-white" href="/scan">Scan</Link>
          </div>
        </div>

        {unit?.status !== "in_service" ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-5 font-bold text-red-800">This unit is out of service.</div>
        ) : null}

        <ShiftResetWarning />

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-600">Current progress</p>
              <p className="text-2xl font-black">{completed} of {total} compartments ({percentage}%)</p>
            </div>
            <div className="h-16 w-16 rounded-full bg-slate-950 p-2 text-center text-sm font-black text-white">
              <span className="flex h-full items-center justify-center">{percentage}%</span>
            </div>
          </div>
          <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-red-700" style={{ width: `${percentage}%` }} />
          </div>
        </div>

        {total > 0 && completed === total ? (
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-slate-600">Personnel Sign-off</p>
                <p className="mt-1 text-lg font-black">{signatures?.length ?? 0} crew signatures recorded</p>
              </div>
              {auth.user ? (
                <form action={signOffUnit}>
                  <input name="unitId" type="hidden" value={id} />
                  <button className="rounded-2xl bg-green-700 px-5 py-3 font-bold text-white" type="submit">Sign Off</button>
                </form>
              ) : <p className="text-sm font-semibold text-slate-600">Login is required only for personnel signatures.</p>}
            </div>
            <ul className="mt-4 grid gap-2">
              {(signatures ?? []).map((signature) => {
                const user = Array.isArray(signature.users) ? signature.users[0] : signature.users;
                return <li key={signature.id} className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold">{user?.full_name ?? user?.email} | {new Date(signature.signed_at).toLocaleString()}</li>;
              })}
            </ul>
          </div>
        ) : null}

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-600">Previous shift</p>
          <p className="mt-1 text-lg font-black">
            {previousArchive ? `${previousArchive.completed_compartments} of ${previousArchive.total_compartments} done (${previousArchive.completion_percentage}%)` : "No previous shift archive found"}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {compartments.map((compartment) => {
            const dbStatus = checkMap.get(compartment.id);
            const status = dbStatus === "completed" ? "green" : dbStatus === "in_progress" ? "yellow" : "grey";
            return (
              <div key={compartment.id} aria-label={`${compartment.name}: ${status}`} className={`rounded-3xl border-2 p-5 ${statusStyles[status]}`} role="status">
                <p className="text-xl font-black">{compartment.name}</p>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em]">{status === "grey" ? "Not Started" : status === "yellow" ? "In Progress" : "Completed"}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
