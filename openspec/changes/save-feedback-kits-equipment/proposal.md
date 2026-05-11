## Why

Clicking Save in the Kits and Equipment menus provides no visual feedback — users don't know if the click registered, if the save is still processing, or if it succeeded or failed. This leads to confusion, repeated clicks, and accidental duplicate submissions.

## What Changes

- Add save button feedback states (idle → Saving... → success/error) to Kits and Equipment menu pages
- Disable Save button during active save requests to prevent duplicate submissions
- Show success confirmation message that auto-dismisses after 4 seconds
- Show error message on save failure that persists until next action
- Create a shared `useSaveFeedback` hook for consistent behavior across both menus
- Add accessible status messaging with `aria-live` for success and `role="alert"` for errors

## Capabilities

### New Capabilities

- `save-feedback`: Visual save feedback states for admin editing forms

### Modified Capabilities

- None

## Impact

- `src/app/admin/kits/[id]/page.tsx` — Add save feedback to kit editing page
- `src/app/admin/equipment/page.tsx` or equipment editing pages — Add save feedback
- New file: `src/lib/use-save-feedback.ts` — Shared hook
- No database changes, no API changes, no validation changes
