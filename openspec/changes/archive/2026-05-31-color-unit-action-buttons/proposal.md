## Why

After switching to icons, the admin units page lost its only color accent — the red Edit button. Adding red styling to the Set OOS and QR Code buttons on in-service units restores visual hierarchy and makes the page feel less flat, while preserving the muted slate treatment for OOS rows.

## What Changes

- Set OOS button gets `bg-red-700 text-white` styling on in-service units.
- QR Code icon button gets `bg-red-700 text-white` styling on in-service units.
- Both buttons keep their existing slate styling on OOS units.
- Edit and Delete icons remain slate in all states.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `unit-configuration`: Admin units list action button coloring varies by in-service/OOS status.

## Impact

- Affects `src/app/admin/units/page.tsx`.
- No API or database changes.
