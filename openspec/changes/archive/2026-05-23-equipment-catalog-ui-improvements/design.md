## Context

The Equipment Catalog admin page currently uses text-heavy buttons for actions and renders all row fields as editable inputs on every page load. This creates visual clutter, increases the chance of accidental edits, and makes it difficult to identify unused catalog items. The page already uses a server-rendered model with a client-side page-size selector and back-to-top button.

## Goals / Non-Goals

**Goals:**
- Replace Filter, Edit, Save, and Delete text buttons with icon buttons that match existing app patterns.
- Make catalog row fields read-only by default, editable only after clicking an Edit icon.
- Grey out/disable the quantity/par field when the input type is Checkbox or Condition.
- Add a per-row usage badge showing how many active assignments reference each catalog item.
- Reuse the existing save-button spinner and trash icon patterns already present in the app.

**Non-Goals:**
- Do not redesign the full Equipment Catalog page layout.
- Do not change checkoff, equipment assignment, records/archive, restocking, QR/NFC, or crew-facing behavior.
- Do not delete unused items automatically.

## Decisions

### Decision 1: Row edit state managed client-side

Each catalog row will track its own editing state in a client component. The default render is read-only text. Clicking Edit switches that row to editable inputs. Save submits the form and returns to read-only. Cancel discards changes and returns to read-only.

Rationale: This keeps the server-rendered catalog page intact and adds editing state only where needed without a full refactor.

### Decision 2: Usage count computed server-side

A usage count will be added to the catalog query by counting references in `unit_compartment_items` and `kit_items` where the referencing unit/kit is still active (not deleted). This count is passed as a simple number per row.

Rationale: The catalog page is already server-rendered with data from `createAdminClient`. Adding a usage count to the existing data load avoids extra client fetches.

### Decision 3: Reuse existing app icons

The save button will reuse the existing `QrSaveButton` disk-icon/spinner pattern. The delete button will reuse the trash icon pattern from the restock list. Edit will use a pencil icon. Filter will use a funnel icon paired with existing filter controls.

Rationale: Consistency with the rest of the app reduces cognitive load for admins.

### Decision 4: Quantity field disabled for non-count types

When a row's input type is Checkbox or Condition, the quantity/par input will be disabled and visually greyed out. When the type changes during editing, the disabled state will update immediately.

Rationale: Quantity is meaningless for checkbox and condition items, and preventing edits reduces confusion.

## Risks / Trade-offs

- **Risk**: Adding client-side edit state could cause hydration mismatches. -> **Mitigation**: Use `defaultValue` on inputs and only switch to controlled inputs after Edit is clicked.
- **Risk**: Usage count query could be expensive on large catalogs. -> **Mitigation**: Use a single aggregated subquery or pre-joined count in the main catalog query.
- **Risk**: Icon-only buttons could be hard to discover. -> **Mitigation**: Every icon button must include an `aria-label` and `title` attribute. Icons should follow existing app patterns admins already recognize.

## Migration Plan

1. Create a client component for editable catalog rows.
2. Add the usage-count subquery to the equipment catalog data load.
3. Update the catalog page to render icon buttons and read-only rows.
4. Update the quantity field to disable for checkbox/condition types.
5. Run lint/typecheck/build and manual tests.
6. Rollback: revert to the previous always-editable text-button catalog page code.
