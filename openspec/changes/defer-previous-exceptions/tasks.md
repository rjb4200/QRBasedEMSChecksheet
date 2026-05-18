## 1. API Route

- [x] 1.1 Create `src/app/api/units/[id]/previous-exceptions/route.ts` with GET handler
- [x] 1.2 Query `shift_archives` for the most recent previous shift matching `unit_id`
- [x] 1.3 Compute exceptions from the archive's `check_data` JSONB column when archive exists
- [x] 1.4 Fall back to par-level computation from `unit_compartment_items` and `kit_items` when no archive exists
- [x] 1.5 Return JSON with `{ exceptionCount, items: [{ sourceName, itemName, issue }] }`

## 2. Client Component

- [x] 2.1 Create `src/components/previous-exceptions-panel.tsx` as a `"use client"` component
- [x] 2.2 Implement state machine: idle → loading → loaded | empty | error
- [x] 2.3 Fetch API route in `useEffect` on mount
- [x] 2.4 Render "Checking previous exceptions..." during loading state
- [x] 2.5 Render exception count and item list when exceptions found
- [x] 2.6 Render "No previous exceptions found" when result is empty
- [x] 2.7 Render nothing (return null) on fetch failure instead of an error state
- [x] 2.8 Style panel to match existing dashboard section styles (rounded-3xl, white bg, border)

## 3. Page Integration

- [x] 3.1 Import `PreviousExceptionsPanel` in `src/app/units/[id]/page.tsx`
- [x] 3.2 Place the panel between the Restocking List and CrewNameLock sections
- [x] 3.3 Ensure no historical archive data is loaded in the initial page render

## 4. Verification

- [x] 4.1 Run `npm run lint` and fix any issues
- [x] 4.2 Run `npm run typecheck` and fix any issues
- [x] 4.3 Run `npm run build` and verify no build errors
- [ ] 4.4 Manual test: dashboard loads before previous exceptions panel resolves
- [ ] 4.5 Manual test: panel shows exceptions when prior shift had them
- [ ] 4.6 Manual test: panel shows "No previous exceptions found" when none exist
- [ ] 4.7 Manual test: panel disappears silently on fetch failure
- [ ] 4.8 Manual test: navigating to a compartment while panel is loading works
