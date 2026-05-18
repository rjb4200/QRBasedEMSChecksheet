## Why

QR code labels printed from the app don't align with the Spartan Industrial S004 label sheet (6-up, 3"×3" labels), wasting label stock and producing labels that are harder to scan. The print layout needs to match the label template for clean, scannable labels.

## What Changes

- Reformatted the Print / Save as PDF output on the QR codes page to match the Spartan Industrial S004 6-label template (2×3 grid of 3"×3" labels)
- QR code size increased to ~2.25" for reliable scanning through lamination
- Removed "Code:" text and URL from printed labels (redundant — QR encodes the URL)
- Reduced unit name and compartment/kit font sizes to 10-11px to fit the 3"×3" label
- Wrapped each label in exact 3"×3" print-only sizing with minimal padding
- Individual "Print This QR" button is unaffected (separate print window with its own styles)

## Capabilities

### New Capabilities

- `qr-label-print`: Print QR code labels formatted for a 6-up label sheet template

### Modified Capabilities

- None

## Impact

- `src/app/admin/units/[id]/qr/print-button.tsx`: Update print-specific CSS classes (`@media print`) and label sizing
- `src/app/admin/units/[id]/qr/page.tsx`: Add `@page` CSS for print margins
- No new dependencies
- No changes to database or API routes
