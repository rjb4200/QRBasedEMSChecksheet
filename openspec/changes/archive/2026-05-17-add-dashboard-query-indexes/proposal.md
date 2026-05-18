## Why

The unit dashboard page queries `daily_unit_crews`, `daily_unit_comments`, and `daily_section_comments` filtering by `(unit_id, shift_date, shift_period)` on every page load. Without dedicated composite indexes on these columns, full table scans will degrade performance as historical records accumulate, slowing mobile checkoff traffic and increasing Supabase query latency.

## What Changes

- Add composite index `daily_unit_crews_unit_shift_idx` on `daily_unit_crews(unit_id, shift_date, shift_period)`.
- Add composite index `daily_unit_comments_unit_shift_idx` on `daily_unit_comments(unit_id, shift_date, shift_period)`.
- Add composite index `daily_section_comments_unit_shift_idx` on `daily_section_comments(unit_id, shift_date, shift_period)`.
- Add composite index `daily_restock_items_unit_shift_idx` on `daily_restock_items(unit_id, shift_date, shift_period)`.
- Add composite index `daily_manual_restock_items_unit_shift_idx` on `daily_manual_restock_items(unit_id, shift_date, shift_period)`.

## Capabilities

### New Capabilities
- `dashboard-query-performance`: The unit dashboard and restocking queries use dedicated composite indexes for shift-scoped lookups.

### Modified Capabilities
<!-- None — this is a pure performance optimization with no user-facing behavior change. -->

## Impact

- **Database**: Five new composite indexes on operational tables via migration.
- **Code**: No application code changes — indexes are transparent to queries.
- **Dependencies**: None. No downtime required.
