## Context

The Fleet Panel (`src/lib/fleet.ts`) is the primary data pipeline for both the admin and supervisor dashboards. It runs every 30 seconds via `AutoRefresh` (a full Next.js `router.refresh()` that re-renders the entire server component page). The pipeline currently:

1. Calls `refreshDailyUnitLedgers()` — a DB mutation that upserts all active units into `daily_unit_ledgers`
2. Runs 8 parallel Supabase queries to fetch units, ledgers, checks, crews, comments, items, and kits
3. Builds several in-memory lookup maps (crew, comments, items, kits)
4. Iterates over every visible unit, filtering the full `checkRows` array 3-4 times per unit to compute completed, in-progress, and exception counts

The archive-records module (`src/lib/archive-records.ts`) already uses a pre-grouped `Map<string, CheckRow[]>` pattern for checks (line 272), but `fleet.ts` was never updated to adopt this same approach.

## Goals / Non-Goals

**Goals:**
- Eliminate O(N×M) repeated in-memory filtering by pre-grouping checks into a Map
- Eliminate per-unit ExceptionCount reduce loops by pre-computing during the grouping pass
- Remove `refreshDailyUnitLedgers()` from the fleet read path — it is a mutation and does not belong as a side-effect of viewing the dashboard
- Add a module-level shift-aware cache so concurrent or rapid requests within the same shift avoid redundant DB round-trips

**Non-Goals:**
- Client-side polling via a separate API route (the 30s `router.refresh()` pattern is preserved)
- Database schema changes (no new columns or indexes)
- Changing the FleetMatrix component from server to client
- Modifying `refreshDailyUnitLedgers` itself (the function remains available for external use)
- Optimizing the discrepancy or recent-comments data paths

## Decisions

### Decision 1: Pre-group checks into `Map<unitId, UnitCheckGroup>`

**What:** Build a single `Map<string, UnitCheckGroup>` in one O(M) pass over `checkRows`, where each group contains pre-split arrays:
```
UnitCheckGroup {
  all: CheckRow[],
  completed: CheckRow[],
  inProgress: CheckRow[],
  exceptionCount: number
}
```

**Why:** The current per-unit loop calls `checkRows.filter(check => check.unit_id === unit.id)` for every unit, then filters that subset twice more for status. With N units and M checks, this is O(N×M). A pre-grouped Map reduces the per-unit work to O(1) Map lookups.

**Alternative considered:** Grouping in SQL via `GROUP BY unit_id, status` would eliminate the in-memory work entirely. Rejected for now because exception counting requires iterating `item_data` JSON against `compartmentItemMap`/`kitItemMap`, which is impractical to express in SQL.

**Pattern reference:** `archive-records.ts:272-277` already builds `checkMap = Map<"unit_id:shift_date:shift_period", CheckRow[]>`. This decision adopts the same pattern, simplified to `unit_id` as key (shift is fixed to today).

### Decision 2: Pre-compute exception counts during the grouping pass

**What:** As each completed check is added to its unit group, immediately call `countTargetExceptions(check.item_data, expectedItems)` and accumulate into `group.exceptionCount`.

**Why:** Currently `exceptionCount` is computed in a per-unit `completedChecks.reduce(...)` that re-iterates `item_data` JSON and re-looks-up `compartmentItemMap`/`kitItemMap` entries. Moving this to the O(M) grouping pass does it exactly once per completed check.

**Alternative considered:** Storing `exception_count` as a database column on `compartment_checks`, computed at check-submit time. This would eliminate even the single in-memory computation. Rejected for now to avoid schema changes and keep this change focused on the aggregation pipeline.

### Decision 3: Remove `refreshDailyUnitLedgers` from `getFleetStatus`

**What:** Delete the `await refreshDailyUnitLedgers(supabase, shift)` call on line 111 of `fleet.ts`. The function itself remains exported and available for external callers.

**Why:** `refreshDailyUnitLedgers` performs a SELECT of all active units followed by an UPSERT into `daily_unit_ledgers`. This is a write operation that has no business being a side-effect of viewing the dashboard. It runs on every 30-second refresh, generating ~2,880 unnecessary DB writes per day per open browser tab.

The fleet panel already has a graceful fallback (lines 144-164): when `ledgerRows` is empty, it falls back to raw `unitRows`. Ledger rows are independently maintained by:
- Status-change actions (admin toggling in-service/out-of-service triggers `upsertTodayUnitLedger`)
- Unit archival (triggers `upsertTodayUnitLedger`)
- Shift reset (creates all ledger rows for the closing date)

**Risk:** If no ledger rows exist and no status changes have occurred (e.g., right at shift start), the fleet panel uses raw unit data, which lacks `archived` and `status_note`. This is acceptable because archived status and status notes only change via admin actions, which themselves update the ledger.

### Decision 4: Module-level cache with shift-aware TTL

**What:** A module-scoped cache object in `fleet.ts`:
```
{ data: FleetUnit[], shiftKey: string, expiresAt: number }
```
On each call, if `shiftKey` matches and `Date.now() < expiresAt`, return cached data. Otherwise, execute the full pipeline and cache the result with a 60-second TTL.

**Why:** The 30-second auto-refresh means every fleet panel call falls within the cache window of the previous call, halving effective DB load. Multiple concurrent users viewing the dashboard share the same in-memory cache. The shift-aware key prevents stale data from bleeding across shift boundaries (6 AM Eastern).

**Alternative considered:** `React.cache()` (used elsewhere in the codebase for supabase client deduplication). Rejected because `React.cache()` only deduplicates within a single render pass — it does not persist across requests.

## Risks / Trade-offs

- **Cache staleness (up to 60s):** Fleet data can be up to 60 seconds stale if a checkoff is submitted immediately after a cached read. This is acceptable because the current 30s refresh already has inherent staleness, and the cache TTL (60s) is only 2x the refresh interval.
- **Memory growth:** The cache holds `FleetUnit[]` and all grouped check data in memory. With typical fleet sizes (dozens of units, hundreds of checks), this is negligible. The cache entry is overwritten on each miss, so only one copy exists.
- **Concurrent first-load:** If multiple users load the fleet panel simultaneously during a cache miss, they each execute the pipeline independently. This is acceptable because it's the current behavior anyway and only happens once per TTL window.
- **Removing refresh from read path:** If `refreshDailyUnitLedgers` is not called elsewhere, the ledger may lack entries for units that haven't had status changes. The fallback handles this. A follow-up change should ensure ledger coverage via a cron job or shift-reset hook.

## Open Questions

- Should `refreshDailyUnitLedgers` be wired into shift-reset or a cron edge function as a follow-up? (Out of scope for this change, but noted as a gap.)
- Is 60s the right cache TTL, or should it be configurable? (Starting with 60s; can tune based on observed load.)
