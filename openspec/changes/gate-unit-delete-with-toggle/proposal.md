## Why

The unit delete action on `/admin/units` is a single-click form submission with no confirmation. Accidentally clicking the trash icon immediately archives the unit. A destructive actions toggle at the top of the page, combined with a two-step delete confirmation, creates layered safety without slowing down intentional workflows.

## What Changes

- Move the Create unit form to the bottom of the page.
- Add a destructive actions toggle at the top of the page that gates all delete icons.
- Hide delete icons when the toggle is off, show them when on.
- Add a two-step delete confirmation: clicking the trash icon reveals a red "Delete?" button and a cancel button.
- Reset the toggle and confirm state on each page reload.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `unit-configuration`: Unit delete action requires a global destructive actions toggle and a two-step per-row confirmation.

## Impact

- Affects `src/app/admin/units/page.tsx` and may require a new client component for the delete confirmation.
- No API or database changes.
