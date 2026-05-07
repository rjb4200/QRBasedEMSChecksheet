## Context

The recent fix-past-checkoff-record-summary change added missing-ledger fallback to prevent `0/0` displays. However, the implementation seeds `fallbackUnits` with all current units from `unitRows`, causing historical dates to show units that weren't in service on that date.

For example, if a unit (like EC4) was out of service in 2025 but is now in service today, a date in 2025 would incorrectly include EC4 in the historical summary.

Current code in `src/lib/archive-records.ts`:
```ts
const fallbackUnits = new Map<string, UnitRow>();
for (const unit of unitRows) {
  fallbackUnits.set(unit.id, unit);
}
```

This iterates ALL current units for every historical date without ledgers.

## Goals / Non-Goals

**Goals:**
- Historical in-service counts reflect units that were actually in service on that date.
- Fallback records come only from date-specific data (`shift_archives`, `compartment_checks`, `daily_unit_crews`).
- Never show units in historical summaries just because they're in service today.

**Non-Goals:**
- Do not change the ledger-authoritative behavior when ledgers exist.
- Do not change the `>95%` completion threshold (already implemented).
- Do not change current fleet matrix behavior.

## Decisions

**Decision: Stricter fallback - only date-specific records.**

When no ledger exists for a date:
1. First, collect all units with actual checkoff/crew data for that date.
2. Include units from `compartment_checks` for that date.
3. Include units from `shift_archives` for that date.
4. Include units from `daily_unit_crews` for that date.
5. Never seed with all current units.

This still allows showing historical data while excluding units that only have current status.

**Decision: Status assignment.**

For fallback records:
- Use known historical status from archive if available.
- Otherwise use `"unknown"` - do not assume current status.

## Risks / Trade-offs

- **Less data shown**: Some dates may show fewer units than before when no ledger exists.
  - This is correct behavior - we shouldn't pretend units were there if they had no records.
- **Unknown status handling**: Need to ensure UI handles `"unknown"` status gracefully.
  - Unknown status units won't count toward completion totals (correct).

## Migration Plan

1. Update `src/lib/archive-records.ts` fallback logic.
2. Verify CSV export matches.
3. Test with past dates.
4. No schema changes needed.