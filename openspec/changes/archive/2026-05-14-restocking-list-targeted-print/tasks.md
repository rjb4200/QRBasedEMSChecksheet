## 1. Update Print Button Handler

- [x] 1.1 Replace `window.print()` in `RestockingListSection` with a function that opens a new window containing only the restocking checklist HTML.
- [x] 1.2 Include a title and unit context in the print window when available.
- [x] 1.3 Close the print window automatically after the print dialog is dismissed.

## 2. Verification

- [x] 2.1 Run `npm run typecheck` and `npm run lint`.
- [x] 2.2 Verify the Print button opens a new window with only restocking items, not the full unit page.
- [x] 2.3 Verify the Copy button behavior remains unchanged.
- [x] 2.4 Verify the print window closes after printing.
