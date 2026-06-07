## Why

The Fleet Panel runs an expensive pre-aggregation upsert (`refreshDailyUnitLedgers`) as a side-effect of every page view, repeats the same O(N x M) in-memory filtering across `checkRows` for every unit, and triggers full page re-renders (including discrepancies, comments, and storage queries) every 30 seconds via `router.refresh()`. This makes the dashboard slower than necessary and causes unnecessary database writes during every viewing session.

## What Changes

- **Remove the side-effect mutation**: `refreshDailyUnitLedgers()` is extracted from `getFleetStatus()` and moved to a dedicated cron endpoint (`/api/cron/refresh-ledgers`) that runs every minute.
- **Pre-group checks by unit**: Checks are bucketed into a `Map<unitId, {all, completed, inProgress, exceptionCount}>` in a single O(M) pass — adopting the same pattern already used in `archive-records.ts`.
- **In-memory pre-compute exception counts**: Exception counts are computed once per check during the grouping pass instead of in a per-unit reduce loop.
- **Client-side Fleet Matrix polling via API route**: `FleetMatrix` becomes a client component that fetches fleet data from `GET /api/admin/fleet-status` every 30 seconds, replacing `router.refresh()` so only the fleet panel updates — discrepancies, comments, issues, and storage warnings are no longer re-fetched on every poll cycle.

## Capabilities

### New Capabilities

- `fleet-api-route`: A dedicated API endpoint (`GET /api/admin/fleet-status`) that returns optimized fleet aggregation data as JSON, used by the client-side FleetMatrix for polling.

### Modified Capabilities

- `fleet-dashboard`: The polling mechanism changes from full-page `router.refresh()` to a client-component fetch against `/api/admin/fleet-status`. The 30-second interval remains unchanged.
- `daily-unit-service-snapshots`: `refreshDailyUnitLedgers()` is no longer called from the fleet read path. It continues to run (via cron endpoint) and continues to be called by status-change actions (unit toggles, archival) — no functional change to ledger content, only the trigger mechanism.

## Impact

- `src/lib/fleet.ts` — remove `refreshDailyUnitLedgers` call, pre-group checks with status split and exception pre-compute
- `src/components/fleet-matrix.tsx` — convert from server to client component, add polling logic, accept initial data via props
- `src/app/admin/page.tsx` — remove `AutoRefresh`, seed FleetMatrix with initial SSR data, remove fleet fetch from `Promise.all`
- `src/app/supervisor/page.tsx` — same changes as admin page
- `src/components/auto-refresh.tsx` — removed
- New `src/app/api/admin/fleet-status/route.ts` — lightweight fleet aggregation endpoint
- New `src/app/api/cron/refresh-ledgers/route.ts` — cron endpoint for ledger refresh
