## 1. Cache Utilities

- [x] 1.1 Create `src/lib/checkoff-cache.ts` with cache key builder, read, write, and evict functions
- [x] 1.2 Implement 10-minute TTL check on cache read
- [x] 1.3 Store/retrieve serialized JSON from localStorage with error handling

## 2. Dashboard Query Trim

- [x] 2.1 Remove `equipment_catalog(name)` from nested `unit_compartment_items` and `kit_items` selects in the dashboard units query
- [x] 2.2 Add a separate equipment catalog name query collecting all equipment IDs from items
- [x] 2.3 Resolve item names in restocking list computation using the separate names map

## 3. Dashboard Prefetch

- [x] 3.1 Create a client component or hook that runs after dashboard mount
- [x] 3.2 Iterate targets in sort order, fetching setup data in batches of 2 concurrent requests
- [x] 3.3 Call the checkoff page API (or a new API route) to get item+group+equipment data
- [x] 3.4 Store fetched data in cache via checkoff-cache utilities
- [x] 3.5 Skip targets with fresh (non-expired) cache entries
- [x] 3.6 Cancel pending fetches on unmount (page navigation)

## 4. Checkoff Page Cache-First Render

- [x] 4.1 On compartment checkoff page mount, synchronously check localStorage cache
- [x] 4.2 If valid cache exists, use cached items/groups for initial render
- [x] 4.3 Simultaneously fetch fresh data from server and merge differences
- [x] 4.4 After server fetch completes, store updated setup data in cache
- [x] 4.5 Apply same pattern to kit checkoff page
- [x] 4.6 If no cache exists, load normally and cache result

## 5. Verification

- [x] 5.1 Run `npm run lint` and fix any issues
- [x] 5.2 Run `npm run typecheck` and fix any issues
- [x] 5.3 Run `npm run build` and verify no build errors
- [ ] 5.4 Manual test: dashboard query excludes equipment_catalog(name) from nested items
- [ ] 5.5 Manual test: restocking list still shows correct item names
- [ ] 5.6 Manual test: prefetch stores data in localStorage after dashboard load
- [ ] 5.7 Manual test: opening a checkoff page uses cached data for instant render
- [ ] 5.8 Manual test: checkoff submission still saves to database correctly
