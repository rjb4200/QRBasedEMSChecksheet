## Why

The units page currently shows the destructive toggle as a separate white panel above the unit list, and the page header uses generic "Admin" + "Units" labels with mismatched styling. Restructuring to a shared panel with the toggle right-aligned, a descriptive page title, and red-styled section labels creates visual consistency with the Fleet Panel.

## What Changes

- Change the page heading to "Unit Management" using the large black title style.
- Place the destructive toggle and unit list inside a shared white rounded panel with a slate border matching the Fleet Panel card styling.
- Show "Units" as a compact red label on the left, with the destructive toggle on the same row to the right.
- Style "Create a New Unit" heading using red text.
- Remove the standalone "Admin" red label from the page header.

## Capabilities

### Modified Capabilities

- `unit-configuration`: Admin units page layout uses a shared panel, descriptive page title, and red section labels.

## Impact

- Affects `src/app/admin/units/page.tsx` and `src/app/admin/units/destructive-toggle.tsx`.
