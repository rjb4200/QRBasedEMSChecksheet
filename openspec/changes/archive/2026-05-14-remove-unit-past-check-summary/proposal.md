## Why

The unit checkoff page currently spends space on "Exceptions for past check" and "Previous shift" summary cards that often show low-value empty states like "No previous missing or below-par items found" and "No previous shift archive found." With Unit Comments, Section Comments, and the Restocking List now providing more actionable current-shift information, removing these legacy summary cards makes the page easier to scan.

## What Changes

- Remove the "Exceptions for past check" section from the unit checkoff page.
- Remove the "Previous shift" section from the unit checkoff page.
- Stop querying previous-shift archive and previous crew data solely for those removed sections.
- Preserve current unit status cards, crew lock, Daily Unit Comments, Section Comments, and Restocking List behavior.
- Preserve historical Records/archive pages and printable reports.

## Capabilities

### New Capabilities

### Modified Capabilities
- `unit-comments`: Unit checksheet page layout no longer includes the old past-exceptions and previous-shift summary cards, keeping the comment/restocking area focused on current operational information.

## Impact

- `src/app/units/[id]/page.tsx` unit checkoff/dashboard page.
- No database schema changes.
- No changes to archive creation, historical records, print/PDF/email reports, or checkoff submission behavior.
