"use client";

import { createContext, useContext, useState } from "react";

const DestroyEnabledContext = createContext(false);

export function useDestroyEnabled() {
  return useContext(DestroyEnabledContext);
}

export function DestructiveActionsToggle({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  return (
    <DestroyEnabledContext.Provider value={enabled}>
      <div className="flex justify-end gap-3">
        <span className="text-sm font-black text-red-800">
          {enabled ? "Destructive actions unlocked" : "Destructive actions locked"}
        </span>
        <button
          aria-checked={enabled}
          className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition ${enabled ? "bg-red-700" : "bg-slate-300"}`}
          onClick={() => setEnabled((v) => !v)}
          role="switch"
          type="button"
        >
          <span className={`h-6 w-6 rounded-full bg-white shadow transition ${enabled ? "translate-x-6" : "translate-x-0"}`} />
          <span className="sr-only">Enable destructive actions</span>
        </button>
      </div>
      {children}
    </DestroyEnabledContext.Provider>
  );
}
