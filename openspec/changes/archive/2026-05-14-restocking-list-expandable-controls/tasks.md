## 1. Create Expandable Client Component

- [x] 1.1 Create a `RestockingListSection` client component in `src/components/` with collapsed/expanded toggle state.
- [x] 1.2 Render a compact header row showing "Restocking List" with a toggle indicator when collapsed.

## 2. Restocking List Content and Controls

- [x] 2.1 Move the existing grouped deficiency entries into the expandable content area.
- [x] 2.2 Remove the "Items Needing Attention" subtitle.
- [x] 2.3 Add a Print button visible only in expanded state that calls `window.print()`.
- [x] 2.4 Add a Copy button visible only in expanded state that calls `navigator.clipboard.writeText()` with restocking list text.
- [x] 2.5 Keep the Restocking List hidden when no exceptions exist.

## 3. Wire Into Unit Page

- [x] 3.1 Replace the inline Restocking List JSX in `src/app/units/[id]/page.tsx` with the new client component.
- [x] 3.2 Pass restocking list data as props to the component.

## 4. Verification

- [x] 4.1 Run `npm run typecheck` and `npm run lint`.
- [x] 4.2 Verify the Restocking List renders collapsed by default when exceptions exist.
- [x] 4.3 Verify Print and Copy buttons appear on expand and hide on collapse.
- [x] 4.4 Verify Copy copies the list text to clipboard.
- [x] 4.5 Verify "Items Needing Attention" no longer appears.
