## 1. Update Discrepancy Detection Logic

- [x] 1.1 Add condition item check in discrepancies.ts after checkbox check (around line 136)
- [x] 1.2 Handle object-type values with status field for condition items
- [x] 1.3 Set inputType to "condition" for the discrepancy record

## 2. Update Types and CSV Export

- [x] 2.1 Update CheckoffDiscrepancy type to include "condition" as inputType
- [x] 2.2 Update discrepancyRecordsToCsv to handle "Condition issue" label
- [x] 2.3 Verify CSV export shows condition discrepancies correctly

## 3. Verification

- [x] 3.1 Condition discrepancy detection logic implemented (code now handles status != OK)
- [x] 3.2 Admin dashboard now shows "Condition issue" label in UI
- [x] 3.3 Unit page now shows condition exceptions in "Exceptions for past check"