## Why

Administrators need a trustworthy way to see whether crews performed the checks required on each operational day. The retired unit-level completion chart cannot answer that question because a partly completed unit counts the same as a unit with no work completed.

## What Changes

- Add a fleet-wide 14-day work-completion trend to `/admin/archives` after the inaccurate predecessor has been removed.
- Measure completed required check targets, rather than fully completed units.
- Use each day's ledger snapshot to determine required work and exclude units marked out of service in that snapshot.
- Count completed check targets and locked, nonblank crew entries as completed work.
- Clearly distinguish a recorded day with zero completed work from a day whose ledger coverage is unavailable.

## Capabilities

### New Capabilities

- `daily-check-work-completion-trend`: Fleet-wide historical trend that reports the share of required Daily Readiness work completed each operational day.

### Modified Capabilities

None.

## Impact

- Adds a focused historical aggregation and a Records page presentation section.
- Reads existing daily ledgers, compartment checks, and daily crew records; no new schema, API route, or dependency is required.
- Requires focused aggregation and presentation tests for completion, out-of-service, and unavailable-day behavior.
