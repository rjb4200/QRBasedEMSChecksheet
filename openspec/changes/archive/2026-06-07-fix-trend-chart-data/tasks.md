## 1. Data Function

- [x] 1.1 Create `getTrendGroups()` function that queries `daily_unit_ledgers`, `compartment_checks`, and `daily_unit_crews` for a 14-day range
- [x] 1.2 Compute `completedInServiceUnits` using the `> 95%` rule directly from ledger totals + check status counts + crew lock state
- [x] 1.3 Return `DailyRecordGroup[]` matching the existing type so `CompletionTrendChart` needs no changes

## 2. Page Integration

- [x] 2.1 Replace the second `getDailyUnitRecords({})` call in `src/app/admin/archives/page.tsx` with `getTrendGroups()`
- [x] 2.2 Remove the unused `records` destructuring from the trend chart call

## 3. Verification

- [x] 3.1 Run the production build
- [ ] 3.2 Verify chart no longer shows 0/6 when completed checks exist
- [ ] 3.3 Verify the records list still works correctly (unaffected by chart changes)
- [ ] 3.4 Verify unit filter does not affect the chart (fleet-wide remains)
