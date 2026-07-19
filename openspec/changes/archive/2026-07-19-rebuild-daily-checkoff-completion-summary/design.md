## Context

The production database correctly holds raw completed check rows, but the Records trend reconstructs a day at read time from `daily_unit_ledgers`, `compartment_checks`, and `daily_unit_crews`. The chart consequently depends on mutable source data, page-triggered ledger refreshes, application aggregation, and caching behavior. `shift_archives` has no production rows, so there is no immutable final result to read.

The rebuild treats daily completion as an operational accounting problem: determine the required actions once, record each action's disposition, and maintain a database-owned summary from those facts.

## Goals / Non-Goals

**Goals:**

- Establish one auditable source of truth for required and completed Daily Readiness actions.
- Freeze the target set at day opening while allowing explicit, attributable exceptions.
- Keep the current-day result current after every check or crew write.
- Preserve a final historical result independent of later unit, kit, or target changes.
- Expose both action progress and fully complete unit counts.

**Non-Goals:**

- Reconstruct historical target manifests as if they were immutable before this cutover.
- Change checkoff form UX or Fleet Matrix behavior in the first release.
- Automatically excuse work merely because a unit's current status changes.
- Add polling, browser-side aggregation, or a charting dependency.

## Decisions

### Snapshot required actions at day opening

Create a `daily_checkoff_targets` manifest for every in-service unit's compartment, kit, and one crew-confirmation action. A database function initializes the manifest transactionally at the operational day boundary and is idempotent so check writes can ensure it exists if the scheduled invocation is delayed.

Rationale: a count-only ledger cannot explain what was required, and current unit configuration must not rewrite a historical denominator.

Alternative considered: calculate the denominator from live units and targets on every page request. Rejected because target and service-status changes silently alter historical results.

### Maintain an authoritative day summary in the database

Store `daily_checkoff_summaries` per day, including required/completed actions, required/completed units, summary state, and timestamps. Database triggers or shared database functions recalculate the affected day after a check, crew lock, or manifest disposition changes.

Rationale: completion is derived once from database facts, not separately in the page, email, dashboard, and exports. Recalculation avoids counter drift when a record is edited.

### Require explicit excusal for mid-day availability changes

Targets start as `required`. A supervisor action can mark remaining targets for a unit `excused` with a reason, actor, and timestamp. An out-of-service status change alone does not alter an already-open day's denominator.

Rationale: a meaningful historical number needs an explanation for every denominator change. This permits operational flexibility without silently erasing required work.

### Make summary status visible

Days created after cutover are `live` until finalized, then `finalized`. Earlier dates may be backfilled from raw data but are labeled `reconstructed`, not final. The trend displays action progress and fully complete unit counts with the summary status.

Rationale: readers must know whether a number is an authoritative final result or a best-effort legacy calculation.

## Risks / Trade-offs

- [Day-opening scheduler misses its boundary] -> The initialization function is idempotent and invoked by check/crew writes as a fallback; alert on delayed initialization.
- [Existing writes bypass summary maintenance] -> Centralize writes through the atomic check RPC and crew write path, and use database triggers as a final guard.
- [Historical data cannot prove original required targets] -> Backfill only as reconstructed and begin final authoritative history at cutover.
- [Explicit excusal adds supervisor work] -> Provide a focused unit-level action with reason presets and show excused work separately from completed work.
- [Summary and manifest diverge] -> Add an admin reconciliation query that recomputes a day from the manifest and flags mismatches.

## Migration Plan

1. Add manifest, summary, and excusal schema with database functions and indexes.
2. Backfill recent raw history as `reconstructed`; do not mark it finalized.
3. Initialize the current operational day and validate its summary against raw check data before enabling the new trend.
4. Route check and crew writes through summary maintenance and deploy the new trend alongside the old one behind a short validation period.
5. Replace the raw-table trend after production totals match for several operational days.
6. Retain raw operational records and existing Records cards; retire the old trend helper only after the new ledger is authoritative.

Rollback: switch the trend back to the current raw aggregate without deleting manifests or summaries. The new tables are additive and preserve audit data.
