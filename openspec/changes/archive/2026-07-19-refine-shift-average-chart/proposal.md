## Why

The Shift Average card communicates the correct rolling data but its title, short bars, and detached percentage labels make the comparison harder to scan. Supervisors need an immediately visible 30-day comparison and recognition of the best-performing shift.

## What Changes

- Rename the chart from `Shift Average` to `30 Day Average` and remove its redundant operational-days subtitle.
- Overlay each completion percentage on its corresponding bar and increase the bar area height.
- Display a crown beside every available shift tied for the highest completion percentage.
- Keep unavailable shifts distinct from 0% shifts and do not crown them.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shift-completion-averages`: Refine the Records page chart presentation and identify the highest available shift percentage, including ties.

## Impact

- Updates `src/components/shift-completion-average-chart.tsx` and its presentation tests.
- Updates the existing shift-completion-averages specification.
- Does not change the 30-day data query, calculation, database schema, or external APIs.
