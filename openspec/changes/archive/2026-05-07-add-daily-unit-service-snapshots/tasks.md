## 1. Database Schema

- [x] 1.1 Add `archived boolean not null default false` to `daily_unit_ledgers`
- [x] 1.2 Add `status_note text` to `daily_unit_ledgers`
- [x] 1.3 Apply migration to Supabase and review advisors

## 2. Daily Ledger Upsert Helper

- [x] 2.1 Create a shared helper for upserting today's `daily_unit_ledgers` row for a unit
- [x] 2.2 Include unit name, current service status, archived flag, status note, and total target count in the upsert
- [x] 2.3 Use `getCurrentShift()` so snapshots follow the 06:00 operational day

## 3. Admin Unit Mutations

- [x] 3.1 Update `toggleUnitStatus` to upsert today's ledger row after changing `units.status`
- [x] 3.2 Support an optional short `status_note` when toggling status if present in form data
- [x] 3.3 Update `deleteUnit` to upsert today's ledger row with `archived = true` and out-of-service status
- [x] 3.4 Revalidate affected Fleet Panel/admin paths after ledger updates

## 4. Fleet Panel Snapshot Preference

- [x] 4.1 Update `getFleetStatus` to query today's `daily_unit_ledgers`
- [x] 4.2 Prefer ledger status, archived flag, and status note when today's ledger rows exist
- [x] 4.3 Preserve current `units.status` fallback when today's ledger rows do not exist
- [x] 4.4 Ensure OOS ledger units remain visible but are not treated as missing in-service checkoffs

## 5. Archive Records

- [x] 5.1 Extend archive record types and ledger query with `archived` and `status_note`
- [x] 5.2 Display archived flag and status note in Past Checkoff Records where useful
- [x] 5.3 Include archived flag and status note in simple CSV export
- [x] 5.4 Update `shift-reset` ledger creation to write `archived = false` and empty status note for active units

## 6. Verification

- [x] 6.1 Verify setting a unit OOS creates or updates today's ledger snapshot
- [x] 6.2 Verify returning a unit to service updates today's ledger snapshot
- [x] 6.3 Verify archiving a unit marks today's ledger row `archived = true`
- [x] 6.4 Verify Fleet Panel falls back to live units when no ledger exists
- [x] 6.5 Run typecheck and lint
