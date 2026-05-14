## Why

The Restocking List shows crew-visible deficiencies, but crews have no way to mark items as taken care of. On large apparatus, crews split restocking across multiple providers, and without a shared checklist they repeatedly check items that someone else already handled. Adding an addressed state with lightweight background polling gives crews a shared operational checklist without the complexity of realtime subscriptions.

## What Changes

- Create a `daily_restock_items` table to store addressed state per unit, date, target, and item.
- Add interactive checkboxes to each Restocking List entry so crew members can mark items addressed.
- Save addressed state to the database immediately on toggle.
- Add 15-second background polling to sync addressed state across devices viewing the same unit.
- Polling only runs when the Restocking List is expanded, the browser tab is visible, and no save operation is in progress.
- Polling must not reload the page, flicker, reset form state, or jump scroll position.
- Keep original exception data unchanged — addressed state is additive.
- Move the Restocking List to between the current progress status cards and the crew signature section on the unit page.

## Capabilities

### New Capabilities
- `shared-restocking-addressed-state`: Interactive checkboxes and cross-device sync for the Restocking List.

### Modified Capabilities
- `automatic-restocking-list`: Restocking List entries gain checkboxes, a database-backed addressed state, and 15-second polling for cross-device sync.

## Impact

- New database migration for `daily_restock_items`.
- `src/components/restocking-list-section.tsx` component updates.
- New server action or API route for toggling addressed state.
- New polling hook in the Restocking List component.
- `src/app/units/[id]/page.tsx` to pass additional context props and reorder sections.
- No changes to exception logic, print, PDF, or historical records in the initial version.
