## Context

The Kits and Equipment admin editing pages use server actions for saving. Currently, the Save button submits a form with no loading state, no success/error feedback, and no duplicate-submission prevention. Users get no indication of whether their save worked.

## Goals / Non-Goals

**Goals:**
- Add visual in-progress, success, and error states to Save buttons
- Prevent duplicate submissions while saving
- Create reusable hook for shared feedback logic
- Use accessible status messaging (aria-live, role="alert")

**Non-Goals:**
- Change save logic, validation, or database operations
- Add global notification system
- Add autosave or optimistic writes

## Decisions

1. **Shared `useSaveFeedback` hook** over per-page copying
   - Rationale: Same behavior in Kits and Equipment. One hook ensures consistency and reduces duplication.
   - Located at `src/lib/use-save-feedback.ts`

2. **Client component pattern** for the Save button area
   - Rationale: Server actions need client-side state for loading/spinner/feedback. Wrap the Save button and status message in a `"use client"` component.

3. **Auto-dismiss for success, persist for errors**
   - Success: 4-second timeout then clears
   - Error: Stays until user retries or edits the form

4. **Tailwind for status colors**
   - Success: `border-green-300 bg-green-50 text-green-700`
   - Error: `border-red-300 bg-red-50 text-red-700`
   - Saving: `border-slate-300 bg-slate-50 text-slate-700`

## Hook Interface

```ts
type SaveStatus = "idle" | "saving" | "success" | "error"

function useSaveFeedback() {
  return {
    status,       // SaveStatus
    message,      // string | null
    isSaving,     // boolean
    runSave,      // (saveFn: () => Promise<void>) => Promise<void>
    clearMessage, // () => void
  }
}
```

## Risks / Trade-offs

- **[Risk] Flashing state on very fast saves** → Mitigation: Short minimum display time for success (e.g., 2s min)
- **[Risk] Status message overflows on mobile** → Mitigation: Standard Tailwind responsive padding
