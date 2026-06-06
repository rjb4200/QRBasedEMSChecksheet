## 1. Make upsertTargetCheck atomic

- [x] 1.1 Replace the SELECT-then-INSERT/UPDATE pattern in `upsertTargetCheck()` with `.upsert()` using `onConflict` in `src/app/checkoff/[unitId]/[compartmentId]/actions.ts`
- [x] 1.2 Determine correct `onConflict` columns based on whether the target is a compartment (`unit_id, compartment_id, shift_date, shift_period`) or kit (`unit_id, unit_kit_id, shift_date, shift_period`)
- [x] 1.3 Handle upsert errors gracefully — catch constraint violations and return an error response instead of crashing

## 2. Make page-load auto-create atomic

- [x] 2.1 Replace the SELECT-then-INSERT pattern in compartment `page.tsx` with `.upsert()` in `src/app/checkoff/[unitId]/[compartmentId]/page.tsx`
- [x] 2.2 Replace the SELECT-then-INSERT pattern in kit `page.tsx` with `.upsert()` in `src/app/checkoff/[unitId]/kit/[unitKitId]/page.tsx` (no-op: kit page doesn't auto-create on page load)

## 3. Prevent auto-save from racing with manual submit

- [x] 3.1 Store the auto-save timer in a `useRef` and clear it when the Submit button is clicked in `src/app/checkoff/[unitId]/[compartmentId]/checkoff-form.tsx`
- [x] 3.2 Add an `isSubmittingRef` that is set to true when submit fires and checked in the auto-save callback to prevent concurrent saves
- [x] 3.3 Reset `isSubmittingRef` on mount to handle re-renders safely

## 4. Verification

- [x] 4.1 Run `npm run build` to verify compilation
- [x] 4.2 Manual test: rapid double-click submit, verify no duplicate rows
- [x] 4.3 Manual test: open same checkoff in two tabs, verify no duplicate rows
