## Why

Large compartments and kits now contain long equipment lists that are difficult to scan during administration and crew checkoff. Collapsible item groups provide a visual organization layer inside a single checkoff target without changing QR, completion, or check submission behavior.

## What Changes

- Add item groups for unit compartments.
- Add item groups for shared kits.
- Allow admins to create, rename, delete, reorder, and assign items to groups.
- Render grouped items as collapsible sections in admin and crew checkoff UIs.
- Keep groups presentation-only: they do not create checkoff targets, QR codes, completion states, fleet counts, or new check records.
- Preserve group relationships during compartment copy/import, compartment-to-kit copy, kit-to-compartment clone, and unit copy flows.
- Existing ungrouped items continue to work and render normally.

## Capabilities

### New Capabilities

- `collapsible-item-groups`: Defines visual item grouping behavior for compartment and kit equipment lists.

### Modified Capabilities

- `shared-kits`: Assigned kits can contain visual item groups, and kit copy/clone workflows preserve group relationships.

## Impact

- Supabase schema: new group tables for compartments and kits, plus nullable group references on item rows.
- Admin unit detail page and unit actions for compartment item group management.
- Admin kit pages and kit actions for kit item group management.
- Crew compartment and kit checkoff pages/forms for grouped rendering.
- Copy/import/clone workflows that duplicate compartment or kit layouts.
- No change to checkoff payload shape, QR routes, fleet counts, archives, or completion logic.
