## Why

Crews notice issues while checking specific compartments or kits, but the unit page only has one general comment field. Dumping all comments into one box loses the context of which section each observation came from. Adding per-section comment fields on compartment and kit checkoff pages, then merging them on the main unit page, gives crews a targeted way to document issues and gives supervisors structured visibility into which sections had problems.

## What Changes

- Add an optional comment field to compartment checkoff pages and assigned-kit checkoff pages.
- Create a `daily_section_comments` table to store comments keyed by unit, date, shift period, source type, and source ID.
- Display merged section comments on the main unit page, each labeled with its source section name.
- Keep the existing unit-level comment field separate and unchanged.

## Capabilities

### New Capabilities
- `section-comments`: Per-section comment entry on compartment/kit checkoff pages, structured storage, and merged display on the unit dashboard.

### Modified Capabilities
- `unit-comments`: Unit page display expands to include a section comments block alongside the existing unit-level comment.

## Impact

- `src/app/checkoff/[unitId]/[compartmentId]/page.tsx` — add comment field
- `src/app/checkoff/[unitId]/kit/[unitKitId]/page.tsx` — add comment field
- `src/app/checkoff/[unitId]/[compartmentId]/actions.ts` — upsert comment on submit
- `src/app/units/[id]/page.tsx` — display merged section comments
- New database migration for `daily_section_comments`
