## Why

The Records page print action currently uses a server-rendered date value, so if an admin changes the date input and clicks Print without first clicking Filter, the printed output can show the wrong date. The print workflow should respect the current form values immediately and preserve the selected unit filter as well.

## What Changes

- Update the Records page Print action so it submits the current form values at click time instead of using a stale server-rendered link.
- Preserve both the selected `date` and `unitId` when opening `/admin/archives/print`.
- Keep the print route's current behavior of honoring the `date` query parameter and defaulting to today only when no date is supplied.
- Preserve existing archive records logic, daily ledger calculations, checkoff behavior, and print layout.

## Capabilities

### New Capabilities
- `records-print-form-sync`: The Records page print action uses the current filter form values without requiring a prior page reload.

### Modified Capabilities
- `archive-history`: Historical daily record printing now guarantees the print action uses the current Records page date and unit filter values at click time.

## Impact

- **UI**: Update `src/app/admin/archives/page.tsx` to make Print submit the current form values.
- **Print route**: Continue using `src/app/admin/archives/print/page.tsx` with `date` and `unitId` query params.
- **Behavior**: No changes to archive record calculation, checkoff submission, or print layout.
