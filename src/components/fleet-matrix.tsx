"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type FleetUnit = {
  id: string;
  name: string;
  unit_kind: string;
  status: string;
  oosAt?: string | null;
  oosByName?: string | null;
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

function formatOosTimestamp(value: string | null | undefined) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "numeric",
    day: "numeric",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function StatusBadge({ children, className, ariaLabel }: { children: ReactNode; className: string; ariaLabel?: string }) {
  return (
    <span aria-label={ariaLabel} className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${className}`}>
      {children}
    </span>
  );
}

function getPrimaryBadge(unit: FleetUnit) {
  if (unit.status === "out_of_service") {
    return { label: unit.archived ? "Archived" : "Out of Service", className: "bg-slate-100 text-slate-700 border-slate-300", ariaLabel: `${unit.name} is ${unit.archived ? "archived" : "out of service"}` };
  }

  if (unit.total > 0 && unit.completed >= unit.total) {
    const label = formatCompletionTime(unit.completedAt);
    return { label, className: "bg-green-100 text-green-800 border-green-200", ariaLabel: unit.completedAt ? `${unit.name} complete at ${label}` : `${unit.name} complete` };
  }

  if (unit.inProgress > 0 || unit.completed > 0) {
    return { label: "In Progress", className: "bg-amber-100 text-amber-800 border-amber-200", ariaLabel: `${unit.name} is in progress` };
  }

  return { label: "Not Started", className: "bg-red-100 text-red-800 border-red-200", ariaLabel: `${unit.name} is not started` };
}

export function FleetMatrix({ initialUnits }: { initialUnits: FleetUnit[]; admin?: boolean }) {
  const [units, setUnits] = useState(initialUnits);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/fleet-status");
        if (res.ok) {
          setUnits(await res.json());
        }
      } catch {
        // Keep last known state on failure
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {units.map((unit) => {
        const primaryBadge = getPrimaryBadge(unit);
        const isOutOfService = unit.status === "out_of_service";
        const oosTimestamp = formatOosTimestamp(unit.oosAt);
        const progressColor = unit.status === "out_of_service"
          ? "bg-slate-400"
          : unit.total > 0 && unit.completed >= unit.total
            ? "bg-green-600"
            : unit.inProgress > 0 || unit.completed > 0
              ? "bg-amber-400"
              : "bg-red-700";

        return (
          <article key={unit.id} className={`rounded-3xl p-5 shadow-sm border-2 border-slate-200 ${isOutOfService ? "bg-slate-50 opacity-70" : "bg-white"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-700">{unit.unit_kind}</p>
                <h2 className="mt-2 text-3xl font-black">{unit.name}</h2>
                <p className="mt-1 capitalize text-slate-600">{unit.status.replace("_", " ")}</p>
                {isOutOfService && (oosTimestamp || unit.oosByName) ? (
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    {oosTimestamp ? `OOS ${oosTimestamp}` : "OOS"}
                    {unit.oosByName ? ` • ${unit.oosByName}` : ""}
                  </p>
                ) : null}
              </div>
              <div className={`rounded-2xl px-4 py-3 text-xl font-black text-white ${isOutOfService ? "bg-slate-500" : "bg-slate-950"}`}>{unit.percentage}%</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2" aria-label={`Operational status badges for ${unit.name}`}>
              <StatusBadge ariaLabel={primaryBadge.ariaLabel} className={primaryBadge.className}>{primaryBadge.label}</StatusBadge>
              {unit.statusNote ? <StatusBadge ariaLabel={`${unit.name} status note: ${unit.statusNote}`} className="bg-slate-100 text-slate-700 border-slate-300">{unit.statusNote}</StatusBadge> : null}
              {unit.exceptionCount > 0 ? <StatusBadge ariaLabel={`${unit.name} has ${unit.exceptionCount} exceptions`} className="bg-red-100 text-red-800 border-red-200">Exceptions: {unit.exceptionCount}</StatusBadge> : null}
              {unit.hasComments ? <StatusBadge ariaLabel={`${unit.name} has comments`} className="bg-slate-100 text-slate-700 border-slate-300">Comments</StatusBadge> : null}
              {unit.status === "in_service" && !unit.crewComplete ? <StatusBadge ariaLabel={`${unit.name} crew information is missing`} className="bg-amber-100 text-amber-800 border-amber-200">Crew Missing</StatusBadge> : null}
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
