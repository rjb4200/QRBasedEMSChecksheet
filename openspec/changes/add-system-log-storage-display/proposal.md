## Why

The Fleet Panel has a storage warning banner at 90%+, but there is no always-visible storage usage display anywhere in the admin area. The System Log page is the natural home for system health information, and admins should be able to check database usage without waiting for a warning threshold to be crossed.

## What Changes

- Add a compact database usage display to the System Log page between the page title and the filter form.
- Show percentage used, MB used / MB limit on a single line.
- Show a "Last checked" timestamp with date and time.
- Color-code the text based on usage thresholds.
- Reuse the existing `getDatabaseUsage()` helper and `get_database_size()` Postgres function.
- Display read-only; no export, delete, or rotation behavior.

## Capabilities

### New Capabilities
- `system-log-storage-display`: The System Log page shows current database storage usage percentage and MB details with color-coded severity.

### Modified Capabilities
- `storage-capacity-monitoring`: Database usage is now visible on the System Log page in addition to the Fleet Panel warning banner.

## Impact

- **Updated**: `src/app/admin/system-log/page.tsx` — add usage display card.
- **Reuses**: `src/lib/database-usage.ts` — existing `getDatabaseUsage()` helper.
- **Behavior**: No changes to checkoff, records, email, or any operational behavior.
