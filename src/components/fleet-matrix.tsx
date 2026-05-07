import Link from "next/link";
import type { ReactNode } from "react";

type FleetUnit = {
  id: string;
  name: string;
  unit_kind: string;
  status: string;
  total: number;
  completed: number;
  inProgress: number;
  percentage: number;
  completedAt?: string | null;
  exceptionCount: number;
  hasComments: boolean;
  crewComplete: boolean;
  archived?: boolean;
  statusNote?: string | null;
};

function formatCompletionTime(value: string | null | undefined) {
  if (!value) return "Complete";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function StatusBadge({ children, className, ariaLabel }: { children: ReactNode; className: string; ariaLabel?: string }) {
  return (
    <span aria-label={ariaLabel} className={`rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {children}
    </span>
  );
}

function getPrimaryBadge(unit: FleetUnit) {
  if (unit.status === "out_of_service") {
    return { label: unit.archived ? "Archived" : "Out of Service", className: "bg-slate-200 text-slate-700", ariaLabel: `${unit.name} is ${unit.archived ? "archived" : "out of service"}` };
  }

  if (unit.total > 0 && unit.completed >= unit.total) {
    const label = formatCompletionTime(unit.completedAt);
    return { label, className: "bg-green-600 text-white", ariaLabel: unit.completedAt ? `${unit.name} complete at ${label}` : `${unit.name} complete` };
  }

  if (unit.inProgress > 0 || unit.completed > 0) {
    return { label: "In Progress", className: "bg-amber-300 text-slate-950", ariaLabel: `${unit.name} is in progress` };
  }

  return { label: "Not Started", className: "bg-red-700 text-white", ariaLabel: `${unit.name} is not started` };
}

export function FleetMatrix({ units }: { units: FleetUnit[]; admin?: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {units.map((unit) => {
        const primaryBadge = getPrimaryBadge(unit);
        const progressColor = unit.status === "out_of_service"
          ? "bg-slate-400"
          : unit.total > 0 && unit.completed >= unit.total
            ? "bg-green-600"
            : unit.inProgress > 0 || unit.completed > 0
              ? "bg-amber-400"
              : "bg-red-700";

        return (
          <article key={unit.id} className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-700">{unit.unit_kind}</p>
                <h2 className="mt-2 text-3xl font-black">{unit.name}</h2>
                <p className="mt-1 capitalize text-slate-600">{unit.status.replace("_", " ")}</p>
              </div>
              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-xl font-black text-white">{unit.percentage}%</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2" aria-label={`Operational status badges for ${unit.name}`}>
              <StatusBadge ariaLabel={primaryBadge.ariaLabel} className={primaryBadge.className}>{primaryBadge.label}</StatusBadge>
              {unit.statusNote ? <StatusBadge ariaLabel={`${unit.name} status note: ${unit.statusNote}`} className="bg-slate-100 text-slate-700">{unit.statusNote}</StatusBadge> : null}
              {unit.exceptionCount > 0 ? <StatusBadge ariaLabel={`${unit.name} has ${unit.exceptionCount} exceptions`} className="bg-red-100 text-red-800">Exceptions: {unit.exceptionCount}</StatusBadge> : null}
              {unit.hasComments ? <StatusBadge ariaLabel={`${unit.name} has comments`} className="bg-slate-200 text-slate-700">Comments</StatusBadge> : null}
              {unit.status === "in_service" && !unit.crewComplete ? <StatusBadge ariaLabel={`${unit.name} crew information is missing`} className="bg-amber-100 text-amber-900">Crew Missing</StatusBadge> : null}
            </div>
            <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-200">
              <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${unit.percentage}%` }} />
            </div>
            <p className="mt-3 font-bold">{unit.completed} of {unit.total} checks completed</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/units/${unit.id}`}
                prefetch={true}
                className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-slate-300 px-4 py-2 font-bold text-slate-600"
              >
                View Checkoff
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
