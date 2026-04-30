import Link from "next/link";

type FleetUnit = {
  id: string;
  name: string;
  unit_kind: string;
  status: string;
  total: number;
  completed: number;
  inProgress: number;
  percentage: number;
};

export function FleetMatrix({ units, admin = false }: { units: FleetUnit[]; admin?: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {units.map((unit) => (
        <article key={unit.id} className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-700">{unit.unit_kind}</p>
              <h2 className="mt-2 text-3xl font-black">{unit.name}</h2>
              <p className="mt-1 capitalize text-slate-600">{unit.status.replace("_", " ")}</p>
            </div>
            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-xl font-black text-white">{unit.percentage}%</div>
          </div>
          <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-red-700" style={{ width: `${unit.percentage}%` }} />
          </div>
          <p className="mt-3 font-bold">{unit.completed} of {unit.total} checks completed</p>
          <p className="text-sm text-slate-600">{unit.inProgress} in progress</p>
          {admin ? <Link className="mt-4 inline-flex rounded-2xl border border-slate-300 px-4 py-2 font-bold" href={`/admin/units/${unit.id}`}>Manage Unit</Link> : null}
        </article>
      ))}
    </div>
  );
}
