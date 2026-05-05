## Why

The database currently contains early/default unit and equipment data that should be replaced with a clean EC4 operational checksheet. A destructive reset followed by a controlled seed creates a known baseline for the apparatus layout and equipment catalog.

## What Changes

- **BREAKING**: Delete existing operational layout/check data, including units, compartments, checks, archives, crews, ledgers, kits, equipment catalog rows, templates, and template contents.
- Preserve authentication and admin login data, including users, user roles, and admin users.
- Create a new EC4 unit.
- Seed EC4 compartments from the provided apparatus checklist.
- Seed equipment catalog rows and assign them to EC4 compartments with sort order, par levels where available, input type, and subcategory where applicable.

## Capabilities

### New Capabilities

- `ec4-equipment-baseline`: Defines the reset and seeded EC4 equipment baseline behavior.

### Modified Capabilities

- `shared-kits`: No requirement change; kits are cleared as operational layout data during the reset.

## Impact

- Supabase production data in operational layout/check tables.
- Admin Units, Equipment, Templates, Kits, crew checkoff, fleet, QR, records, and reporting pages will reflect only the newly seeded EC4 layout afterward.
- No schema changes are required.
