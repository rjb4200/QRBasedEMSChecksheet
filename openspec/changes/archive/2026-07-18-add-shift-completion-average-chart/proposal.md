## Why

The Records page shows recent daily completion but does not reveal how the rotating 1st, 2nd, and 3rd shift assignments compare over time. Administrators need an at-a-glance, workload-aware 30-day shift comparison alongside a shorter recent daily view.

## What Changes

- Reduce the Daily Completion chart from fourteen to nine recent operational dates.
- Add a 30-day, action-weighted average completion chart for 1st, 2nd, and 3rd Shift.
- Place the two charts side by side on extra-large screens and stack them on smaller screens.
- Assign each summary date from `shift_calendar`, falling back to the configured rotation only when no calendar record exists.

## Capabilities

### New Capabilities

- `shift-completion-averages`: Action-weighted, 30-day completion averages grouped by the rotating shift assigned to each operational date.

### Modified Capabilities

- `daily-check-work-completion-trend`: Display nine recent operational dates and share the Records dashboard row with the shift-average chart.

## Impact

- Adds a server-side Records read model and presentation component for shift averages.
- Updates the existing Daily Completion chart query and responsive Records layout.
- Uses existing completion summaries and shift calendar data; no write-path or schema migration is required.
