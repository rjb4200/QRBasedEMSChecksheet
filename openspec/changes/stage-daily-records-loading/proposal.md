## Why

The Daily Readiness Records page currently waits for full unit records, trend chart data, and maintenance/export availability before rendering any real page content. Even with a route-level skeleton, the page remains all-or-nothing: admins cannot see filters, summary counts, or chart progress until the slowest section finishes.

## What Changes

- Split `/admin/archives` into a fast shell plus independently loading async sections using Suspense boundaries
- Render the page header and filter form immediately from URL/search-param state
- Load summary counts before the heavier unit record detail cards where feasible
- Load the trend chart independently from daily record cards
- Keep export and Clear Records tools in their own independently loaded section
- Add section-level skeletons for Records summary, trend chart, unit record cards, and tools
- Preserve all existing Records completion logic, filters, exports, print behavior, and clear-records workflow

## Capabilities

### New Capabilities

- `records-staged-loading`: Staged loading behavior for Daily Readiness Records, including independent section boundaries and section-specific skeletons

### Modified Capabilities

- `archive-history`: Records page behavior changes from all-at-once rendering to staged section rendering while preserving the same data meaning and controls
- `admin-loading-states`: Loading states expand from route-level skeletons to section-level skeletons for Daily Readiness Records

## Impact

- **Affected page**: `src/app/admin/archives/page.tsx`
- **Potential new local components**: Records shell, summary section, trend chart section, record cards section, export/maintenance tools section, section skeletons
- **Affected data utilities**: `src/lib/archive-records.ts` may need lightweight helpers or wrappers, but official completion logic must remain shared with full records
- **Unaffected**: database schema, export/print routes, archive detail pages, Fleet Panel, Equipment Catalog, Issues Tracker
