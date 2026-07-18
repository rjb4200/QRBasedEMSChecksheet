## Why

The Daily Check Work Completion trend displays stale early-day values even though the live EMS database contains the correct completed check rows. For example, direct production queries return 57/160 for 2026-07-17 and 109/187 for 2026-07-18, while the Records page displays only the locked-crew portions of those totals.

## What Changes

- Ensure the Records page and its work-completion aggregate bypass framework and data caching so each request reads current production ledger, check, and crew rows.
- Preserve the existing ledger-based denominator and normalized target-identity calculation.
- Add regression coverage for fresh current-day results with normalized compartment and kit targets.
- Verify the deployed trend against known production dates after release.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `daily-check-work-completion-trend`: Require the trend to use fresh request-time data rather than an early cached response.

## Impact

- Updates the Records page rendering and trend data-fetching path.
- Does not change database schema, stored check data, daily ledgers, or fleet business rules.
- Adds focused freshness and production-comparison verification.
