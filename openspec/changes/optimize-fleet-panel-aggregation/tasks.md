## 1. Optimize fleet aggregation

- [x] 1.1 Remove `refreshDailyUnitLedgers()` call from `getFleetStatus()` in `src/lib/fleet.ts`
- [x] 1.2 Build `Map<unitId, UnitCheckGroup>` in a single O(M) pass over `checkRows`, pre-splitting completed and in-progress checks and pre-computing exception counts per check
- [x] 1.3 Replace the per-unit `.filter()` chain in the `unitSources.map()` loop with `unitCheckMap.get(unit.id)` lookups
- [x] 1.4 Compute `completedAt` from pre-grouped completed checks instead of spreading into an intermediate array

## 2. Create fleet-status API route

- [x] 2.1 Create `src/app/api/admin/fleet-status/route.ts` with `GET` handler
- [x] 2.2 Authenticate via `createAdminClient()` and `createClient()` (accept both admin and authenticated users)
- [x] 2.3 Call the optimized `getFleetStatus()` and return `FleetUnit[]` as JSON
- [x] 2.4 Handle errors with appropriate status codes (401 unauth, 500 server error)

## 3. Convert FleetMatrix to client component

- [x] 3.1 Add `"use client"` directive to `src/components/fleet-matrix.tsx`
- [x] 3.2 Add `initialUnits` prop alongside existing `units` prop for SSR seed data
- [x] 3.3 Add `useState` + `useEffect` polling against `/api/admin/fleet-status` every 30 seconds
- [x] 3.4 On API failure, gracefully keep the last known good state
- [x] 3.5 Ensure `Link` components with `prefetch` still work in the client component

## 4. Update admin dashboard page

- [x] 4.1 Remove `AutoRefresh` import and usage from `src/app/admin/page.tsx`
- [x] 4.2 Unwrap `Promise.all` — call `getFleetStatus()` and `getCheckoffDiscrepanciesForRange()` separately, fleet data is still fetched at SSR time for `initialUnits`
- [x] 4.3 Pass fleet units as `initialUnits` prop to `<FleetMatrix admin initialUnits={units} />`

## 5. Update supervisor dashboard page

- [x] 5.1 Remove `AutoRefresh` import and usage from `src/app/supervisor/page.tsx`
- [x] 5.2 Pass fleet units as `initialUnits` prop to `<FleetMatrix initialUnits={units} />`

## 6. Create cron refresh-ledgers endpoint

- [x] 6.1 Create `src/app/api/cron/refresh-ledgers/route.ts` with `POST` handler
- [x] 6.2 Call `refreshDailyUnitLedgers()` with an admin client
- [x] 6.3 Return `{ ok: true }` on success, appropriate error on failure
- [x] 6.4 Add Vercel cron config entry in `vercel.json` to call this route every minute

## 7. Cleanup

- [x] 7.1 Delete `src/components/auto-refresh.tsx`
- [x] 7.2 Remove any remaining `AutoRefresh` imports across the codebase

## 8. Verify

- [x] 8.1 Run `npm run lint` (or project equivalent) and fix any issues
- [x] 8.2 Run `npm run typecheck` (or project equivalent) and fix any type errors
- [x] 8.3 Verify `npm run build` completes successfully
- [x] 8.4 Manually verify fleet panel loads with initial SSR data on first page load
- [x] 8.5 Manually verify fleet panel updates after 30s without page flicker
