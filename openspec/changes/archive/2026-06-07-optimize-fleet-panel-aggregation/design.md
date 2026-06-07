## Context

The Fleet Panel aggregates checkoff data across all units for today's shift. Currently it does this via a server-rendered page that re-executes on every `router.refresh()` (every 30s), running a full page re-render including discrepancies, comments, and storage queries. The aggregation itself runs a bulk ledger upsert as a side-effect and performs O(N x M) in-memory filtering.

We're on Vercel (serverless) + Supabase. Module-level caches don't survive across invocations. The DB already has composite indexes from `dashboard-query-performance` for the shift-scoped queries.

## Goals / Non-Goals

**Goals:**
- Eliminate the database write (`refreshDailyUnitLedgers`) from the fleet read path
- Reduce in-memory filtering from O(N x M) to O(M + N) using Map pre-grouping
- Isolate fleet polling so only the fleet grid re-renders (discrepancies, comments, issues, storage banner are not re-queried every 30s)
- Maintain the 30-second update interval
- Keep the cron-based ledger refresh simple — every minute, all day

**Non-Goals:**
- Real-time subscriptions (Supabase Realtime)
- Database schema changes
- Changing the FleetUnit data shape consumed by `FleetMatrix`
- Altering exception calculation logic or discrepancy queries
- Optimizing `archive-records.ts` or `getTrendGroups()` (same pattern exists there, but out of scope)

## Decisions

### 1. FleetMatrix as client component with SSR seed data

`FleetMatrix` becomes a `"use client"` component. It receives `initialUnits` (from SSR) as a prop and manages its own state via `useState` + `useEffect` polling.

```tsx
"use client";
export function FleetMatrix({ initialUnits, admin }: { initialUnits: FleetUnit[]; admin?: boolean }) {
  const [units, setUnits] = useState(initialUnits);
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/admin/fleet-status");
      if (res.ok) setUnits(await res.json());
    }, 30_000);
    return () => clearInterval(interval);
  }, []);
  // ... existing render logic
}
```

**Alternative considered**: Keep FleetMatrix as server component and use a parent wrapper client component for polling. Rejected — adds an unnecessary wrapper layer; FleetMatrix is a leaf component that benefits directly from owning its data.

**Why this works**: Next.js renders the initial SSR with real data (fast first paint), then the client component takes over. If the API call fails, the component gracefully keeps the last known good state. `Link prefetch` still works — Next.js handles it in client components.

### 2. API route at `/api/admin/fleet-status`

Returns `FleetUnit[]` as JSON. Auth via the existing `createAdminClient()` pattern. The route calls the same optimized `getFleetStatus()` (without the upsert), so there's no code duplication.

Since the supervisor page also needs fleet data, the `FleetMatrix` component accepts an `admin` prop that determines the poll URL:
- Admin: `GET /api/admin/fleet-status`
- Supervisor: `GET /api/supervisor/fleet-status` (or reuse admin route with role check)

**Decision**: Single route at `/api/admin/fleet-status` with both admin and supervisor auth checked. Supervisor access already exists via the supervisor page, and the data is read-only. A separate supervisor route is unnecessary overhead.

### 3. Check grouping data structure

Replace the per-unit `.filter()` chain with a pre-built `Map`:

```typescript
type UnitCheckGroup = {
  all: CheckRow[];
  completed: CheckRow[];
  inProgress: CheckRow[];
  exceptionCount: number;
};

const unitCheckMap = new Map<string, UnitCheckGroup>();

for (const check of checkRows) {
  let group = unitCheckMap.get(check.unit_id);
  if (!group) {
    group = { all: [], completed: [], inProgress: [], exceptionCount: 0 };
    unitCheckMap.set(check.unit_id, group);
  }
  group.all.push(check);
  if (check.status === "completed") {
    group.completed.push(check);
    const expectedItems = check.compartment_id
      ? compartmentItemMap.get(check.compartment_id) ?? []
      : kitItemMap.get(unitKitMap.get(check.unit_kit_id ?? "") ?? "") ?? [];
    group.exceptionCount += countTargetExceptions(check.item_data, expectedItems);
  } else if (check.status === "in_progress") {
    group.inProgress.push(check);
  }
}
```

The per-unit loop then reads directly from `unitCheckMap.get(unit.id)` — no scanning, no filtering, no reduce.

**Alternative considered**: Pre-split by status only (no exception pre-compute). Rejected — if we're doing one pass over checks anyway, computing exceptions in the same pass costs nothing extra and eliminates the reduce.

### 4. Cron endpoint at `/api/cron/refresh-ledgers`

Runs every minute via Vercel cron (`vercel.json`). The endpoint calls `refreshDailyUnitLedgers()` with the admin client. No auth needed — Vercel cron invokes the endpoint directly within the deployment.

**Edge case**: If the endpoint fires before the admin client can be created (cold start), it retries on the next minute. The upsert is idempotent, so overlapping runs are harmless.

**Alternative considered**: Supabase Edge Function or pg_cron. Rejected — keeps everything in the Next.js app, no new infrastructure.

### 5. Removing AutoRefresh

`src/components/auto-refresh.tsx` is deleted entirely. The admin and supervisor pages no longer need it — FleetMatrix handles its own polling. The discrepancy panel, comments, and issues are now static after initial load (which is acceptable — they were being unnecessarily re-fetched).

## Risks / Trade-offs

- **Risk**: API route cold start on Vercel adds latency to fleet polling. **Mitigation**: The 30s interval means occasional 1-2s cold starts are invisible; the component keeps showing the last known state.
- **Risk**: Supervisor page uses a different auth client (`createClient()` vs `createAdminClient()`). **Mitigation**: The fleet-status API route checks both admin and authenticated user roles.
- **Risk**: Removing `router.refresh()` means discrepancy data won't auto-update. **Mitigation**: Discrepancies weren't changing between page loads anyway (they require a form submission and page navigation to update). If needed, a separate refresh can be added later.
- **Risk**: Cron endpoint is unauthenticated (Vercel cron invokes directly). **Mitigation**: Standard Vercel cron pattern. The route is not exposed to the public internet if Vercel's cron system is configured correctly. Add a shared secret header check as defense-in-depth.
- **Trade-off**: FleetMatrix loses server-side rendering after initial load. **Mitigation**: The initial render IS server-rendered (via `initialUnits` prop). Subsequent updates are client-side, which is the intended behavior for live data.
