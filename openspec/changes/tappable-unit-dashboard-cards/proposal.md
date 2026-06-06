## Why

The unit dashboard (`/units/[id]`) displays compartment and kit status cards, but they have no tap interaction. Once a crew member scans a QR code to start a checkoff (creating an in-progress row), returning to the form requires re-scanning the QR code. In-progress and completed cards should be tappable shortcuts to their checkoff forms. Not-started cards remain QR-only — the scan is the gatekeeper for starting a checkoff.

## What Changes

- Wrap in-progress (yellow) and completed (green) cards in a Next.js `<Link>` navigating to the checkoff form
- Not-started (grey) cards remain as plain `<article>` — QR scan required to start
- Differentiate compartment links from kit links based on `target.type`
- Add `stopPropagation` on the QR location `<details>` to prevent navigation when expanding the note
- Preserve existing status colors, card layout, ARIA roles, and accessibility

## Capabilities

### New Capabilities

- `tappable-unit-cards`: Make in-progress and completed unit dashboard status cards tappable to navigate to the checkoff form

### Modified Capabilities

None.

## Impact

- **Affected files**: `src/app/units/[id]/page.tsx`
- **No API, database, dependency, or schema changes**
