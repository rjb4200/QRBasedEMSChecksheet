## Why

The fleet page currently shows completion percentage but doesn't provide quick visual indicators for important daily checkoff details. Admin users need at-a-glance information about whether checks were completed early, if there are in-progress checks, current exception counts, new exceptions since yesterday, and if crew comments were added. This helps prioritize attention and track daily operations efficiently.

## What Changes

- Add status badges section to each unit card on the fleet page
- Badge for "Done before 10AM" - shows when unit's checkoff was locked before 10:00
- Badge for "In Progress" - shows when unit has uncompleted checkoff
- Badge for "Current Exceptions" - shows count of items below par
- Badge for "New Exceptions" - shows count of exceptions not present in yesterday's check
- Badge for "Has Comments" - shows indicator when crew comments were added to the checkoff

## Capabilities

### New Capabilities

- `fleet-status-badges`: Visual badges on fleet matrix showing checkoff completion time, progress status, exception counts, and comment presence for each unit.

### Modified Capabilities

- None. This is a UI enhancement that doesn't change core requirements.

## Impact

- Updates to fleet page unit card component to display status badges
- New data queries to calculate: early completion, in-progress status, exception counts, new exceptions, comments presence
- No database changes required