## 1. Create shared save feedback hook

- [x] 1.1 Create `src/lib/use-save-feedback.ts` with `useSaveFeedback` hook
- [x] 1.2 Implement idle/saving/success/error state machine
- [x] 1.3 Add 4-second auto-dismiss for success messages

## 2. Create save status message component

- [x] 2.1 Create `SaveStatusMessage` component with color-coded states
- [x] 2.2 Add `role="status"` with `aria-live="polite"` for success
- [x] 2.3 Add `role="alert"` for error messages

## 3. Update Kits edit page

- [x] 3.1 Add `"use client"` wrapper for the save button area
- [x] 3.2 Integrate `useSaveFeedback` hook with save action
- [x] 3.3 Replace Save button with state-aware button (idle/Saving.../Save)
- [x] 3.4 Add `SaveStatusMessage` component below the Save button

## 4. Update Equipment edit page

- [x] 4.1 Add `"use client"` wrapper for the save button area
- [x] 4.2 Integrate `useSaveFeedback` hook with save action
- [x] 4.3 Replace Save button with state-aware button (idle/Saving.../Save)
- [x] 4.4 Add `SaveStatusMessage` component below the Save button

## 5. Verify and test

- [x] 5.1 Run typecheck and build
- [x] 5.2 Verify Kits save feedback works (Saving... → success)
- [x] 5.3 Verify Equipment save feedback works (Saving... → success)
- [x] 5.4 Verify error state displays correctly
- [x] 5.5 Verify duplicate click prevention while saving
- [x] 5.6 Commit and push
