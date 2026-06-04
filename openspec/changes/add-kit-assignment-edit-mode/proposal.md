## Why

The Admin Kits page currently shows assigned units as a read-only text list. Admins must navigate to the Units page to add or remove kit assignments. Adding edit-mode management directly on the Kits page provides a more efficient workflow for managing which units carry each kit.

## What Changes

- Add an "Edit Assignments" toggle to the Assigned Units panel on each kit card.
- In edit mode, show all active units with checkboxes — assigned checked, unassigned unchecked.
- Stage checkbox changes as pending additions and removals without saving immediately.
- Show pending changes with a summary before applying.
- Apply requires confirmation and saves all staged changes in one action.
- Cancel discards pending changes and returns to read-only mode.
- Reuse existing `assignKitToUnit` / `removeKitFromUnit` server actions.
- Preserve existing kit content, checkoff behavior, historical records, and unit-side assignment management.

## Capabilities

### New Capabilities
- `kit-assignment-edit-mode`: The Admin Kits page supports staged edit-mode management of unit assignments per kit.

### Modified Capabilities
- `shared-kits`: Kit assignment management is now available directly from the Kits page.

## Impact

- **New component**: Client component for the assignment editor on each kit card.
- **Kits page**: Updated to include the assignment editor.
- **Server actions**: Reuses existing `assignKitToUnit` and `removeKitFromUnit` from `admin/units/actions.ts`.
- **Behavior**: No changes to checkoff, records, QR/NFC, kit contents, or unit-side assignment management.
