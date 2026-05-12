## 1. Fix ledger creation

- [ ] 1.1 Verify `daily-unit-ledgers.ts` upsert includes `unit_status`
- [ ] 1.2 Verify shift-reset edge function includes `unit_status`

## 2. Fix Records page fallback

- [ ] 2.1 Update `archive-records.ts` to fall back to `units.status` when ledger status is blank

## 3. Backfill existing data

- [ ] 3.1 Run migration to populate missing unit_status in existing daily_unit_ledgers rows

## 4. Verify

- [ ] 4.1 Run typecheck and build
- [ ] 4.2 Verify Records page no longer shows "unknown"
- [ ] 4.3 Commit and push
