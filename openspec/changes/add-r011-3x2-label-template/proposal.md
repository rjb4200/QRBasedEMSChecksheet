## Why

The QR label page currently supports only Spartan S004 3x3 and Avery 94237 3x2 sheets. Adding an R011 rotated 3x2 sheet template allows admins to print labels on a third physical stock format without forcing them to approximate another template's geometry and waste label sheets.

## What Changes

- Add a third QR label sheet template: `R011` rotated 3x2.
- Support 10 labels per sheet for R011 using a 2-column by 5-row layout.
- Add an R011 format selector to the QR label page alongside the existing Spartan and Avery options.
- Add fixed physical positions for R011 using the provided margins and pitch values.
- Enforce the R011 10-label physical selection cap, including duplicate copies counting toward the cap.
- Preserve existing Spartan S004 and Avery 94237 behavior.

## Capabilities

### New Capabilities
- `r011-qr-label-template`: Printable rotated 3x2 QR label output for the R011 10-up sheet format.

### Modified Capabilities
- `qr-label-print`: QR label printing supports a third sheet template and format selector while preserving the current template behaviors.

## Impact

- **UI**: Update `src/app/admin/units/[id]/qr/page.tsx` to expose the R011 format selector.
- **Print logic**: Update `src/app/admin/units/[id]/qr/print-button.tsx` with R011 geometry, capacity, and rendering.
- **Behavior**: No QR code generation, URL encoding, or checkoff routing changes.
