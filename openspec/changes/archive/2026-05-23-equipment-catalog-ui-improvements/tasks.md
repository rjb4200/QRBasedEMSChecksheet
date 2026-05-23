## 1. Usage Count Data

- [x] 1.1 Add a server-side usage-count subquery or read helper for catalog items
- [x] 1.2 Count active references from `unit_compartment_items` and `kit_items` where the referencing unit/kit is not deleted
- [x] 1.3 Exclude references from soft-deleted units from the usage count
- [x] 1.4 Pass the usage count into the Equipment Catalog page data

## 2. Read-Only Row Editing

- [x] 2.1 Create a client component for editable catalog rows
- [x] 2.2 Default each row to read-only text display
- [x] 2.3 Add Edit icon button to each row that switches the row to editable mode
- [x] 2.4 Show Save icon during edit mode and submit the existing save action
- [x] 2.5 Show Cancel icon during edit mode to discard changes and return to read-only

## 3. Icon Buttons

- [x] 3.1 Replace the Filter text button with a filter/funnel icon while keeping the filter form functional
- [x] 3.2 Replace the per-row Save text button with the existing app save icon pattern
- [x] 3.3 Replace the per-row Delete text button with the trash icon pattern from the restock list
- [x] 3.4 Ensure all icon buttons include `aria-label` and `title` attributes
- [x] 3.5 Reuse the existing `QrSaveButton` or its spinner pattern for the save icon

## 4. Quantity Field Behavior

- [x] 4.1 Disable and grey out the quantity/par input when `input_type` is Checkbox
- [x] 4.2 Disable and grey out the quantity/par input when `input_type` is Condition
- [x] 4.3 Keep the quantity/par input editable when `input_type` is Quantity
- [x] 4.4 Update the disabled state immediately when the input type changes during editing

## 5. Usage Badge Display

- [x] 5.1 Render a usage badge on each catalog row showing the usage count
- [x] 5.2 Style the badge to make unused items visually distinguishable from used items

## 6. Validation

- [x] 6.1 Run `npm run lint` and fix any issues
- [x] 6.2 Run `npm run typecheck` and fix any issues
- [x] 6.3 Run `npm run build` and verify no build errors
- [x] 6.4 Manual test: row read-only default, edit, save, and cancel behavior
- [x] 6.5 Manual test: quantity field disabled for checkbox and condition types
- [x] 6.6 Manual test: usage badge count accuracy
- [x] 6.7 Manual test: delete safety behavior unchanged
- [x] 6.8 Manual test: icon button accessibility labels
- [x] 6.9 Manual test: mobile layout
