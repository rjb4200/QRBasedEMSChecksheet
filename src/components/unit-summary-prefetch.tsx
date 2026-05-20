"use client";

import { useEffect, useRef } from "react";
import { writeCachedUnitSummary, type CachedUnitSummaryData } from "@/lib/checkoff-cache";

export async function prefetchUnitSummary(unitId: string, shiftDate: string, shiftPeriod: string, signal?: AbortSignal) {
  try {
    const params = new URLSearchParams({ shiftDate, shiftPeriod });
    const response = await fetch(`/api/units/${unitId}/summary?${params.toString()}`, { signal });
    if (!response.ok) return;
    const data = (await response.json()) as CachedUnitSummaryData;
    writeCachedUnitSummary(unitId, shiftDate, shiftPeriod, data);
  } catch {
    // Background prefetch must never affect the active workflow.
  }
}

export function UnitSummaryPrefetch({ unitId, shiftDate, shiftPeriod }: { unitId: string; shiftDate: string; shiftPeriod: string }) {
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    const timer = setTimeout(() => {
      if (!document.hidden) {
        void prefetchUnitSummary(unitId, shiftDate, shiftPeriod, controller.signal);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
      controllerRef.current = null;
    };
  }, [unitId, shiftDate, shiftPeriod]);

  return null;
}
