## 1. Module Structure

- [x] 1.1 Create a records-focused module folder under `src/lib/records`.
- [x] 1.2 Move public Daily Readiness record types into a records `types` module.
- [x] 1.3 Keep `src/lib/archive-records.ts` exporting the same public functions and types used by existing consumers.

## 2. Pure Logic Extraction

- [x] 2.1 Move date-range helpers and archive-range parsing into a focused date/range module.
- [x] 2.2 Move ledger-backed Daily Unit Record construction into a pure builder module.
- [x] 2.3 Move fallback record reconstruction helpers into a pure or read-model-focused module without changing fallback behavior.
- [x] 2.4 Move grouping and completion-summary helpers into a grouping module.
- [x] 2.5 Move restocking/exception derivation helpers into a records restocking module while preserving `DailyUnitRecord.restockingList` output.

## 3. Query And Export Extraction

- [x] 3.1 Move Supabase query orchestration for selected-date and range records into a query/read-model module.
- [x] 3.2 Move trend-group query logic into a trend or grouping-related module.
- [x] 3.3 Move CSV formatting into an export module that operates on `DailyUnitRecord[]`.
- [x] 3.4 Update the facade in `archive-records.ts` to delegate to the extracted modules.

## 4. Trend Chart Investigation

- [x] 4.1 Inspect the `Last 14 Days Check Completion` data path after trend extraction and identify whether the broken chart is caused by query shape, ledger refresh behavior, threshold mismatch, or display logic.
- [x] 4.2 If the root cause is isolated and low risk, add focused test coverage and apply the narrow chart fix.
- [x] 4.3 If the root cause is not isolated or would require broader business-rule changes, preserve current behavior and document a follow-up issue/change.

## 5. Verification

- [x] 5.1 Run the focused Daily Readiness records tests.
- [x] 5.2 Run full test suite.
- [x] 5.3 Run typecheck.
- [x] 5.4 Run lint.
- [x] 5.5 Confirm no existing `@/lib/archive-records` consumers require import changes.
