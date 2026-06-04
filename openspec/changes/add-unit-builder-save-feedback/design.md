## Context

The kit builder (`admin/kits/[id]/page.tsx`) already uses the `SubmitButton` component for its save buttons, which shows a spinning loader while the server action is pending. The unit builder (`admin/units/[id]/page.tsx`) has a "Save group" button with identical UX but no spinner feedback.

## Goals / Non-Goals

**Goals:**
- Add spinner feedback to the unit builder's "Save group" button.

**Non-Goals:**
- Do not change any other buttons on the unit builder page.
- Do not change the unit builder's form logic or server actions.

## Decisions

### Decision 1: Reuse the existing `SubmitButton` component

Use the same `SubmitButton` component from `src/components/submit-button.tsx` that wraps children with `useFormStatus` and shows a spinner when pending.

Rationale: This component already exists and is used in the kit builder for the same purpose. Consistency avoids duplicating the spinner logic.
