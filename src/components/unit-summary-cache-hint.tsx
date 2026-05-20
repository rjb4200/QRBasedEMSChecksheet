"use client";

import { useEffect, useState } from "react";
import { readCachedUnitSummary, writeCachedUnitSummary, type CachedUnitSummaryData } from "@/lib/checkoff-cache";

export function UnitSummaryCacheHint({ unitId, shiftDate, shiftPeriod }: { unitId: string; shiftDate: string; shiftPeriod: string }) {
  const [summary, setSummary] = useState<CachedUnitSummaryData | null>(null);

  useEffect(() => {
    const cached = readCachedUnitSummary(unitId, shiftDate, shiftPeriod);
    if (cached) setSummary(cached.data);

    const controller = new AbortController();
    async function refresh() {
      try {
        const params = new URLSearchParams({ shiftDate, shiftPeriod });
        const response = await fetch(`/api/units/${unitId}/summary?${params.toString()}`, { signal: controller.signal });
        if (!response.ok) return;
        const data = (await response.json()) as CachedUnitSummaryData;
        writeCachedUnitSummary(unitId, shiftDate, shiftPeriod, data);
        setSummary(data);
      } catch {
        // Summary hint is optional; the server-rendered page remains authoritative.
      }
    }

    void refresh();
    return () => controller.abort();
  }, [unitId, shiftDate, shiftPeriod]);

  if (!summary) return null;

  return (
    <div className="rounded-3xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-950">
      Prepared summary for {summary.unitName}: {summary.completedCount}/{summary.totalCount} checks complete. Live server data is shown below.
    </div>
  );
}
