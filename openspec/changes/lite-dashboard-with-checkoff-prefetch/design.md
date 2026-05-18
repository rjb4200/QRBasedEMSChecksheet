## Context

The unit dashboard `page.tsx` runs a single `units` query that nests `unit_compartment_items(..., equipment_catalog(name))` and `kit_items(..., equipment_catalog(name))` through two levels of Supabase relationship expansion. This single query returns every equipment item's full details for every compartment and kit in the unit — often hundreds of rows of nested JSON. The equipment catalog name join adds a foreign-key lookup per item that compounds with the nested structure.

In practice, crews navigate to checkoff pages by scanning QR codes or tapping NFC tags. The dashboard serves primarily as a status overview and a landing page. Full item detail is only needed when a specific checkoff page opens.

The current `checkoff/[unitId]/[compartmentId]/page.tsx` already loads full item + group + equipment data independently. It does not rely on the dashboard query.

## Goals / Non-Goals

**Goals:**
- Reduce dashboard query payload by removing `equipment_catalog(name)` from nested item selects.
- Load equipment catalog names via a separate, flat query (id + name only).
- Prefetch full checkoff form setup data in small batches after dashboard render.
- Cache form setup in localStorage with 10-minute TTL.
- Checkoff pages render from cache when valid, with background server refresh.

**Non-Goals:**
- Do not cache submitted check results, completion state, exceptions, or crew signatures.
- Do not change checkoff submission, save, or completion logic.
- Do not add IndexedDB — localStorage is sufficient for initial implementation.
- Do not prefetch on the admin dashboard or archive pages.

## Decisions

### Decision 1: Separate equipment catalog name query

**Choice**: Remove `equipment_catalog(name)` from the dashboard's nested items query. Instead, collect all `equipment_id` values from the items, then run a single flat query: `select id, name from equipment_catalog where id in (...)`.

**Rationale**: The FK join inside nested selects creates N+1 query patterns at the database level. A flat `WHERE id IN (...)` query is a single index scan regardless of how many items exist.

### Decision 2: localStorage cache with simple TTL

**Choice**: Store serialized JSON under key `qrCheckoff.formSetup:{unitId}:{targetType}:{targetId}` with `{ cachedAt, expiresAt, data }`. Check validity on checkoff page open.

**Rationale**: `localStorage` is synchronous, universally available, and sufficient for form setup payloads (serialized item/group arrays are a few KB per target). IndexedDB adds complexity for no meaningful gain at this scale.

### Decision 3: Prefetch in small batches with concurrency limit

**Choice**: After dashboard render, iterate targets in sort order, fetching 2 at a time with `Promise.all`. Store results in localStorage. Skip targets that already have fresh cache entries.

**Rationale**: 2 concurrent fetches balance speed against server load. The dashboard remains usable during prefetch — no loading spinners or blocking states.

### Decision 4: Cache-first render with background refresh on checkoff pages

**Choice**: On checkoff page open, synchronously check localStorage. If valid cache exists, render the form immediately with cached data. Simultaneously start a server fetch. If server data differs (e.g., par levels changed), patch the form state in-place without page reload.

**Rationale**: The cache makes QR/NFC checkoff opens feel instant. The background refresh ensures data freshness without blocking the crew.

### Decision 5: No cache invalidation beyond TTL

**Choice**: First version uses only a 10-minute TTL. No `updated_at` timestamp or layout version checking.

**Rationale**: Equipment changes are infrequent in the field. A 10-minute TTL covers the typical shift window. If a cache is stale, the background server refresh patches it within seconds of the checkoff page opening.

## Risks / Trade-offs

- **Risk**: Stale cache shows outdated par levels for a few seconds until background refresh completes. → **Mitigation**: Background refresh runs immediately on page open; typical latency is 1-2 seconds.
- **Risk**: localStorage quota exceeded if many units have cached data. → **Mitigation**: Old entries are evicted by TTL check; typical form setup payload is < 5 KB per target.
- **Trade-off**: Dashboard still loads item IDs, par_levels, and input_types (needed for restocking list). → Acceptable — these are small integers/strings without FK joins.

## Migration Plan

1. Add `src/lib/checkoff-cache.ts` with cache read/write/evict utilities.
2. Update dashboard page query and add prefetch logic.
3. Update compartment and kit checkoff pages to use cache-first render.
4. No database changes. Rollback: revert page query and remove cache module.
