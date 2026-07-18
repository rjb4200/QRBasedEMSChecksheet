## Why

The Records page's `Last 14 Days Check Completion` chart has been inaccurate for an extended period because it reconstructs a unit-level completion metric through a separate data path. Keeping it visible misrepresents whether crews completed required work, so it should be removed before a new metric is designed.

## What Changes

- Remove the `Last 14 Days Check Completion` chart from `/admin/archives`, including its data fetch, presentation component, tests, and chart-specific records helper.
- Remove the active `records-completion-trend` capability specification entirely.
- Remove chart placement language from the Records page layout requirement while retaining the unrelated filter, records, export, and clear-records behavior.
- Remove the records module architecture requirement that only exists to support investigation of the retired chart.
- Preserve the existing Daily Readiness records, selected-date summary, exports, printing, and clear-records workflows.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `records-completion-trend`: Retire all requirements for the inaccurate 14-day completion trend chart.
- `archive-history`: Remove the chart from the Records page layout requirements while preserving the remaining layout requirements.
- `records-module-architecture`: Remove the retired chart investigation requirement.

## Impact

- Removes the chart section from `src/app/admin/archives/page.tsx`.
- Removes `src/components/completion-trend-chart.tsx` and `src/lib/records/daily-record-trends.ts` with their focused tests.
- Removes the `getTrendGroups` public facade export; no other consumers currently use it.
- Does not require a database migration, API change, or dependency change.
