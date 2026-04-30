"use client";

import { useState, useTransition } from "react";
import { saveUnitCrew, unlockUnitCrew } from "./actions";

type Props = {
  initialProviderNames: string;
  initialLocked: boolean;
  unitId: string;
};

export function CrewNameLock({ initialProviderNames, initialLocked, unitId }: Props) {
  const [providerNames, setProviderNames] = useState(initialProviderNames);
  const [locked, setLocked] = useState(initialLocked);
  const [isPending, startTransition] = useTransition();

  function toggleLock() {
    if (locked) {
      startTransition(async () => {
        await unlockUnitCrew(unitId, providerNames);
        setLocked(false);
      });
      return;
    }

    startTransition(async () => {
      await saveUnitCrew(unitId, providerNames);
      setLocked(true);
    });
  }

  return (
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
  );
}
