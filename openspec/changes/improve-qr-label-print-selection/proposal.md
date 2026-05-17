## Why

The current QR label workflow is too rigid because admins can print all labels or a single label, but cannot prepare a unit-specific batch of only the labels they need. Some checkoff targets also need duplicate physical stickers in multiple locations, and the printed `/q/{code}` text consumes label space without helping crews scan or use the label.

## What Changes

- Replace the separate all-label and single-label print workflows with one selectable QR label print workflow.
- Show all QR labels on the unit QR label page by default and default every label to selected.
- Add page-level Select All, Deselect All, and Print Selected controls.
- Add per-label controls for whether the label prints and whether it prints a second physical copy.
- Print only selected labels, with duplicate-copy labels appearing as an additional physical label using the same QR code and URL.
- Remove visible `/q/{code}` short URL text from printed labels while preserving the encoded QR URL and copyable URL behavior for administration/NFC use.
- Preserve one QR target per checkoff location; duplicate copies are duplicate stickers, not duplicate QR records.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `short-opaque-qr-codes`: QR label printing gains selectable labels, duplicate physical copies, print-only filtering, and printed labels no longer show visible short URL text.

## Impact

- Affects the admin unit QR page and client-side print controls in `src/app/admin/units/[id]/qr/`.
- Reuses existing QR target creation and lookup behavior from `src/lib/qr-targets.ts`.
- Does not require database schema changes or new QR target records.
- Requires verification that 3x2 label pagination still prints 10 rendered physical labels per page without page-break overlap.
