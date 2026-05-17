## Why

The existing QR print page produces a grid layout optimized for general use. Departments using 3" × 2" adhesive labels on 10-label letter sheets need a dedicated layout with rotated 90-degree content that fits the physical label dimensions and keeps QR codes scannable.

## What Changes

- Add a 3" × 2" rotated label print layout accessible via `?format=3x2-rotated` on the existing QR print route.
- Layout: 2 columns × 5 rows, each label 3" × 2" with content rotated 90 degrees.
- Each label shows: unit name, compartment/kit name, short URL text, and the QR code.
- QR code sized to 1.25"–1.5" for reliable scanning.
- Preserve the existing QR print layout and QR code generation behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `short-opaque-qr-codes`: Admin QR print page gains a selectable 3x2 rotated label layout option.

## Impact

- `src/app/admin/units/[id]/qr/page.tsx` or a new print-label page/route.
- Existing QR print-button component may need a format option.
- No database changes, no routing changes.
