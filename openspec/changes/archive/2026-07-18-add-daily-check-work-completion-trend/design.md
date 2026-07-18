## Context

The previous Records-page trend reduced each in-service unit to either complete or incomplete. That all-or-nothing result does not show how much required daily work crews actually performed. Daily unit ledgers preserve the unit service status and required target count for each operational date, while `compartment_checks` and `daily_unit_crews` retain the completed work.

This change follows `remove-records-completion-trend`. It must not reuse the retired chart helper or unit-completion definition.

## Goals / Non-Goals

**Goals:**

- Show fleet-wide Daily Readiness work completion for the latest 14 operational dates.
- Count completed check targets and valid crew locks against the work required for in-service units on each date.
- Make unavailable ledger coverage visibly different from zero work completed.
- Keep the trend server-rendered, dependency-free, and independent of the Records page unit filter.

**Non-Goals:**

- Report how many units reached full readiness.
- Change checkoff, crew-lock, ledger, archive, or data-retention behavior.
- Add per-unit trend filtering, chart interaction, a new API route, or a charting library.
- Backfill days whose ledger snapshot was not retained.

## Decisions

### Measure required work instead of fully complete units

For each date, required work is the sum of `total_compartments + 1` across daily-ledger rows whose saved `unit_status` is `in_service`. The additional one is the required locked crew-name entry. Completed work is the number of unique completed check targets for those units plus one for each locked crew entry with nonblank provider names.

Rationale: this directly measures progress through the work crews were expected to perform. The ledger preserves the expected target count and status for that date; raw completion rows preserve performed work.

Alternative considered: compute completed units over in-service units. Rejected because it treats a unit with one remaining target as equal to a unit where no target was completed.

### Exclude units out of service in the daily ledger

Only rows saved as `in_service` on that date contribute required or completed work. A unit later marked out of service is excluded if its daily ledger snapshot reflects that status.

Rationale: the metric asks whether crews completed work actually required that day. The ledger is the available date-specific source of that requirement.

Trade-off: a late status correction can change the day if the ledger refreshes, but using current unit status would incorrectly rewrite historical expectations more broadly.

### Use explicit day states

A date with no daily ledger rows is unavailable, not 0%. A date with in-service ledger rows and no completed work is 0%. A date with ledger coverage but no required work because every unit was out of service is not applicable.

Rationale: administrators must be able to distinguish missing historical evidence from documented non-completion.

### Keep the aggregate focused and defensive

The aggregate will query only the 14-day daily ledger, check, and crew rows. Completed checks will be de-duplicated by their stored target identity before counting, and counts will not exceed each date's required work.

Rationale: the current schema enforces one check per target, but defensive aggregation prevents legacy or malformed rows from reporting impossible completion percentages.

## Risks / Trade-offs

- [Historical data has been rotated] -> Render unavailable rather than reporting false zero completion.
- [A ledger target count differs from retained target rows] -> Treat the ledger as the denominator authority and cap completed work to required work.
- [A daily ledger is refreshed after a service-status change] -> Document that the saved ledger status determines whether work was required for the date.
- [Fourteen data labels are crowded on mobile] -> Use a responsive, horizontally scrollable server-rendered presentation with clear count labels.

## Migration Plan

1. Apply `remove-records-completion-trend` first.
2. Add the new aggregation, rendering section, and focused tests under the new capability.
3. Verify known dates with fully completed, partially completed, zero-completed, out-of-service, and unavailable ledger coverage.
4. Roll back by removing the new presentation and helper; no schema or data migration is involved.
