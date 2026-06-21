## GitHub Issue

Fixes #111: Add automated tests for Daily Readiness completion and grouping.

## Root Cause

Daily Readiness completion values and trend groups are derived from several sources, including ledgers, checks, crews, archives, and unit status. The pure calculation path did not have enough fixture coverage for known regression scenarios where valid completion data could be grouped incorrectly.

## Proposed Solution

- Add unit tests for `buildLedgerBackedDailyUnitRecords()` and `groupDailyUnitRecords()`.
- Use local fixtures only; do not depend on live Supabase data.
- Cover the known 2026-06-07 and 2026-06-06 style completion scenarios.
- Cover out-of-service units, archived units, crew lock contribution, partial completion, and zero-date groups.

## Scope

- Test-only changes under `src/lib`.
- No business rule changes.

## Non-Goals

- No browser E2E tests.
- No live database access.
- No schema, RLS, API, or UI changes.
- No change to the strict completion rule.

## Risk Assessment

- Regression risk: Very low. Test-only.
- Verification risk: Low. Tests run through Vitest using deterministic fixtures.

## Verification Plan

- Run the new focused test file.
- Run `npm run typecheck`.
- Run the broader test suite if feasible.

## Rollback Plan

Revert the new tests and OpenSpec archive. No runtime state or database changes are involved.
