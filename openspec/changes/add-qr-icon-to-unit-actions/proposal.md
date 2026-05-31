## Why

The admin units page now uses icons for Edit and Delete, but QR Codes remains a text button. Replacing it with a QR code icon completes the icon set and makes all action buttons visually compact and consistent.

## What Changes

- Add an `IconQr` component to the shared icons file.
- Replace the "QR Codes" text link with an icon link bearing the QR code SVG and an accessible label.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `unit-configuration`: Admin units list QR Codes action uses a QR code icon instead of a text label.

## Impact

- Affects `src/components/icons.tsx` and `src/app/admin/units/page.tsx`.
- No API or database changes.
