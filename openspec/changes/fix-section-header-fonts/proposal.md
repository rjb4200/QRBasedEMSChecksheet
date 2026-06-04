## Why

Several admin pages have inconsistent visual styling: form section headers use page-title font weight, filter sections lack labels, records page unit cards lack visual grouping, and the equipment page filter layout is unnecessarily tall. Standardizing these to the compact red label pattern and consistent card styling improves scannability across the admin area.

## What Changes

- Replace `font-black text-red-700` on form section headers and restocking list headings with the compact red label pattern.
- Add "Filter" red label to the System Log and Equipment filter sections.
- On the Equipment page, add an "Add" red label to the new-item form and make the filter bar a single line.
- On the Records page, add a background container behind unit cards with thicker borders and a red date label.
- On the Kits page, remove redundant "Kit" text from each card, add a background container, add a red label at top, and use thicker borders.
- Change the Records page "Last 14 Days Check Completion" chart title to the compact red label pattern.
- Preserve all functionality, routes, and data behavior.

## Capabilities

### New Capabilities
- (none — visual polish and consistency)

### Modified Capabilities
- `fleet-dashboard`: Admin pages use consistent compact red labels and card styling.

## Impact

- **Pages updated**: `admin/units/page.tsx`, `admin/kits/page.tsx`, `admin/archives/page.tsx`, `admin/archives/[id]/page.tsx`, `admin/checksheets/print/page.tsx`, `admin/system-log/page.tsx`, `admin/equipment/page.tsx`, `components/completion-trend-chart.tsx`
- **Behavior**: No route or data changes.
