## Why

The admin navigation bar is becoming crowded with equally-weighted links. The upcoming Needs Follow-up page needs strong visibility for daily operations, but the current flat layout doesn't distinguish between operational pages (used daily) and setup pages (used occasionally). Removing the QR Codes link (which only redirects to Units) frees a slot. Moving setup pages into a hamburger menu keeps them accessible while prioritizing daily workflows.

## What Changes

- Keep Fleet, Records, Needs Follow-up, and System Log as top-level navigation items.
- Move Units, Kits, Equipment, and Users into a hamburger/Admin dropdown menu.
- Remove the top-level QR Codes navigation link.
- Preserve existing routes, page behavior, and active/current-page styling.
- Ensure the hamburger menu is keyboard-accessible, closes on click-outside, and works on mobile.

## Capabilities

### New Capabilities
- `admin-nav-rework`: The admin navigation distinguishes operational top-level links from setup pages in a dropdown menu.

### Modified Capabilities
- `fleet-dashboard`: Navigation structure changes to prioritize operational workflows but does not change page behavior.

## Impact

- **Extract nav into component**: Create `src/components/admin-nav.tsx` with the reorganized links and hamburger menu.
- **Admin layout**: Simplify `src/app/admin/layout.tsx` to use the new component.
- **Routes**: No route changes. QR Codes link removal does not affect `/admin/units/[id]/qr`.
- **Behavior**: No changes to any admin page functionality.
