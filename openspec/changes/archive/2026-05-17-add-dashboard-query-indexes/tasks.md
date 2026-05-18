## 1. Migration

- [x] 1.1 Create `daily_unit_crews_unit_shift_idx` on `daily_unit_crews(unit_id, shift_date, shift_period)`
- [x] 1.2 Create `daily_unit_comments_unit_shift_idx` on `daily_unit_comments(unit_id, shift_date, shift_period)`
- [x] 1.3 Create `daily_section_comments_unit_shift_idx` on `daily_section_comments(unit_id, shift_date, shift_period)`
- [x] 1.4 Create `daily_restock_items_unit_shift_idx` on `daily_restock_items(unit_id, shift_date, shift_period)`
- [x] 1.5 Create `daily_manual_restock_items_unit_shift_idx` on `daily_manual_restock_items(unit_id, shift_date, shift_period)`

## 2. Verification

- [x] 2.1 Run `npm run lint` and fix any issues
- [x] 2.2 Run `npm run typecheck` and fix any issues
- [x] 2.3 Run `npm run build` and verify no build errors
- [x] 2.4 Verify indexes exist in the database via `pg_indexes` query
- [x] 2.5 Verify unit dashboard loads correctly with no change in rendered data
