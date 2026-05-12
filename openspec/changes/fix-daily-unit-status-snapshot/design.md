## Context

`daily_unit_ledgers.unit_status` should carry the unit's operational status for historical records. Currently it can be null/blank, causing the Records page to show "unknown".

## Goals / Non-Goals

**Goals:**
- New ledger rows always include `unit_status`
- Records page falls back to `units.status` when ledger status is blank
- Backfill existing null/unknown statuses

**Non-Goals:**
- No schema changes
- No archive or checkoff logic changes

## Decisions

1. **Populate status at ledger creation** over post-hoc backfill
   - The `upsertTodayUnitLedger` and shift-reset functions are the insertion points

2. **Fallback in archive-records** for display safety
   - `ledger.unit_status || unit.status || "unknown"`

3. **Backfill via migration** for existing data

## Risks

- **[Risk] Backfilled historical data uses current status** → Acceptable; no historical status was snapshot before this fix
