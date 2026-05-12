## 1. Data Model And Queries

- [ ] 1.1 Audit Records data dependencies in `src/lib/archive-records.ts`, archive exports, print links, and related admin routes.
- [ ] 1.2 Update the Records query shape to load one selected operational date by default while preserving any required export/range entry points.
- [ ] 1.3 Make ledger rows the authoritative unit inclusion source whenever `daily_unit_ledgers` exists for the selected date.
- [ ] 1.4 Add date-specific enrichment for archive metadata, check rows, exceptions, daily crew names, and daily unit comments keyed by unit/date/shift period.
- [ ] 1.5 Keep missing-ledger fallback reconstruction limited to date-specific checks, archives, crews, and comments.

## 2. Readiness Classification

- [ ] 2.1 Add a unit readiness state field with checked, incomplete, not started, and not required values.
- [ ] 2.2 Classify out-of-service, archived, or otherwise not-required ledger rows as not required.
- [ ] 2.3 Classify required units with no date-specific activity as not started.
- [ ] 2.4 Classify required units with partial activity below the completion threshold as incomplete.
- [ ] 2.5 Classify required units above the completion threshold as checked.
- [ ] 2.6 Update summary totals to count readiness states and exclude not-required units from checked-over-required completion totals.

## 3. Records Page UI

- [ ] 3.1 Rename and reframe the admin Records page copy as a daily historical readiness ledger.
- [ ] 3.2 Replace the primary range-first summary interaction with a selected-date-first ledger view.
- [ ] 3.3 Render every ledger-backed unit row for the selected date, including units with no archive/checkoff record.
- [ ] 3.4 Display readiness state, unit status, snapshot/status note, crew names, comments, exceptions, timing, checked-by, and detail links where available.
- [ ] 3.5 Show an explicit missing-ledger or best-effort indicator when the selected date has no ledger coverage.

## 4. Exports And Outputs

- [ ] 4.1 Update CSV export fields to include readiness state and exception details while preserving existing historical fields.
- [ ] 4.2 Verify print/checksheet links still target the selected date and do not imply missing units were checked.
- [ ] 4.3 Confirm downstream consumers display saved crew names and comments only when present.

## 5. Ledger Snapshot Coverage

- [x] 5.1 Review shift reset and same-day status update paths to ensure active and out-of-service units receive daily ledger rows.
- [x] 5.2 Ensure out-of-service units remain visible in daily ledgers so Records can classify them as not required.
- [x] 5.3 Avoid adding a new timeline table or non-date-scoped historical state source.

## 6. Verification

- [ ] 6.1 Add or update tests for ledger-backed Records including checked, incomplete, not started, and not required units.
- [ ] 6.2 Add or update tests for missing-ledger fallback using only date-specific historical data.
- [ ] 6.3 Add or update tests for exceptions, crew names, and comments on Records rows and exports.
- [x] 6.4 Run the project lint/typecheck/test commands available in the repository.
