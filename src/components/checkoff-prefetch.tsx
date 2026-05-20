"use client";

import { useEffect, useRef } from "react";
import { hasFreshCachedFormSetup, writeCachedFormSetup } from "@/lib/checkoff-cache";

type TargetInfo = {
  id: string;
  type: "compartment" | "kit";
  status?: "not_started" | "in_progress" | "completed" | "incomplete" | "exception";
};

const BATCH_SIZE = 2;

export function CheckoffPrefetch({ unitId, targets }: { unitId: string; targets: TargetInfo[] }) {
  const cancelledRef = useRef(false);
  const controllersRef = useRef<Set<AbortController>>(new Set());

  useEffect(() => {
    cancelledRef.current = false;

    async function prefetch() {
      const eligibleTargets = targets.filter((target) => target.status !== "completed" && !hasFreshCachedFormSetup(unitId, target.type, target.id));

      async function waitForVisible() {
        if (!document.hidden) return;
        await new Promise<void>((resolve) => {
          const handleVisibility = () => {
            if (!document.hidden) {
              document.removeEventListener("visibilitychange", handleVisibility);
              resolve();
            }
          };
          document.addEventListener("visibilitychange", handleVisibility);
        });
      }

      for (let i = 0; i < eligibleTargets.length; i += BATCH_SIZE) {
        if (cancelledRef.current) return;
        await waitForVisible();
        if (cancelledRef.current) return;
        const batch = eligibleTargets.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async (target) => {
            if (cancelledRef.current) return;
            const controller = new AbortController();
            controllersRef.current.add(controller);
            try {
              const res = await fetch(`/api/units/${unitId}/checkoff-setup/${target.type}/${target.id}`, { signal: controller.signal });
              if (!res.ok) return;
              const data = await res.json();
              if (data.items && data.groups) {
                writeCachedFormSetup(unitId, target.type, target.id, data);
              }
            } catch {
              // Prefetch failure degrades silently
            } finally {
              controllersRef.current.delete(controller);
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
      controllersRef.current.forEach((controller) => controller.abort());
      controllersRef.current.clear();
      clearTimeout(timer);
    };
  }, [unitId, targets]);

  return null; // invisible — no UI
}
