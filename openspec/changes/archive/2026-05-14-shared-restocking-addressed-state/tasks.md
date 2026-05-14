## 1. Database

- [x] 1.1 Create migration for `daily_restock_items` table with the specified columns, unique constraint, and RLS policies.
- [x] 1.2 Add a server action or API route to toggle addressed state (upsert/clear `daily_restock_items` rows).
- [x] 1.3 Add a query path for fetching addressed state for a given unit, date, and shift period.
- [x] 1.4 Pass addressed state from the unit page to the RestockingListSection component as initial props.

## 2. Restocking List Checkboxes and Layout

- [x] 2.1 Move the Restocking List to between the section status cards grid and the CrewNameLock section on the unit page.
- [x] 2.2 Add checkboxes to each Restocking List entry.
- [x] 2.3 Wire checkbox toggles to the toggle-addressed server action.
- [x] 2.4 Implement optimistic checkbox toggle with revert on save failure.

## 3. Polling

- [x] 3.1 Add a 15-second polling interval that fetches updated addressed state.
- [x] 3.2 Guard polling to only run when expanded, tab visible, and no save in progress.
- [x] 3.3 Merge polled state into the checkbox map without page reload, flicker, or scroll jump.
- [x] 3.4 Pause polling on Restocking List collapse and resume on re-expand.

## 4. Verification

- [x] 4.1 Run `npm run typecheck` and `npm run lint`.
- [x] 4.2 Verify checkbox toggles save to `daily_restock_items` and revert on failure.
- [x] 4.3 Verify polling fetches changes and updates checkboxes without page reload.
- [x] 4.4 Verify polling pauses when the list is collapsed and resumes when expanded.
- [x] 4.5 Verify original checkoff exception data remains unchanged.
