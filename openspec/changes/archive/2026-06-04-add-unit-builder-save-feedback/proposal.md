## Why

The unit builder page has a "Save group" button that uses a static icon with no visual feedback during submission. Users clicking save have no indication that their action is being processed, which is inconsistent with the kit builder and equipment catalog that already show spinner feedback.

## What Changes

- Replace the static "Save group" icon button in the unit builder with a `SubmitButton` component that shows a spinner while the form is submitting.
- Reuse the existing `SubmitButton` component recently created for the kit builder.

## Capabilities

### New Capabilities
- (none — this is a UX consistency fix)

### Modified Capabilities
- `unit-configuration`: The unit builder now provides visual save feedback consistent with the kit builder.

## Impact

- **Modified**: `src/app/admin/units/[id]/page.tsx` — one save button replaced.
- **Reuses**: `src/components/submit-button.tsx` — existing component.
