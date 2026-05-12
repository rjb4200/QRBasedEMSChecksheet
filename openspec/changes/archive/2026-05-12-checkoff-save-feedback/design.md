## Context

The `CheckoffForm` component handles both compartment and kit checkoff submissions. It already has a Submit button. The `SaveButton` component from `src/components/save-feedback.tsx` provides pending/disabled state via `useFormStatus`. This change is a drop-in button replacement.

## Goals / Non-Goals

**Goals:**
- Submit button shows "Saving..." and disables during save
- Duplicate taps prevented
- Works on both compartment and kit checkoffs via the shared `CheckoffForm`

**Non-Goals:**
- No changes to checkoff logic, validation, or database
- No new files

## Decisions

1. **Reuse `SaveButton`** over creating a new component
   - Rationale: Already built, already tested in Kits/Equipment, identical behavior needed

## Risks

- **[Risk] `useFormStatus` in deeply nested component** → Mitigation: `SaveButton` is a direct child of the form, so `useFormStatus` will work
