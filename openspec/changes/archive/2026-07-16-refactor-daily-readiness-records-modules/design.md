## Context

Daily Readiness records currently center on `src/lib/archive-records.ts`, a single module that exports public types and functions while also containing internal Supabase row types, date helpers, ledger-backed builders, fallback reconstruction, grouping/trend logic, CSV export, and restocking integration.

Existing consumers import from `@/lib/archive-records` across the Records page, print/export routes, PDF generation, export packages, chart components, checksheet views, and tests. The refactor needs to improve maintainability without forcing broad page churn or changing user-facing records behavior.

The `Last 14 Days Check Completion` chart is currently reported as broken. The chart path is adjacent to this refactor because `getTrendGroups` lives in `archive-records.ts`, but fixing the chart can change observed counts. The chart should be investigated during extraction, with any fix kept narrow and covered by focused tests.

## Goals / Non-Goals

**Goals:**

- Reduce `archive-records.ts` into a stable facade over smaller records-focused modules.
- Make pure Daily Readiness record construction and grouping importable without database access.
- Separate Supabase query/read-model code from pure calculation, grouping, CSV export, and restocking derivation.
- Preserve current public function names and exported type names during the refactor.
- Preserve current Records page, CSV/export, PDF/print, restocking list, and archive behavior.
- Investigate the broken trend chart and apply a fix only when the root cause is isolated and low risk.

**Non-Goals:**

- Redesign the Records UI.
- Change database schema.
- Rework Daily Readiness business rules as part of modularization.
- Rename public imports across the app unless there is a clear benefit after the facade is in place.
- Fold broad trend-chart semantic changes into this refactor without tests and explicit scope.

## Decisions

1. Keep `src/lib/archive-records.ts` as the public facade.

   Rationale: Existing imports are spread across pages, PDF/export code, chart components, and tests. Keeping the facade reduces integration risk and lets the refactor focus on internal boundaries. The alternative is to update every consumer to import from new modules immediately, but that increases churn without improving behavior.

2. Create records-focused modules under `src/lib/records`.

   Rationale: A dedicated folder makes the Daily Readiness records domain visible and avoids further expanding `src/lib`. Candidate module boundaries are `types.ts`, `date-range.ts`, `daily-record-builder.ts`, `daily-record-queries.ts`, `daily-record-groups.ts`, `daily-record-export.ts`, and `daily-record-restocking.ts`. Exact names may vary if implementation reveals cleaner boundaries.

3. Extract pure logic before query orchestration.

   Rationale: The existing tests already cover `buildLedgerBackedDailyUnitRecords` and `groupDailyUnitRecords`. Moving pure functions first gives fast verification and reduces the chance of database-query changes masking calculation regressions.

4. Preserve known behavior unless explicitly fixed.

   Rationale: There are existing sharp edges, including a likely threshold mismatch between grouped records and trend groups. The refactor should not accidentally change those semantics. If the chart bug is fixed, the change should be isolated, documented in tests, and limited to the broken chart path.

5. Treat restocking derivation as part of record construction, not export formatting.

   Rationale: Records views, CSV exports, PDFs, and export packages all consume `DailyUnitRecord.restockingList`. Keeping derivation near record building preserves the shared read model and avoids duplicating restocking rules in output-specific modules.

## Risks / Trade-offs

- Behavior drift while moving code -> Keep public facade exports stable and run focused tests after each extraction boundary.
- Circular imports between records modules -> Keep shared types in `types.ts` and internal query row shapes in a separate query/read-model module.
- Trend chart fix expands beyond refactor scope -> Gate any chart fix behind a focused failing test or clearly isolated root cause; otherwise leave a follow-up task.
- Restocking output changes during extraction -> Preserve `DailyUnitRecord.restockingList` shape and existing `archiveRecordToCsv` output fields.
- False confidence from pure tests only -> Run typecheck and relevant app tests after extraction, because query modules are mostly integration paths.

## Migration Plan

1. Add `src/lib/records` modules and move code without changing exported names from `@/lib/archive-records`.
2. Update `archive-records.ts` to re-export types/functions and delegate implementation to the new modules.
3. Run focused Daily Readiness tests after moving pure builders and grouping.
4. Run full test/typecheck/lint verification once query and export modules are extracted.
5. If the trend chart root cause is isolated, add or update focused tests and apply the narrow fix; otherwise document the follow-up.

Rollback is straightforward: because public imports stay on `archive-records.ts`, reverting the extraction restores the previous single-file implementation without database or schema changes.

## Open Questions

- Is the trend chart broken because of the `>85` trend threshold, stale/missing ledger refresh behavior, query shape differences, or client display logic?
- Should trend chart semantics eventually share the same grouped-record completion helper, or should chart coloring/completion thresholds remain separate concepts?
- Should multi-day exports fetch item catalogs for restocking parity with selected-date records, or is the current difference intentional and out of scope?
