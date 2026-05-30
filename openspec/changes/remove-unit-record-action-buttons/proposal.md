## Why

Each unit record card on the Records page displays a "No archive" (or "View") link and a "Print" button. These are redundant — the "Print Daily Record" button at the top of the page already prints all units for the selected date, and the archive viewer is accessible through the fleet dashboard, not individual Records page cards. Removing them reduces visual noise and simplifies the card layout.

## What Changes

- Remove the per-unit "View" / "No archive" link from each unit record card
- Remove the per-unit "Print" button from each unit record card
- The "Print Daily Record" button in the filter form remains and continues to print the full daily record

## Capabilities

### Modified Capabilities

- `archive-history`: Per-unit action buttons removed from record cards

## Impact

- **Modified**: `src/app/admin/archives/page.tsx` — remove `<div>` containing the "View"/"No archive" and "Print" buttons from each unit card
