## Why

The Fleet Panel aggregation loop performs O(N×M) repeated in-memory filtering for every page render, and `refreshDailyUnitLedgers` unnecessarily mutates the database as a side effect of reading fleet status. With the page refreshing every 30 seconds, this compounds into significant wasted CPU cycles and redundant DB writes.

## What Changes

- Pre-group compartment checks by unit_id into a Map (adopting the pattern already used in `archive-records.ts`), eliminating repeated `.filter()` scans
- Pre-split checks by status (completed / in-progress) and pre-compute exception counts during the single O(M) grouping pass, eliminating the per-unit reduce loop
- Remove `refreshDailyUnitLedgers()` from `getFleetStatus()` — the fleet read path becomes pure queries with no side-effect mutations
- Add a module-level cache with shift-aware TTL so that repeated calls within the same shift window return cached results, avoiding redundant DB round-trips from concurrent or rapid requests

## Capabilities

### New Capabilities
- `fleet-check-pre-grouping`: Build a Map<unitId, GroupedChecks> in a single O(M) pass, replacing per-unit O(M) filter scans with O(1) lookups
- `fleet-exception-precompute`: Compute exception counts once during the check-grouping pass instead of re-iterating item_data JSON per unit
- `fleet-status-cache`: Module-level cache keyed by shift that serves subsequent `getFleetStatus` calls within the same shift without re-querying the database

### Modified Capabilities
- `daily-readiness-ledger-records`: The `refreshDailyUnitLedgers` mutation is removed from the fleet read path. The fleet panel degrades gracefully using live unit data when ledger data is unavailable, and ledger refresh becomes the responsibility of an external mechanism (cron, edge function, or explicit admin action)

## Impact

- `src/lib/fleet.ts` — core aggregation logic rewritten
- `src/lib/daily-unit-ledgers.ts` — `refreshDailyUnitLedgers` is no longer called from fleet.ts (function remains available for external use)
- `src/components/auto-refresh.tsx` — unchanged (interval stays at 30s)
- `src/app/admin/page.tsx` — no structural changes, benefit from cache deduplication
- `src/app/supervisor/page.tsx` — no structural changes, benefit from cache deduplication
