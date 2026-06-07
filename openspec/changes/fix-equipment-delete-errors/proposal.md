## Why

Deleting an equipment item that is still referenced by kit items crashes the app with a generic error code (e.g., `ERROR 1496870369`). The delete button in edit mode does not actually delete anything — it only exits edit mode. The server action lacks a kit-items usage check and throws errors instead of returning structured results the UI can display inline.

## What Changes

- Add a unified pre-delete usage check covering `unit_compartment_items`, `kit_items`, and `template_compartment_items`.
- Return structured action state (`ok`, `message`) from the delete server action instead of throwing for expected validation failures.
- Display a clear inline message listing usage locations when deletion is blocked.
- Wire the edit-mode delete button to actually invoke the same delete server action.
- Keep the `equipment_catalog` spec's existing requirement that in-use items cannot be deleted and show where they are used.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `equipment-catalog`: The delete path will actually enforce the existing spec requirement that in-use items cannot be deleted and that the UI must indicate usage locations. No requirement text changes needed — this is fixing the implementation.

## Impact

- Affects `src/app/admin/equipment/actions.ts` (server-side delete with usage check and structured result).
- Affects `src/app/admin/equipment/editable-catalog-row.tsx` (UI handling of structured result, wiring edit-mode delete).
- No database schema, API route, authentication, or notification changes expected.
