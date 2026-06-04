## 1. Data Model

- [x] 1.1 Add `generalComments` and `exceptionCounts` fields to the report type and query.
- [x] 1.2 Query `daily_unit_comments` for the report date alongside existing queries.
- [x] 1.3 Compute per-unit exception counts from discrepancy data.

## 2. Email Body

- [x] 2.1 Replace per-item exception lines with per-unit exception counts.
- [x] 2.2 Build per-unit HTML cards with status badges, completion stats, and progress bars.
- [x] 2.3 Group general and section comments together under each unit card.
- [x] 2.4 Display complete units as compact green cards.
- [x] 2.5 Add a summary stats line at the top of the email.

## 3. Tests

- [x] 3.1 Update or add tests for the new report data shape.
- [x] 3.2 Update or add tests for the new email body format.

## 4. Verification

- [x] 4.1 Run TypeScript typecheck.
- [x] 4.2 Run existing report and email tests.
