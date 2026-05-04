## Why

The fleet needs a way to handle units that are sold, stored, or otherwise removed from active service without losing their historical data. Currently, deleting units removes them from history, and there is no way to hide units from the fleet panel while preserving their compartment layout for potential reactivation. Additionally, OOS (Out of Service) units need clear visual distinction from active units.

## What Changes

- Add archive functionality to units with an `archived_at` timestamp column
- Archived units excluded from fleet panel, daily checksheet prints, and new record counts
- Archived units remain accessible on the units page with a greyed-out visual style
- Include an "ARCHIVED" badge on archived unit pages
- Add unarchive functionality that preserves compartment layout
- Add OOS status with distinct color styling (e.g., orange/yellow) and "OOS" badge
- OOS units shown with distinct visual style on unit page

## Capabilities

### New Capabilities

- `unit-archive`: Ability to archive and unarchive units while preserving their compartment configuration and historical records.
- `unit-oos-status`: Ability to mark units as Out of Service with distinct visual styling.

### Modified Capabilities

- None. These are net new features that don't change existing requirements.

## Impact

- New database columns: `archived_at` and `oos_at` timestamps on the `units` table
- Updates to fleet page to filter out archived units from display
- Updates to print document generation to exclude archived units
- Updates to records view to count only non-archived units
- Updates to unit detail pages to show visual styles for archived and OOS status
- Updates to unit management actions to include archive/unarchive and OOS toggle