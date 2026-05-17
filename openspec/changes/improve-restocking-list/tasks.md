## 1. Database

- [x] 1.1 Create migration for `daily_manual_restock_items` table with columns: id, unit_id, shift_date, shift_period, item_name, note, source_name, addressed, addressed_at, addressed_by, created_at, updated_at
- [x] 1.2 Add index on `(unit_id, shift_date, shift_period)`
- [x] 1.3 Add RLS policies (select for all, insert/update/delete for authenticated)

## 2. Server Actions

- [x] 2.1 Add `addManualRestockItem` server action with Zod validation (unitId, itemName, note, sourceName)
- [x] 2.2 Add `toggleManualRestockAddressed` server action for optimistic checkbox toggle
- [x] 2.3 Add `deleteManualRestockItem` server action with ownership validation (unitId + itemId)
- [x] 2.4 Add `getManualRestockItems` server action to fetch manual items for a unit/shift
- [x] 2.5 Add `getManualRestockAddressed` server action to poll addressed state (returns addressed item IDs)

## 3. Shared Types

- [x] 3.1 Add `ManualRestockItem` type to `src/lib/restocking-list.ts` with fields: id, itemName, note, sourceName, addressed
- [x] 3.2 Export type from shared library for use in components

## 4. Component: Header Layout

- [x] 4.1 Replace expand/collapse button wrapper with a horizontal header bar (title left, actions right)
- [x] 4.2 Create inline SVG icon components for Add (+), Share (share arrow), Copy (clipboard), and Print (printer)
- [x] 4.3 Place Add, Share, Copy, Print icon buttons in the header bar with aria-labels
- [x] 4.4 Move expand/collapse chevron to the right end of the header bar
- [x] 4.5 Remove old Print and Copy text buttons from the expanded content area
- [x] 4.6 Add "Copied" feedback state to the Copy icon button (brief text or visual change)
- [x] 4.7 Ensure header bar is tappable on mobile with sufficient touch targets
- [x] 4.8 Implement Share button handler: use `navigator.share()` with unit name and restocking list text when Web Share API is available
- [x] 4.9 Implement Share fallback: call existing Copy-to-clipboard logic with "Copied" feedback when Web Share API is unavailable

## 5. Component: Manual Add Form

- [x] 5.1 Add state for inline form visibility (showAddForm) and form field values
- [x] 5.2 Create inline form below header bar (inside expanded section) with item name input and note textarea
- [x] 5.3 Wire Add icon button to toggle the form; auto-expand section if collapsed
- [x] 5.4 Add submit handler calling `addManualRestockItem` server action with loading state
- [x] 5.5 Add cancel button to dismiss form without saving
- [x] 5.6 Validate item name is non-empty before submitting
- [x] 5.7 Clear form fields on successful submission and close form
- [x] 5.8 Show error feedback on server action failure

## 6. Component: Manual Items Display

- [x] 6.1 Accept `manualItems` prop in `RestockingListSection`
- [x] 6.2 Render manual items in a "Manual" source group card below generated exception groups
- [x] 6.3 Each manual item row shows: addressed checkbox, item name, optional note, delete button
- [x] 6.4 Wire addressed checkbox to `toggleManualRestockAddressed` with optimistic toggle and revert-on-failure
- [x] 6.5 Wire delete button to `deleteManualRestockItem` server action
- [x] 6.6 Show RestockingList section when manual items exist even if `restockingList` is empty

## 7. Component: Copy and Print with Manual Items

- [x] 7.1 Extend `buildRestockingText` to include a "Manual" section with manual item names and addressed markers
- [x] 7.2 Extend `buildPrintHtml` to include manual items in the print table under a "Manual" section
- [x] 7.3 Ensure both functions accept manual items parameter and interleave correctly with generated entries

## 8. Page Integration

- [x] 8.1 In `src/app/units/[id]/page.tsx`, fetch manual items via `getManualRestockItems` alongside existing data
- [x] 8.2 Pass manual items and initial addressed state to `RestockingListSection`
- [x] 8.3 Show RestockingListSection when manual items exist even if generated exceptions list is empty

## 9. Polling

- [x] 9.1 Extend polling effect to also fetch manual item addressed state via `getManualRestockAddressed`
- [x] 9.2 Merge manual addressed state into `addressedKeySet` using a distinct key prefix (e.g., `manual:<id>`)
- [x] 9.3 Ensure polling pauses/resumes correctly with the new manual item state

## 10. Verification

- [x] 10.1 Run `npm run lint` and fix any issues
- [x] 10.2 Run `npm run typecheck` and fix any issues
- [x] 10.3 Run `npm run build` and verify no build errors
- [ ] 10.4 Manual test: add a manual item, verify it persists on refresh
- [ ] 10.5 Manual test: toggle manual item addressed checkbox, verify state persists
- [ ] 10.6 Manual test: delete a manual item, verify removal
- [ ] 10.7 Manual test: copy output includes manual items
- [ ] 10.8 Manual test: print output includes manual items
- [ ] 10.9 Manual test: header icon buttons are tappable on mobile viewport
- [ ] 10.10 Manual test: Share button opens native share dialog on mobile (iOS Safari / Android Chrome)
- [ ] 10.11 Manual test: Share button falls back to clipboard copy on desktop browsers without Web Share API
