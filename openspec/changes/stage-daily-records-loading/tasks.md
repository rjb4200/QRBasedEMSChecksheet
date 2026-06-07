## 1. Records Page Shell

- [x] 1.1 Refactor `src/app/admin/archives/page.tsx` so the top-level page parses search params and renders the header plus filter form without awaiting full Records data
- [x] 1.2 Add a lightweight unit-options query/helper for the filter dropdown if needed, returning only `id` and `name`

## 2. Section Components

- [x] 2.1 Create a summary section for checked, incomplete, not started, not required, and exceptions counts
- [x] 2.2 Create a trend chart section that loads `getTrendGroups()` independently
- [x] 2.3 Create a unit record cards section that loads selected-date `getDailyUnitRecords(...)` independently
- [x] 2.4 Create an export and Clear Records tools section that loads rotation/delete availability independently

## 3. Suspense Boundaries and Skeletons

- [x] 3.1 Add Suspense boundary and skeleton for the summary stats section
- [x] 3.2 Add Suspense boundary and skeleton for the trend chart section
- [x] 3.3 Add Suspense boundary and skeleton for the unit record card grid
- [x] 3.4 Add Suspense boundary and skeleton for export/Clear Records tools

## 4. Data Correctness

- [x] 4.1 Ensure summary counts use the same completion status rules as the detailed unit cards
- [x] 4.2 Ensure all staged sections use the same selected date and unit filter
- [x] 4.3 Ensure Print, Simple CSV, Detailed CSV, Full Package, and Clear Records controls preserve existing behavior

## 5. Verify

- [x] 5.1 Run `npm run typecheck` and `npm run lint`
- [x] 5.2 Manually verify `/admin/archives` staged behavior: shell appears first, summary/chart/cards/tools can load independently, and loaded data matches prior behavior
