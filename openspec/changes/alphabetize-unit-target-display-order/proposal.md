## GitHub Issue

Requested change: Display unit compartments and assigned kits in one mixed alphabetical order on both the unit checkoff page and `/admin/units` editing pages.

## Root Cause

The unit dashboard and unit builder currently combine compartments and assigned kits into one list, then sort that combined list by database `sort_order`. This makes the displayed order depend on manually maintained numeric ordering instead of the visible compartment or kit names. When crews or admins are looking for a specific compartment or kit, the current order can be harder to scan.

## Proposed Solution

- Sort the combined compartment/kit display list alphabetically by display name.
- Keep compartments and assigned kits mixed together in one A-Z list rather than grouping by type.
- Apply the same display ordering on the unit checkoff page and the `/admin/units/[id]` unit builder page.
- Use a case-insensitive, user-visible name comparison so names sort naturally regardless of capitalization.
- Preserve each target's existing identity, checkoff URL, status, QR location note, section comments, restocking data, and item order.

## Scope

- Update the unit dashboard target display order in `src/app/units/[id]/page.tsx`.
- Update the admin unit builder layout display order in `src/app/admin/units/[id]/page.tsx`.
- The changed order applies only to the displayed compartment/kit sections/cards, not to the item order inside a compartment or kit.

## Non-Goals

- No database schema changes.
- No migration of existing `sort_order` values.
- No change to the order of equipment items inside compartments or kits.
- No change to kit editing order inside the global Kits admin pages.
- No change to QR code generation, checkoff routes, restocking logic, or completion/status calculations.
- No removal of existing `sort_order` fields from forms or database records.

## Risk Assessment

- Regression risk: Low. The change is limited to display sorting of an already-built combined list.
- Data risk: Low. Existing records and saved sort order values remain unchanged.
- UX risk: Low to moderate. Crews and admins will see a different order than before, but the new order should be easier to scan alphabetically.

## Verification Plan

- Create or identify a unit with compartments and kits whose names do not match numeric `sort_order`.
- Verify the unit checkoff page shows all compartments and kits in one mixed A-Z order.
- Verify `/admin/units/[id]` shows the same mixed A-Z order for editing.
- Verify clicking/tapping each target still opens the correct compartment or kit checkoff route.
- Verify status colors, restocking list, QR location notes, section comments, and item ordering remain unchanged.
- Run type checking and lint/build if feasible.

## Rollback Plan

Revert the display sorting changes and remove this OpenSpec change. Because no database or API behavior changes are included, rollback is limited to code revert.