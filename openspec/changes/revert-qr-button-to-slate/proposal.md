## Why

The red accent on the QR Code button makes the icon row feel unbalanced. The Set OOS button carries enough color on its own to anchor the row. Reverting the QR button to slate keeps the visual anchor while maintaining a cleaner look.

## What Changes

- Revert the QR Code icon button on `/admin/units` to slate styling regardless of unit status.

## Capabilities

### Modified Capabilities

- `unit-configuration`: QR Code button uses slate styling in all states instead of red on in-service units.

## Impact

- Affects `src/app/admin/units/page.tsx`.
