## Why

The Records page shows "unknown" for unit status when the daily ledger snapshot is missing or blank. Unit status should be captured at ledger creation time and fall back to live status when missing.

## What Changes

- Ensure `daily_unit_ledgers.unit_status` is populated from `units.status` when creating ledger rows
- Update shift-reset edge function to include `unit_status` in ledger inserts
- Add fallback in archive-records to use live `units.status` when ledger status is blank
- Backfill existing ledger rows with missing status via migration

## Capabilities

### New Capabilities

- None (data consistency fix)

### Modified Capabilities

- None

## Impact

- `supabase/functions/shift-reset/index.ts` — Include `unit_status` in ledger insert
- `src/lib/daily-unit-ledgers.ts` — Ensure status is set on upsert
- `src/lib/archive-records.ts` — Add fallback to live unit status
- SQL backfill migration for existing rows
