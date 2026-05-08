## 1. Existing State and Data Rules

- [x] 1.1 Inspect current `daily_unit_comments` schema, RLS policies, Fleet Panel reads, check sheet document reads, print/PDF output, records views, and CSV exports
- [x] 1.2 Decide whether application validation is sufficient or a max-length database constraint is needed
- [x] 1.3 Add a migration only if needed for comment length or policy tightening

## 2. Comment Save/Clear Actions

- [x] 2.1 Add a server action for saving a Daily Unit Comment for the current shift using `getCurrentShift()`
- [x] 2.2 Trim whitespace and reject or clear whitespace-only comments instead of persisting blank rows
- [x] 2.3 Enforce a max comment length no greater than 2,000 characters
- [x] 2.4 Support clearing/deleting an existing comment for the current unit and shift
- [x] 2.5 Revalidate unit checksheet, Fleet Panel, records, and print paths affected by comment changes

## 3. Checksheet UI

- [x] 3.1 Load the current shift comment on unit checksheet pages
- [x] 3.2 Add one `Daily Unit Comments` section after compartments/kits on each unit checksheet
- [x] 3.3 Add multiline textarea, helper text, save button, and clear behavior
- [x] 3.4 Keep the comments UI optional and avoid changing checkoff completion workflow

## 4. Fleet Panel Display

- [x] 4.1 Verify `getFleetStatus` returns comment presence only for nonblank current-shift comments
- [x] 4.2 Verify `FleetMatrix` shows a compact comment badge/icon only when comment presence is true
- [x] 4.3 Ensure blank or cleared comments do not show a Fleet Panel badge

## 5. Records, Print, PDF, and Exports

- [x] 5.1 Add saved comments to Past Checkoff Records unit-day data when present
- [x] 5.2 Display comments in records views only when nonblank
- [x] 5.3 Include a comment column in simple records CSV export with blanks for missing comments
- [x] 5.4 Verify printed checksheets and daily PDF/email reports render saved comments and omit blank comment sections
- [x] 5.5 Preserve historical comment display by querying comments by unit/date/shift rather than current unit status

## 6. Verification

- [x] 6.1 Verify saving a nonblank multiline comment shows it on Fleet Panel, print/PDF, records, and CSV
- [x] 6.2 Verify clearing a comment hides it from Fleet Panel, print/PDF, records, and CSV output content
- [x] 6.3 Verify whitespace-only comments are not persisted as visible comments
- [x] 6.4 Verify no QR, compartment check, crew lock, unit status, archive summary, or completion logic changed
- [x] 6.5 Run typecheck and lint
