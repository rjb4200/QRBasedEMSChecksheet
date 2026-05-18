"use client";

import { useEffect, useState } from "react";

type ExceptionItem = { sourceName: string; itemName: string; issue: string };

type State =
  | { kind: "loading" }
  | { kind: "loaded"; items: ExceptionItem[] }
  | { kind: "empty" }
  | { kind: "error" };

function groupBySource(items: ExceptionItem[]) {
  const map = new Map<string, ExceptionItem[]>();
  for (const item of items) {
    const list = map.get(item.sourceName) ?? [];
    list.push(item);
    map.set(item.sourceName, list);
  }
  return map;
}

export function PreviousExceptionsPanel({ unitId }: { unitId: string }) {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/units/${unitId}/previous-exceptions`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (cancelled) return;
        if (data.exceptionCount > 0) {
          setState({ kind: "loaded", items: data.items });
        } else {
          setState({ kind: "empty" });
        }
      } catch {
        if (!cancelled) setState({ kind: "error" });
      }
    }

    void load();
    return () => { cancelled = true; };
  }, [unitId]);

  if (state.kind === "loading") {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Previous Exceptions</p>
        <p className="mt-2 text-sm font-semibold text-slate-500">Checking previous exceptions...</p>
      </section>
    );
  }

  if (state.kind === "error") {
    return null;
  }

  if (state.kind === "empty") {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Previous Exceptions</p>
        <p className="mt-2 text-sm font-semibold text-slate-500">No previous exceptions found</p>
      </section>
    );
  }

  const grouped = groupBySource(state.items);
  const count = state.items.length;

  return (
    <section className="rounded-3xl border border-red-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-700">
        Previous Exceptions
        <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs">{count}</span>
      </p>
      <ul className="mt-3 space-y-3">
        {[...grouped.entries()].map(([sourceName, items]) => (
          <li key={sourceName} className="rounded-2xl bg-red-50 px-4 py-3 text-red-950">
            <p className="text-sm font-black">{sourceName}</p>
            <ul className="mt-1 space-y-0.5 text-sm font-semibold">
              {items.map((item, index) => (
                <li key={index}>{item.itemName} — {item.issue}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
