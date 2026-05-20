## Why

The Equipment Catalog becomes harder to manage as the catalog grows. Text-heavy action buttons and always-editable fields create visual clutter and increase the chance of accidental edits. It is also difficult to identify unused equipment catalog entries that may be safe to delete.

## What Changes

- Replace text-heavy Filter, Edit, Save, and Delete actions with icon buttons using existing app icon patterns.
- Make catalog row fields read-only by default until the admin clicks an Edit icon.
- Grey out/disable the quantity/par field when the item input type is Checkbox or Condition.
- Add a per-row usage badge showing how many active unit/compartment/kit assignments use each catalog item.
- Preserve existing save/delete logic, delete confirmations, checkoff behavior, records/archive, and crew-facing pages.

## Capabilities

### New Capabilities
- `equipment-catalog-row-actions`: Icon-based row actions with read-only-by-default row editing for the Equipment Catalog.
- `equipment-catalog-usage-badges`: Per-row usage count badge showing how many active assignments use each equipment catalog item.

### Modified Capabilities
- `equipment-catalog`: Row editing behavior changes from always-editable to read-only-by-default with explicit edit/save/cancel actions and disabled quantity fields for non-count input types.

## Impact

- **UI**: Updates to the Equipment Catalog admin page component and its helper controls.
- **Data**: Add a usage-count query or read model aggregated from `unit_compartment_items` and `kit_items`.
- **Behavior**: No changes to checkoff, equipment assignment, records/archive, QR/NFC routing, restocking, or crew-facing forms.
