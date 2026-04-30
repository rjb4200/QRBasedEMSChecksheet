"use client";

import { useState, useTransition } from "react";
import { saveUnitCrew, unlockUnitCrew } from "./actions";

type Props = {
  completedCompartments: number;
  initialProviderNames: string;
  initialLocked: boolean;
  totalChecks: number;
  unitId: string;
};

export function CrewNameLock({ completedCompartments, initialProviderNames, initialLocked, totalChecks, unitId }: Props) {
  const [providerNames, setProviderNames] = useState(initialProviderNames);
  const [locked, setLocked] = useState(initialLocked);
  const [isPending, startTransition] = useTransition();
  const completed = completedCompartments + (locked ? 1 : 0);
  const percentage = totalChecks === 0 ? 0 : Math.round((completed / totalChecks) * 100);

  function toggleLock() {
    if (locked) {
      setLocked(false);
      startTransition(async () => {
        await unlockUnitCrew(unitId, providerNames);
      });
      return;
    }

    setLocked(true);
    startTransition(async () => {
      await saveUnitCrew(unitId, providerNames);
    });
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-600">Current progress</p>
            <p className="text-2xl font-black">{completed} of {totalChecks} checks ({percentage}%)</p>
          </div>
          <div className="h-16 w-16 rounded-full bg-slate-950 p-2 text-center text-sm font-black text-white">
            <span className="flex h-full items-center justify-center">{percentage}%</span>
          </div>
        </div>
        <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-red-700 transition-all" style={{ width: `${percentage}%` }} />
        </div>
      </section>

      <section className={`rounded-3xl border p-5 shadow-sm transition ${locked ? "border-green-300 bg-green-50" : "border-transparent bg-white"}`}>
        <label className="text-sm font-semibold text-slate-600" htmlFor="providerNames">Crew / Providers checking this unit</label>
        <div className="mt-2 flex gap-2">
          <textarea
            className={`min-h-24 flex-1 rounded-2xl border px-4 py-3 font-semibold ${locked ? "border-green-300 bg-green-100 text-green-950" : "border-slate-300 bg-white text-slate-950"}`}
            disabled={locked || isPending}
            id="providerNames"
            onChange={(event) => setProviderNames(event.target.value)}
            placeholder="Enter provider names"
            value={providerNames}
          />
          <button
            aria-label={locked ? "Unlock crew names for editing" : "Lock and save crew names"}
            className={`h-14 w-14 shrink-0 rounded-2xl text-2xl font-black shadow-sm ${locked ? "bg-green-700 text-white" : "bg-slate-950 text-white"}`}
            disabled={isPending}
            onClick={toggleLock}
            type="button"
          >
            {locked ? (
              <svg aria-hidden="true" className="mx-auto h-7 w-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect height="11" rx="2" width="14" x="5" y="11" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
            ) : (
              <svg aria-hidden="true" className="mx-auto h-7 w-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect height="11" rx="2" width="14" x="5" y="11" />
                <path d="M8 11V8a4 4 0 0 1 7.5-2" />
              </svg>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
