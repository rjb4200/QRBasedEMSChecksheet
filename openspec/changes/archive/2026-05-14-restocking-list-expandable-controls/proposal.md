## Why

The Restocking List section on the unit page currently occupies permanent vertical space with a full detail view, even when crews are not actively restocking. Making it collapsible reclaims that space on every unit page, while a quick Print button and Copy-to-clipboard action give crews immediate ways to share or capture the list when they do expand it.

## What Changes

- Remove the "Items Needing Attention" subtitle from the Restocking List on the unit page.
- Replace the always-visible detail layout with an expandable collapsed-by-default box labeled "Restocking List" with a chevron or toggle hint.
- Add a Print button and a Copy-to-clipboard button inside the expanded Restocking List content.
- Hide the Print and Copy buttons when the box is collapsed.
- No changes to restocking data generation, exception logic, or other display surfaces (print/PDF/records).

## Capabilities

### New Capabilities

### Modified Capabilities
- `automatic-restocking-list`: Restocking List section on the unit page becomes an expandable collapsed-by-default box with Print and Copy actions visible only when expanded.

## Impact

- `src/app/units/[id]/page.tsx` restocking list JSX and likely a new client component for the expand/copy/print behavior.
- No database schema changes.
- No changes to checkoff form, records pages, print/PDF/email outputs, or exception logic.
