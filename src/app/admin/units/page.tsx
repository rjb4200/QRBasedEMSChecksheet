import Link from "next/link";
import { createUnit, deleteUnit, toggleUnitStatus } from "./actions";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { IconEdit, IconQr } from "@/components/icons";
import { DestructiveActionsToggle } from "./destructive-toggle";
import { DeleteUnitButton } from "./delete-unit-button";

export const dynamic = "force-dynamic";

export default async function AdminUnitsPage() {
  const supabase = createAdminClient();
  const { data: units } = await supabase.from("units").select("id, name, unit_kind, status, oos_at, oos_by_name, unit_compartments(id), unit_kits(id)").is("deleted_at", null).order("name");

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Admin</p>
          <h1 className="mt-2 text-4xl font-black">Units</h1>
          <p className="mt-2 text-slate-600">Build each unit independently from scratch or by copying an existing unit.</p>
        </div>

        <DestructiveActionsToggle>
          <div className="grid gap-3">
            {(units ?? []).map((unit) => {
              const isOos = unit.status === "out_of_service";
              return (
              <div key={unit.id} className={`flex flex-col justify-between gap-4 rounded-3xl p-5 shadow-sm sm:flex-row sm:items-center ${isOos ? "border border-slate-200 bg-slate-50" : "bg-white"}`}>
                <div>
                  <h2 className={`text-xl font-black ${isOos ? "text-slate-500" : ""}`}>{unit.name}</h2>
                  <p className={`text-sm ${isOos ? "text-slate-400" : "text-slate-600"}`}>{unit.unit_kind} | {(unit.unit_compartments?.length ?? 0) + (unit.unit_kits?.length ?? 0)} checks | {unit.status.replace("_", " ")}</p>
                  {isOos && (unit.oos_at || unit.oos_by_name) ? (
                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      Marked {unit.oos_at ? new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "numeric", day: "numeric", year: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(unit.oos_at)) : ""}
                      {unit.oos_by_name ? ` by ${unit.oos_by_name}` : ""}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <form action={toggleUnitStatus}>
                    <input name="id" type="hidden" value={unit.id} />
                    <input name="status" type="hidden" value={unit.status === "in_service" ? "out_of_service" : "in_service"} />
                    <button className={`rounded-2xl px-5 py-3 font-bold ${isOos ? "border border-slate-300" : "bg-red-700 text-white"}`} type="submit">{unit.status === "in_service" ? "Set OOS" : "Set In-Service"}</button>
                  </form>
                  <Link aria-label={`QR Codes for ${unit.name}`} className="rounded-2xl border border-slate-300 p-3 text-slate-600 hover:text-slate-900" href={`/admin/units/${unit.id}/qr`} title={`QR Codes for ${unit.name}`}>
                    <IconQr />
                  </Link>
                  <Link aria-label={`Edit ${unit.name}`} className="rounded-2xl border border-slate-300 p-3 text-slate-600 hover:text-slate-900" href={`/admin/units/${unit.id}`} title={`Edit ${unit.name}`}>
                    <IconEdit />
                  </Link>
                  <form action={deleteUnit}>
                    <input name="id" type="hidden" value={unit.id} />
                    <DeleteUnitButton />
                  </form>
                </div>
              </div>
              );
            })}
          </div>
        </DestructiveActionsToggle>

        <form action={createUnit} className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm md:grid-cols-[1fr_120px_240px_auto]">
          <input className="rounded-2xl border border-slate-300 px-4 py-3" name="name" placeholder="Unit name (EC1, Medic 1)" required />
          <input className="rounded-2xl border border-slate-300 px-4 py-3" name="unitKind" placeholder="Type" defaultValue="EC" />
          <select className="rounded-2xl border border-slate-300 px-4 py-3" name="sourceUnitId">
            <option value="">From scratch</option>
            {(units ?? []).map((unit) => <option key={unit.id} value={unit.id}>Copy {unit.name}</option>)}
          </select>
          <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white" type="submit">Create</button>
        </form>
      </section>
    </main>
  );
}
