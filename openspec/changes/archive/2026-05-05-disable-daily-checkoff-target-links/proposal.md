## Why

The Daily Checkoff dashboard currently lets crews open compartment and kit checkoff forms by clicking status cards, which makes it easy to complete checks without physically visiting each target. This change keeps honest checkoffs easy while making shortcut behavior harder by keeping QR scanning as the intended launcher.

## What Changes

- Convert Daily Checkoff compartment and kit cards from clickable links into non-clickable status indicators.
- Keep the existing Scan action available as the visible path for opening compartment and kit checkoffs.
- Preserve direct checkoff URLs, QR code URLs, status calculations, crew lock behavior, and admin behavior.
- Do not add token validation, scan enforcement, bookmark blocking, or route-level restrictions.

## Capabilities

### New Capabilities

- `daily-checkoff-navigation`: Crew-facing navigation rules for the Daily Checkoff unit dashboard and QR-based checkoff entry.

### Modified Capabilities

## Impact

- Affected UI: `src/app/units/[id]/page.tsx` Daily Checkoff unit dashboard target cards.
- Affected tests/validation: manual or automated verification that target cards are not anchors and the Scan action still links to `/scan`.
- No database, API, QR generation, route authorization, or Supabase changes.
