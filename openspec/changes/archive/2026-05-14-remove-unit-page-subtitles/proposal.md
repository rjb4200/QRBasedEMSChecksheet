## Why

The Section Comments block shows a redundant "Compartment & Kit Notes" subtitle and the Daily Unit Comments section shows both a "Unit Comments" subtitle and a lengthy helper paragraph. With the Restocking List, expandable controls, and cleaner layout already in place, removing these redundant text blocks saves vertical space on the unit page.

## What Changes

- Remove the "Compartment & Kit Notes" h2 subtitle from the Section Comments block.
- Remove the "Unit Comments" h2 subtitle from the Daily Unit Comments form.
- Remove the "Optional notes for this unit checkoff..." helper paragraph from the Daily Unit Comments form.

## Capabilities

### New Capabilities

### Modified Capabilities
- `unit-comments`: Unit page removes redundant display subtitles from Section Comments and Daily Unit Comments sections.

## Impact

- `src/app/units/[id]/page.tsx` Section Comments and Daily Unit Comments JSX.
- No database changes, no logic changes, no other surface changes.
