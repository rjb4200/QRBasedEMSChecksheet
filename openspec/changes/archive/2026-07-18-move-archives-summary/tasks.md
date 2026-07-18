## 1. Records Layout

- [x] 1.1 Move the readiness summary render into the selected-date records area, after the date label and before the unit-card grid.
- [x] 1.2 Pass the existing selected date and unit filter to the relocated summary and retain its independent Suspense fallback.
- [x] 1.3 Remove the former standalone summary placement without changing the trend, filters, export controls, or deletion workflow.

## 2. Verification

- [x] 2.1 Verify the Records page shows the date, summary, and unit cards in order for all-unit and single-unit filters.
- [x] 2.2 Run the relevant lint, type-check, and test commands for the Records page changes.
