## Why

The Equipment Catalog currently shows a numeric usage count per item, but does not show which specific units and compartments reference each catalog item. Admins need to see where an item is assigned before editing, deleting, or troubleshooting equipment setup — without opening every unit detail page.

## What Changes

- Replace the numeric usage count badge with named usage badges showing the unit name and compartment/kit name for each reference.
- Resolve usage names by joining through `unit_compartments` → `units` and `kits` → `unit_kits` → `units`.
- For items used in many places, show the first few badges plus a `+N more` indicator.
- Keep unused items visually distinct.
- Preserve the existing read-only row editing, icon actions, quantity field behavior, and pagination.

## Capabilities

### New Capabilities
- `equipment-usage-named-badges`: The Equipment Catalog shows named unit/compartment badges indicating where each catalog item is used.

### Modified Capabilities
- `equipment-catalog`: Equipment catalog rows now display named usage badges alongside the existing row layout.

## Impact

- **Data pipeline**: Update the equipment catalog page query to resolve unit and compartment/kit names for each catalog item's usage.
- **UI**: Update `EditableCatalogRow` to render named usage badges with overflow handling.
- **Behavior**: No changes to checkoff, equipment assignment, records, or crew-facing behavior.
