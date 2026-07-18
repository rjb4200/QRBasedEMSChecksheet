## Why

The current Daily Check Work Completion trend rebuilds history from mutable ledger, check, and crew tables at page-render time. Its displayed values have become unreliable, and the intended immutable `shift_archives` history contains no rows. Administrators need an auditable daily indicator whose numerator and denominator cannot silently change or be lost to caching.

## What Changes

- Create a database-owned daily checkoff manifest that snapshots every required compartment, kit, and crew action for an operational day.
- Create one authoritative daily completion summary that records required actions, completed actions, fully complete units, and finalization state.
- Recompute the summary transactionally when a check or crew confirmation changes, rather than reconstructing it in the Records page.
- Record explicit excusal events when an in-service unit becomes unavailable during the day, including a reason and audit timestamp.
- Replace the current Records trend data path with the authoritative daily summaries and clearly label reconstructed pre-cutover history.
- Supersede `fix-archives-work-completion-freshness`; its cache-oriented approach does not establish an authoritative source of truth.

## Capabilities

### New Capabilities

- `daily-checkoff-completion-ledger`: Immutable operational-day manifest, completion summary, and excusal audit trail for Daily Readiness work.

### Modified Capabilities

- `daily-check-work-completion-trend`: Read the authoritative completion ledger and distinguish finalized from reconstructed historical values.
- `daily-readiness-ledger-records`: Align Records page history with the new authoritative daily completion source.

## Impact

- Adds database tables, functions, triggers, indexes, and a migration/backfill strategy.
- Updates the atomic check save path and crew-lock write path to maintain the summary.
- Replaces the current multi-table trend query and related presentation/tests.
- Leaves existing checkoff entry screens and Fleet Matrix behavior intact during the initial cutover.
