## Why

When printing daily checksheets, OOS (Out of Service) and archived units should not appear on the printout. These units are not actively in service and including them on daily printouts creates confusion and unnecessary paper waste.

## What Changes

- Exclude archived units (tracked by `deleted_at` / archived ledger state) from daily checksheet print output
- Exclude OOS units (where `status = out_of_service`) from daily checksheet print output
- Only active in-service, non-archived units should appear on printed checksheets

## Capabilities

### New Capabilities

- `print-exclusion-filters`: Filter logic to exclude archived and OOS units from daily checksheet print generation.

### Modified Capabilities

- None. This is a modification to existing print functionality without changing core requirements.

## Impact

- Updates to checksheet print document generation to filter out archived and OOS units
- Uses existing `deleted_at` and `status` fields on units, plus archived ledger state when available
- No database changes required
