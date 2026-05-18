"use client";

import { useEffect, useRef } from "react";
import { writeCachedFormSetup } from "@/lib/checkoff-cache";

type TargetInfo = {
  id: string;
  type: "compartment" | "kit";
};

const BATCH_SIZE = 2;

export function CheckoffPrefetch({ unitId, targets }: { unitId: string; targets: TargetInfo[] }) {
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    async function prefetch() {
      for (let i = 0; i < targets.length; i += BATCH_SIZE) {
        if (cancelledRef.current) return;
        const batch = targets.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async (target) => {
            if (cancelledRef.current) return;
            try {
              const res = await fetch(`/api/units/${unitId}/checkoff-setup/${target.type}/${target.id}`);
              if (!res.ok) return;
              const data = await res.json();
              if (data.items && data.groups) {
                writeCachedFormSetup(unitId, target.type, target.id, data);
              }
            } catch {
              // Prefetch failure degrades silently
            }
          }),
        );
      }
    }

    // Delay prefetch to let the dashboard render first
    const timer = setTimeout(() => {
      void prefetch();
    }, 500);

    return () => {
      cancelledRef.current = true;
      clearTimeout(timer);
    };
  }, [unitId, targets]);

  return null; // invisible — no UI
}
