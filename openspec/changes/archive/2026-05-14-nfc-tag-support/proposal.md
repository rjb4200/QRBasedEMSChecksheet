## Why

Crews on mobile devices must open their camera app and aim at a QR code to access a compartment checkoff page. This is slower with gloves on and requires good lighting. NFC tags programmed with the same short opaque URL provide a one-tap alternative that works with gloves and in low light, while the existing QR codes remain the fallback.

## What Changes

- Display the plaintext `/q/{code}` URL alongside each QR code image on the admin QR page.
- Add a "Copy URL" button per label so admins can paste the URL into an NFC writer app.
- Add NFC setup guidance to the admin QR page explaining recommended tag types and placement.
- No routing changes, no database changes, no new tables — NFC tags contain the same URL the QR code already encodes.

## Capabilities

### New Capabilities

### Modified Capabilities
- `short-opaque-qr-codes`: The admin QR page displays the plaintext URL and a copy button per label, and includes NFC tag programming guidance.

## Impact

- `src/app/admin/units/[id]/qr/page.tsx` and the print-button component.
- No routing changes, no new API endpoints, no database schema changes.
- No changes to the `/q/[code]` resolver, checkoff flow, or QR scanner.
