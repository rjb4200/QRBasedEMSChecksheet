## Context

The unit dashboard page (`src/app/units/[id]/page.tsx`) runs a `Promise.all` query block that fetches data from multiple tables filtered by `unit_id`, `shift_date`, and `shift_period`. The `compartment_checks` table already has a composite index `compartment_checks_unit_idx` on `(unit_id, shift_date, shift_period)`, but the remaining frequently-queried tables do not have matching composite indexes.

The `daily_restock_items` and `daily_manual_restock_items` tables also lack dedicated unit-shift indexes beyond their primary keys, affecting polling queries run every 15 seconds.

Without these indexes, queries resort to full table scans, which become increasingly expensive as historical records accumulate across shifts.

## Goals / Non-Goals

**Goals:**
- Add composite B-tree indexes on `(unit_id, shift_date, shift_period)` for `daily_unit_crews`, `daily_unit_comments`, `daily_section_comments`, `daily_restock_items`, and `daily_manual_restock_items`.
- Reduce query latency for the unit dashboard and restocking list polling.
- Zero application code changes.

**Non-Goals:**
- Do not add indexes for tables not queried from the unit dashboard.
- Do not change existing unique constraints, primary keys, or foreign keys.
- Do not add partial or expression-based indexes — keep it simple.

## Decisions

### Decision 1: Composite index on `(unit_id, shift_date, shift_period)`

**Choice**: A single composite B-tree index covering all three filter columns in the order `(unit_id, shift_date, shift_period)`.

**Rationale**: Every unit dashboard query filters by all three columns together. PostgreSQL can use this single index to satisfy the full WHERE clause efficiently. Column order places the most selective qualifier (`unit_id`) first, since `shift_date` and `shift_period` typically match the current shift across many units.

**Alternatives considered**: Separate single-column indexes. Rejected because PostgreSQL would need to bitmap-scan and merge multiple indexes, adding overhead. Three individual indexes also consume more write I/O on insert/update.

### Decision 2: Use `create index if not exists` in a single migration

**Choice**: All five indexes in one migration file using `if not exists` to make it idempotent.

**Rationale**: Keeps related indexes together. The `if not exists` clause prevents errors if the migration is re-run in a branch or development environment. There is no data migration needed — indexes are purely additive.

### Decision 3: No `desc` ordering on any column

**Choice**: Default ascending order for all columns.

**Rationale**: The dashboard queries use equality filters (`=`) not range or ordering queries on these columns. Ascending is sufficient and is PostgreSQL's default.

## Risks / Trade-offs

- **Risk**: Index creation briefly locks the table. → **Mitigation**: `create index` uses `concurrently` by default in the migration tooling for small tables; these operational tables are write-light during off-peak hours. The `if not exists` guard also skips re-creation.
- **Risk**: Indexes consume additional disk space. → **Mitigation**: These are narrow indexes (three columns of UUID/date/text types), estimated at a few MB per table. Acceptable trade-off for query performance.
- **Trade-off**: Slightly slower INSERT/UPDATE on these tables due to index maintenance. → The unit dashboard reads vastly outnumber writes (mostly read-only queries plus occasional comment/crew upserts). The performance gain on reads outweighs the write overhead.

## Migration Plan

1. Apply a single migration creating all five indexes with `create index if not exists`.
2. No application deployment needed — indexes are transparent.
3. Verify indexes exist with `select indexname from pg_indexes where tablename in (...)`.
4. Rollback: `drop index if exists <index_name>` for each index.
