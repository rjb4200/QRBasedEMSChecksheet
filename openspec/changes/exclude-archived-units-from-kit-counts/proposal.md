## Why

The Admin Kits page counts all `unit_kits` relationships regardless of whether the unit is archived. This overstates operational attachment counts — e.g., showing "21 attached units" when only 7 are active. Archived relationships must be preserved historically but filtered from operational UI.

## What Changes

- Query only active units (`units.deleted_at IS NULL`) for kit attachment counts on `/admin/kits`
- Filter archived units from attached-unit name lists
- Preserve all existing `unit_kits` rows — no data deletion

## Capabilities

### New Capabilities

- None (bug fix — operational filtering)

### Modified Capabilities

- None

## Impact

- `src/app/admin/kits/page.tsx` — Update query and list rendering to filter archived units
- No database changes, no new dependencies
