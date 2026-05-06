## Why

The Exceptions panel on the Admin Dashboard and Unit Detail page is not showing condition items marked with non-OK status as exceptions. Condition-type items (like "Battery full and charging", "Tire pressure OK", etc.) store data as `{"value":"","status":"OK"}` objects, but the discrepancy detection logic in `src/lib/discrepancies.ts` only checks for checkbox=false (Missing) and quantity items below par. This means crew can mark condition items as "Not OK" and no exception is generated, defeating the purpose of the checkoff system.

## What Changes

- Modify `src/lib/discrepancies.ts` to detect condition items with non-OK status as exceptions
- No schema changes needed - this fixes a logic gap in existing functionality

## Capabilities

### Modified Capabilities
- `checkoff-discrepancy-detection`: Add detection of condition items with status != "OK" as exceptions ("Condition issue")

## Impact

- **Code**: `src/lib/discrepancies.ts` - add condition item check in discrepancy detection logic
- **Tests**: Should add tests for condition-based discrepancy detection
- **No API changes**: No Supabase schema changes needed