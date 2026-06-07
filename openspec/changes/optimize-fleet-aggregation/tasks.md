## 1. Core Aggregation Refactor (src/lib/fleet.ts)

- [x] 1.1 Remove `await refreshDailyUnitLedgers(supabase, shift)` call from `getFleetStatus`
- [x] 1.2 Add `UnitCheckGroup` type with fields: `all`, `completed`, `inProgress` (CheckRow[]), `exceptionCount` (number)
- [x] 1.3 Build `Map<string, UnitCheckGroup>` in a single O(M) pass over `checkRows`, grouping by `unit_id`
- [x] 1.4 Pre-compute exception counts during the grouping pass using `countTargetExceptions` with existing `compartmentItemMap`, `kitItemMap`, and `unitKitMap`
- [x] 1.5 Replace per-unit `checkRows.filter()` calls with `map.get(unit.id)` lookups using pre-split `completed` and `inProgress` arrays
- [x] 1.6 Replace per-unit `completedChecks.reduce()` exception counting with pre-computed `group.exceptionCount`
- [x] 1.7 Remove `latestIso` spread over `completedChecks.map()` — compute max timestamp directly from pre-split completed array

## 2. Module-Level Shift-Aware Cache

- [x] 2.1 Add module-scoped cache object: `{ data: FleetUnit[], shiftKey: string, expiresAt: number } | null`
- [x] 2.2 Add cache hit logic at top of `getFleetStatus`: if shift key matches and TTL not expired, return cached data immediately
- [x] 2.3 Add cache miss logic at end of `getFleetStatus`: store fresh data with current shift key and `Date.now() + 60_000` expiry
- [x] 2.4 Use `shiftDate` and `shiftPeriod` from `getCurrentShift()` as the cache key components

## 3. Verification

- [x] 3.1 Run TypeScript typecheck — no new errors introduced
- [ ] 3.2 Verify admin fleet panel renders all units with correct completion percentages, status badges, and exception counts
- [ ] 3.3 Verify supervisor fleet panel renders correctly (view-only)
- [ ] 3.4 Verify exception counts match pre-change behavior for units with item exceptions
- [x] 3.5 Confirm `refreshDailyUnitLedgers` is not called during fleet page loads (check server logs or add temporary console trace)
