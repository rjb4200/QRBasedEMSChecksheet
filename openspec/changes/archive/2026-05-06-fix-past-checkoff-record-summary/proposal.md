## Why

Past Checkoff Records currently shows `0/0` for days with submitted check data because it depends on `daily_unit_ledgers`, and the live database has no ledger rows. The summary also counts in-service units as complete only at `100%`, but the desired operational rule is units with `>95%` checked off over units that were in service that day.

## What Changes

- Update Past Checkoff Records so historical day summaries can be derived from available checkoff data when `daily_unit_ledgers` rows are missing.
- Count an in-service unit as complete for the day when its completion percentage is greater than `95%`.
- Preserve `daily_unit_ledgers` as the preferred historical snapshot when available, because it records unit status and target totals as of reset time.
- Update shift-reset ledger creation to include all current daily check targets, including shared kit assignments and the crew-name completion target.
- Ensure `shift_archives` completion percentages are calculated with the same target-count rules used by fleet and records pages.

## Capabilities

### New Capabilities
- `past-checkoff-record-summary`: Historical fleet record summaries, including in-service unit denominators, `>95%` completion counts, and fallback behavior when ledgers are missing.

### Modified Capabilities

## Impact

- **Code**: `src/lib/archive-records.ts`, `supabase/functions/shift-reset/index.ts`, and related archive exports/print data consumers.
- **Data**: No destructive schema change required. Existing `daily_unit_ledgers`, `shift_archives`, `compartment_checks`, `daily_unit_crews`, and `units` data will be reused.
- **Behavior**: Past Checkoff Records should no longer show `0/0` solely because ledgers are absent when enough check/unit data exists to infer the day.
- **Risk**: Fallback reconstruction cannot perfectly recover historical unit status if a unit changed in/out of service after the date, so saved ledgers remain authoritative when present.
