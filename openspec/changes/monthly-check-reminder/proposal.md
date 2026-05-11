## Why

Crews need a clear reminder when a unit's monthly check is due. Currently the checkoff workflow is focused on daily checks only — if a unit has a monthly check due, there's no visible reminder on the unit check sheet or compartment check pages where crews are already working.

## What Changes

- Add `monthly_check_day` nullable integer field to `units` table (1-31 or null)
- Add the field to the admin unit add/edit form with validation
- Show an amber reminder banner at the top of unit check sheet pages when today matches the configured day
- Show the same banner on each compartment check page for that unit
- Handle short months: 29th/30th/31st fall back to the last day of the month
- Use `America/New_York` timezone for date comparison

## Capabilities

### New Capabilities

- `monthly-check-reminder`: Configurable monthly check day per unit with crew-facing reminder banner

### Modified Capabilities

- None

## Impact

- Database: Add `monthly_check_day` column to `units` table with check constraint
- `src/app/admin/units/[id]/page.tsx`: Add monthly check day field
- `src/app/admin/units/actions.ts`: Update save/update handlers
- `src/app/checkoff/[unitId]/[compartmentId]/page.tsx`: Show reminder banner
- `src/app/checkoff/[unitId]/kit/[unitKitId]/page.tsx`: Show reminder banner
- `src/app/units/[id]/page.tsx`: Show reminder banner (unit check sheet)
- New file: `src/lib/monthly-check.ts` — date logic helper
- New file: `src/components/monthly-check-banner.tsx` — banner component
