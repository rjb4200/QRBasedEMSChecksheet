## Why

When printing daily checksheets, OOS (Out of Service) and archived units should not appear on the printout. These units are not actively in service and including them on daily printouts creates confusion and unnecessary paper waste.

## What Changes

- Exclude archived units (where archived_at is not null) from daily checksheet print output
- Exclude OOS units (where oos_at is not null) from daily checksheet print output
- Only active units (both archived_at and oos_at are null) should appear on printed checksheets

## Capabilities

### New Capabilities

- `print-exclusion-filters`: Filter logic to exclude archived and OOS units from daily checksheet print generation.

### Modified Capabilities

- None. This is a modification to existing print functionality without changing core requirements.

## Impact

- Updates to checksheet print document generation to filter out archived and OOS units
- Uses existing archived_at and oos_at columns on the units table
- No database changes required