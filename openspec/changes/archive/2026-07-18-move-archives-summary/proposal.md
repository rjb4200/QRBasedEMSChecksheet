## Why

The Records page separates the readiness summary from the selected-date unit records it describes. Placing the summary immediately after the date makes the page easier to scan before reviewing individual unit cards.

## What Changes

- Move the Checked, Incomplete, Not Started, Not Required, and Exceptions summary from its current standalone position to directly below the selected date and above the unit cards on `/admin/archives`.
- Preserve the selected date, unit filter, summary values, progressive loading behavior, and all existing Records controls.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `daily-readiness-ledger-records`: Define the selected-date summary's placement above the unit records it summarizes.

## Impact

- `src/app/admin/archives/page.tsx` page section ordering and loading boundaries.
- `openspec/specs/daily-readiness-ledger-records/spec.md` layout requirement.
