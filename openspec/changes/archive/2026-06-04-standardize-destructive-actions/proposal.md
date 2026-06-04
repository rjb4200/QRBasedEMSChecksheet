## Why

Some admin pages have single-click delete actions with no confirmation, while others use a two-stage pattern (trash icon → "Delete?" + cancel). Kits and unit builder pages in particular allow immediate deletion of items, groups, and compartments. Standardizing a two-stage destructive confirmation across all admin pages prevents accidental data loss.

## What Changes

- Create a reusable `DeleteConfirmButton` client component implementing the two-stage pattern.
- Apply two-stage confirmation to all delete buttons on `kits/page.tsx`, `kits/[id]/page.tsx`, and `units/[id]/page.tsx`.
- Add a destructive mode toggle to the equipment catalog page consistent with units and users pages.

## Capabilities

### Modified Capabilities

- `fleet-dashboard`: All admin delete actions use a standardized two-stage confirmation pattern, with destructive mode toggles on list pages.

## Impact

- New component: `src/components/delete-confirm-button.tsx`.
- Affects: `kits/page.tsx`, `kits/[id]/page.tsx`, `units/[id]/page.tsx`, `equipment/page.tsx`.
