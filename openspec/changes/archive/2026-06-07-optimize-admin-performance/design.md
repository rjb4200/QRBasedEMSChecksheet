## Context

After converting the issue detail page to a server component, five remaining bottlenecks were identified:

1. **`issue_notes.issue_id` has no index** — queries that filter by `issue_id` (which the detail page does on every load) perform full sequential scans
2. **No `loading.tsx`** — while the server component awaits its queries, the user sees a blank page with no visual feedback
3. **`createAdminClient()` call sites not cached** — the function creates a new Supabase client object on every call; called 4-5 times per request (middleware, layout, page, server actions, logging)
4. **`units` full table scan** — the issue detail page fetches all units solely to populate a dropdown selector
5. **Double `verifyAdminSession()`** — both middleware and admin layout independently verify the admin session cookie (HMAC-SHA256 + DB query)

## Goals / Non-Goals

**Goals:**
- Add database indexes to eliminate full table scans on `issue_notes` and `issues`
- Provide instant visual feedback during server-side data fetching with `loading.tsx` skeletons
- Reduce redundant Supabase client instantiation within a single request
- Eliminate the redundant units full-table scan on every issue detail page load
- Skip the duplicate admin session verification in the layout when middleware already verified it

**Non-Goals:**
- Converting the issues list page to a server component (separate task)
- Restructuring the middleware matcher (separate concern)
- Adding pagination to API endpoints
- Changing the authentication mechanism (cookie-based admin auth remains as-is)

## Decisions

### 1. Database indexes — composite vs single-column

**Decision:** Add a composite index `issue_notes(issue_id, created_at)` covering both the WHERE and ORDER BY clauses. Add single-column indexes on `issues(status)`, `issues(created_at DESC)`, and `issues(unit_id)`.

**Rationale:** The query `WHERE issue_id = $1 ORDER BY created_at ASC` benefits from a composite index that covers both columns, enabling an index-only scan. The `issues` table indexes accelerate the list endpoint which filters by status and sorts by `created_at`. Single-column indexes are sufficient for these since the filtered columns are independent.

**Alternative considered:** Just `issue_notes(issue_id)`. Rejected because the composite index also covers the sort, avoiding a separate sort step.

### 2. `createAdminClient()` caching — `React.cache()` vs module singleton

**Decision:** Wrap `createAdminClient()` in `React.cache()` for per-request deduplication.

**Rationale:** A module-level singleton persists across requests in production (Next.js caches module state), which is acceptable since the service role key is static. However, `React.cache()` is more idiomatic for server components and server actions, ensuring proper per-request scoping. The function remains stateless — `React.cache()` just memoizes the return value within the current render pass / request context.

```ts
import { cache } from "react";
export const createAdminClient = cache(() => { ... });
```

**Alternative considered:** Module-level singleton (`let client; export function ... { return client ??= ... }`). Rejected because it mixes concerns across requests and could cause issues if the environment variables change (e.g., testing).

### 3. Loading skeleton — `loading.tsx` pattern

**Decision:** Create `src/app/admin/issues/[id]/loading.tsx` with a simple skeleton mimicking the page layout (header bar, content cards, notes section). Also create `src/app/admin/loading.tsx` for a generic admin loading state.

**Rationale:** This is the standard Next.js convention — Next.js automatically shows `loading.tsx` while the server component in the same directory segment is awaiting. No additional wiring needed. The skeleton should be lightweight (no client components, no hooks) and visually match the page structure to minimize layout shift.

### 4. Units query caching

**Decision:** Extract the units lookup into a `cachedUnits()` helper using `React.cache()`.

**Rationale:** The units list rarely changes and is only needed for a dropdown. Caching it per-request prevents a full table scan on every page load. `React.cache()` is the standard Next.js pattern for deduplicating data fetches within a render pass.

### 5. Admin layout session verification

**Decision:** Read the admin session cookie directly in the layout using `cookies()` and `verifyAdminSession()`, but skip the full verification if the middleware already set a request header or if we restructure to a single point of verification.

**Practical decision:** Since this requires middleware-layout coordination and has architectural implications, this is scoped as a low-priority improvement. The immediate gains from indexes, loading states, and client caching provide the bulk of the performance improvement.

**Alternative:** Pass a verified flag via headers from middleware to layout. Rejected for this change as it requires cross-cutting changes with risk of regression. Deferred.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| **Migration lock contention** — Creating indexes on production tables may briefly lock writes | Indexes are created with `CREATE INDEX IF NOT EXISTS` which is non-blocking on Postgres (uses `CONCURRENTLY` if needed). Tables are small (13 issues, 3 notes) so impact is negligible. |
| **`React.cache()` stale data** — Cached units list won't reflect newly created units within the same request | Acceptable. Units are rarely created during admin operations. Cache is per-request, so the next request gets fresh data. |
| **Loading skeleton layout shift** — If the skeleton doesn't match the page dimensions, content will jump on load | Design skeleton to mirror the page structure with matching card sizes and spacing. |
| **Removing explicit admin client calls** — Some importers may rely on `createAdminClient` being uncached | The function signature and behavior are identical — caching only prevents redundant instantiation of identical clients within the same scope. No breaking change. |
