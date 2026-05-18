## Why

The unit dashboard currently loads every equipment item's full details (name, par level, input type) for every compartment and kit during initial page render. This nested data multiplies query payload size and slows mobile dashboard load times. In the actual field workflow, crews open checkoff pages by scanning QR codes or tapping NFC tags — they rarely click compartments from the dashboard. The dashboard should load as a lightweight status page and defer full checkoff form setup to background prefetch.

## What Changes

- Trim the initial dashboard query to load only compartment/kit names, IDs, and status data. Remove `equipment_catalog(name)` from nested item selects — use a separate compact query for equipment names.
- Add a prefetch helper that runs after the dashboard renders, fetching full checkoff form setup data (items, groups, equipment names) in small batches and storing it in a short-lived localStorage cache.
- Extend the checkoff page to check for valid cached form setup on open. If cached, render immediately from cache while refreshing server data in the background.
- Cache only form setup data (item names, par levels, input types, grouping, sort order). Never cache submitted check results, completion state, crew signatures, or restocking addressed state.
- Use a 10-minute TTL with cache keys scoped by `unitId`, `targetType`, and `targetId`.

## Capabilities

### New Capabilities
- `checkoff-cache-prefetch`: The dashboard prefetches checkoff form setup data in the background and checkoff pages render from a short-lived device cache when available.

### Modified Capabilities
<!-- None — existing checkoff submission, completion, and exception logic remains unchanged. -->

## Impact

- **Code**: `src/app/units/[id]/page.tsx` (trim dashboard query), new `src/lib/checkoff-cache.ts` (prefetch + cache utilities), `src/app/checkoff/[unitId]/[compartmentId]/page.tsx` and kit checkoff page (cache-first render).
- **Database**: No new tables or migrations. Existing queries remain for checkoff pages.
- **Dependencies**: None (localStorage API only).
