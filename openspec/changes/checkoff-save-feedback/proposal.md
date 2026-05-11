## Why

Crews submitting compartment and kit checkoffs get no visual feedback — the Submit button doesn't indicate saving, success, or failure. On mobile with slow connections, this makes the app appear unresponsive and leads to duplicate taps.

## What Changes

- Replace plain Submit buttons in compartment and kit checkoff forms with `SaveButton` (from shared `src/components/save-feedback.tsx`)
- `SaveButton` shows "Saving..." with disabled state during submission, prevents duplicate taps
- Reuses existing `useSaveFeedback` hook and `SaveStatusMessage` component

## Capabilities

### New Capabilities

- None (uses existing shared save feedback components)

### Modified Capabilities

- None

## Impact

- `src/app/checkoff/[unitId]/[compartmentId]/checkoff-form.tsx` — Replace Submit button
- `src/app/checkoff/[unitId]/kit/[unitKitId]/page.tsx` — The kit checkoff uses the same `CheckoffForm` component
- No new files needed — reuses `src/components/save-feedback.tsx`
