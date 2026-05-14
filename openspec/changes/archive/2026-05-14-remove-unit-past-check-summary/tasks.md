## 1. Unit Page Cleanup

- [x] 1.1 Remove previous-shift archive and previous crew queries from `src/app/units/[id]/page.tsx` when they are only used by removed summary cards.
- [x] 1.2 Remove the previous exceptions helper/types from the unit page when no longer used.
- [x] 1.3 Remove the "Exceptions for past check" section from the unit page.
- [x] 1.4 Remove the "Previous shift" section from the unit page.

## 2. Preserve Current Operational Sections

- [x] 2.1 Verify current section status cards and crew lock remain unchanged.
- [x] 2.2 Verify Daily Unit Comments remain visible/editable.
- [x] 2.3 Verify Section Comments and Restocking List behavior remains unchanged.

## 3. Verification

- [x] 3.1 Run `npm run typecheck` and `npm run lint`.
- [x] 3.2 Verify the unit page no longer contains "Exceptions for past check" text.
- [x] 3.3 Verify the unit page no longer contains "Previous shift" text.
