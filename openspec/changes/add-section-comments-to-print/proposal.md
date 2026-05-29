## Why

Section comments are now visible on the Records page, but the printed daily record does not include them. The print view should reflect the same historical documentation so the printed record is complete without requiring admins to cross-reference the on-screen Records page.

## What Changes

- Add section comments to the Records print view for the selected date and unit.
- Append section comments to the existing Comments column in the print table, labeled by source compartment or kit name.
- Keep unit-level comments distinct from section comments within the same cell.
- Hide section comments when none exist for a unit.
- Preserve the existing landscape print layout, column structure, and formatting.

## Capabilities

### New Capabilities
- `print-section-comments`: The Records print view includes historical section comments from compartment and kit checkoffs.

### Modified Capabilities
- `archive-history`: The Records print view now surfaces section comments alongside unit-level comments.

## Impact

- **Print view**: Update `src/app/admin/archives/print/page.tsx` to render section comments in the Comments table cell.
- **Behavior**: No changes to the Records page, section comment entry, checkoff logic, archive logic, email, or print layout structure.
