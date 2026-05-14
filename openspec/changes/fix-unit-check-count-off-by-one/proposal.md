## Why

The displayed check counts across the unit pages are consistently off by one. The root cause is that the shift-reset archive computation and the "Previous shift" display on unit pages use total/complete counts that do not include the crew-name lock target, while the Fleet Panel, Records page, and all other views do include it.

## What Changes

- Update the shift-reset archive computation in the Edge Function to include the crew-name target in `completed_compartments`, `total_compartments`, and `completion_percentage`.
- Update the "Previous shift" display on the unit dashboard page to show consistent counts.

## Capabilities

### New Capabilities
<!-- None — bug fix only -->

### Modified Capabilities
- `past-checkoff-record-summary`: Previous shift archive display on unit pages must include the crew-name target in its count.
- `fix-daily-unit-status-snapshot`: Shift-reset archive computation must account for the crew-name lock target.

## Impact

- `supabase/functions/shift-reset/index.ts` — archive computation
- `src/app/units/[id]/page.tsx` — "Previous shift" display
