## Context

The app has live `useSaveFeedback` and `SaveStatusMessage` code that was built for a standardized feedback system but never integrated. Meanwhile, admin pages each implement their own feedback:

- **Users/Issues**: Manual `useState` booleans per action, duplicated inline div banners
- **Kits/Units**: Server component with `useFormStatus`, errors crash to Next.js boundary
- **Equipment**: Hybrid — `deleteEquipment` already uses structured returns, but `saveEquipment` still throws

The restocking list has the most sophisticated pattern (optimistic updates + rollback) which should be left alone as it's purpose-built for real-time sync.

The path of least resistance is to enhance what already exists rather than redesign.

## Goals / Non-Goals

**Goals:**
- Wire `useSaveFeedback` into admin pages that use manual fetch (Users, Issues).
- Add a shared `FeedbackBanner` component for the green/red banner pattern used across admin pages.
- Convert server actions that throw to use structured `{ ok, message }` returns where it improves UX.
- Extract the SVG spinner from its 3 duplication points into `src/components/spinner.tsx`.
- Standardize `disabled:opacity-50` across all admin action buttons.

**Non-Goals:**
- Do not redesign the restocking list's optimistic update pattern — it's purpose-built and working well.
- Do not change the checkoff form's auto-save pattern — it's tightly coupled to real-time persistence.
- Do not add toast notifications — keep feedback inline and close to the action.
- Do not require every server action to be converted — prioritize those that currently crash on user-facing errors.

## Decisions

1. Build on existing `useSaveFeedback` + `SaveStatusMessage`.

   Rationale: The hook already handles `idle → saving → success/error` transitions, auto-clears success after 4 seconds, and guards concurrent saves. The component already has proper `role="alert"` / `aria-live` attributes. The work is wiring, not building.

   Alternative considered: Build a new toast system. Rejected because inline banners keep feedback close to the action and require less infrastructure.

2. Keep `FeedbackBanner` as a thin wrapper around the consistent style used everywhere today.

   The existing pattern across Users, Issues, and Equipment is:
   ```html
   <div class="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-800">...</div>
   <div class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">...</div>
   ```
   Replace with a `<FeedbackBanner type="success" message="..." />` component.

3. Convert server actions to structured returns only where user-facing validation errors occur.

   Rationale: `saveEquipment` throws on database errors, which are unlikely and acceptable to crash. But `deleteEquipment` already uses structured returns for the in-use check. The pattern should be used for user-facing validation. Not every server action needs conversion.

4. Extract `Spinner` without changing behavior.

   Rationale: The spinner is defined identically in `SubmitButton`, `EditableCatalogRow`, and `QrSaveButton`. Extracting to `src/components/spinner.tsx` eliminates duplication without changing any visuals.

## Risks / Trade-offs

- Converting server actions from throwing to returning structured results changes the call pattern in existing code. Mitigation: do this incrementally, starting with actions that already have a client-side catch block.
- `useSaveFeedback` uses string-based success/error messages rather than React elements. Mitigation: this is fine for typical admin feedback. If richer formatting is needed later, the message parameter can be widened.
