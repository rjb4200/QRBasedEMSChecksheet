## 1. Database Completion Ledger

- [x] 1.1 Add manifest, daily summary, and excusal audit schema with uniqueness constraints and indexes.
- [x] 1.2 Implement idempotent operational-day initialization that snapshots in-service compartment, kit, and crew actions.
- [x] 1.3 Implement database summary recalculation and maintenance triggers/functions for check, crew, and excusal changes.
- [x] 1.4 Add explicit supervisor excusal workflow with reason, actor, timestamp, and reconciliation coverage.

## 2. Write-Path Integration

- [x] 2.1 Update atomic check saves and crew-lock writes to ensure the daily manifest exists and summary maintenance runs transactionally.
- [x] 2.2 Add scheduled day initialization with write-path fallback and delayed-initialization monitoring.
- [ ] 2.3 Add database integration tests for initial snapshots, duplicate initialization, completion changes, crew locks, and excusals.

## 3. Records And Trend Cutover

- [x] 3.1 Add a summary read model that returns action progress, unit readiness, and summary state without raw trend reconstruction.
- [x] 3.2 Replace the Records trend with the authoritative summary and show action, unit, and summary-state breakdowns.
- [x] 3.3 Label backfilled legacy dates as reconstructed and post-cutover dates as live or finalized.
- [ ] 3.4 Add presentation and route tests proving the trend reads summaries rather than raw operational tables.

## 4. Migration And Validation

- [x] 4.1 Backfill retained historical days as reconstructed summaries and validate their action totals against raw records.
- [x] 4.2 Initialize the current day, compare summary totals with live checks and crews, and resolve discrepancies before cutover.
- [x] 4.3 Run full tests, typecheck, lint, production build, and a linked-production database reconciliation.
- [x] 4.4 Retire the superseded raw-trend implementation and archive `fix-archives-work-completion-freshness` after the authoritative trend is verified.
