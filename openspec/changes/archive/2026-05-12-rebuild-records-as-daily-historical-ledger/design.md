## Context

Records currently lives under the admin archive flow and builds unit-day rows from `daily_unit_ledgers`, `shift_archives`, `daily_unit_crews`, `compartment_checks`, and `daily_unit_comments`. Existing behavior already prefers ledger rows when present, but the page still presents itself as Past Checkoff Records and emphasizes completed/total counts instead of acting as the complete daily readiness record.

The new behavior should make the selected date the primary unit of navigation and make `daily_unit_ledgers` the source of truth for which units belonged to that date. Checkoff, archive, crew, exception, and comment data enrich each ledger row rather than deciding whether the unit appears when ledger rows exist.

## Goals / Non-Goals

**Goals:**
- Make Records a date-based historical ledger for daily unit readiness.
- Show all units active or out of service on the selected date when ledger rows exist.
- Classify each unit/day as checked, incomplete, not started, or not required.
- Surface exceptions, crew names, and saved daily comments on each unit/day row.
- Keep saved daily ledgers authoritative over reconstructed current-state assumptions.
- Keep fallback behavior date-specific for legacy days without ledger rows.

**Non-Goals:**
- Do not introduce a separate status timeline table.
- Do not rebuild the unit checkoff workflow beyond the data needed to display Records accurately.
- Do not change QR code, equipment baseline, or kit assignment semantics.
- Do not implement alerting, maintenance workflows, or analytics beyond the Records ledger.

## Decisions

1. Use a single selected operational date as the main Records view.

   Rationale: The requested page is a daily historical record, so the default interaction should be selecting one date and reviewing the full readiness ledger for that day. Range-based export can remain as a secondary flow if needed, but the page should not optimize for browsing many collapsed daily summaries.

   Alternative considered: Keep the current date-range accordion and add more columns. This would preserve more UI but would continue to make Records feel like a summary browser instead of the authoritative daily ledger.

2. Treat `daily_unit_ledgers` as the authoritative unit inclusion set when ledger rows exist for the date.

   Rationale: The ledger stores historical service and archived state. Live `units` data can change after the fact and must not decide whether a unit appears for a historical date.

   Alternative considered: Join current units first and overlay ledger data. This risks including units that did not exist or were not active for the selected date and conflicts with prior ledger-first requirements.

3. Derive readiness state from ledger status plus date-specific checkoff evidence.

   Rationale: A unit can be historically relevant even without an archive row. The record needs to distinguish checked, incomplete, not started, and not required, which are display/readiness states rather than separate unit identities.

   Proposed state mapping:
- `not_required`: ledger unit status is out of service, archived for that date, or otherwise marked not required for daily checks.
- `not_started`: unit was required and no date-specific check, crew lock, archive, or activity exists.
- `incomplete`: unit was required and has some date-specific activity but does not meet the completion threshold.
- `checked`: unit was required and meets the completion threshold.

   Alternative considered: Continue using only archive status and completion percentage. That hides the difference between not started and not required and makes out-of-service units look like missing work.

4. Enrich ledger rows with related daily data keyed by unit, date, and shift period.

   Rationale: Exceptions, crew names, comments, archives, and checks are all date-specific facts. Joining by the same key preserves the historical record and avoids leaking current-unit state into past dates.

   Alternative considered: Read exceptions and comments from latest unit state. That would be faster to query but would not be historically accurate.

5. Keep fallback reconstruction limited to date-specific historical records.

   Rationale: Some older dates may not have ledger rows. Fallback should continue to assemble unit-day rows from date-specific checks, archives, crews, and comments without iterating over all current units.

   Alternative considered: Backfill or fabricate full ledgers during page load. That would make display simpler but would risk writing inaccurate historical facts outside a deliberate migration.

## Risks / Trade-offs

- Historical ledgers may be incomplete for older dates -> Keep fallback explicit, date-specific, and label missing ledger coverage instead of pretending the record is complete.
- Completion thresholds may not map cleanly to readiness state for units with zero targets -> Define not required separately from checked/incomplete and avoid counting zero-target required units as complete without evidence.
- More joins may slow Records for large ranges -> Optimize the main page for one selected date and reserve range queries for export/report paths.
- Existing CSV/print consumers may expect current fields -> Preserve existing fields where possible and add readiness-specific fields rather than removing data needed by downstream consumers.
