## Why

Several admin pages still use text-based action buttons for edit, delete, save, cancel, and filter actions. The shared `src/components/icons.tsx` already provides standard SVG icon components for these actions, but they are not consistently applied. Establishing the icons as the definitive pattern ensures visual consistency across the admin interface and eliminates the need for future contributors to decide between text and icon actions.

## What Changes

- Replace text action buttons on remaining admin pages with standard icons from `src/components/icons.tsx`.
- Add a `IconFilter` component to the shared icons file for filter actions.
- Apply icons to: `kits/page.tsx` (Edit Kit, Delete), `kits/[id]/page.tsx` (per-row Delete for groups and items), `units/[id]/page.tsx` (Save groups, Delete groups/items, Remove compartments/kits), `system-log/page.tsx` (Filter, Reset), `equipment/equipment-catalog-controls.tsx` (Back to top).
- Document the standard icon set as the required pattern for all future admin action buttons.

## Capabilities

### Modified Capabilities

- `fleet-dashboard`: Admin action buttons follow a standardized icon set, with `src/components/icons.tsx` as the canonical source for action icons.

## Impact

- Affects `kits/page.tsx`, `kits/[id]/page.tsx`, `units/[id]/page.tsx`, `system-log/page.tsx`, `equipment/equipment-catalog-controls.tsx`.
- Adds `IconFilter` to `src/components/icons.tsx`.
