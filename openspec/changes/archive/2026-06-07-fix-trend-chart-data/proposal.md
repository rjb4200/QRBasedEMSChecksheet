## Why

The Daily Readiness trend chart shows 0/6 for recent dates despite valid completed check data in the database. The chart relies on `getDailyUnitRecords` which was designed for detailed record views — it builds complex data structures through double-mapped checkMaps across two code paths (ledger and fallback). The completion percentages fed to the chart are incorrectly zero, likely from a misalignment between the heavyweight record pipeline and the lightweight needs of the chart.

## What Changes

- Replace the chart data source with a dedicated, lightweight server function that directly queries `daily_unit_ledgers`, `compartment_checks`, and `daily_unit_crews` for the 14-day trend.
- Compute `completedInServiceUnits` and `totalInServiceUnits` in a single function without reusing the complex record builder.
- Keep `CompletionTrendChart` unchanged as a pure rendering component.
- Keep the `groupDailyUnitRecords` path for the records list, which already works correctly.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `records-completion-trend`: The trend chart will use a dedicated lightweight data function instead of sharing `getDailyUnitRecords`. This changes the existing requirement that the chart "reads existing data without new queries" — the chart will make its own focused queries that are simpler and more reliable.

## Impact

- Affects `src/app/admin/archives/page.tsx` (call the new fetch function).
- Adds a new function to `src/lib/archive-records.ts` or a new lib module.
- `src/components/completion-trend-chart.tsx` unchanged (pure render, same `DailyRecordGroup[]` input).
- No database schema, API, or authentication changes.
