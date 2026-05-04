## Why

Supervisors and crews need to quickly identify which exceptions are new - items that have become below par or missing since the last completed checkoff. Currently, all exceptions appear the same, making it difficult to distinguish recurring issues from newly emerging problems. Adding a "NEW" badge to fresh exceptions helps prioritize immediate attention.

## What Changes

- Add "NEW" badge to exceptions panel for items that are below par today but were not exceptions in the last completed checkoff
- Add "NEW" badge to check sheet printouts for new exceptions
- The "NEW" indication is date-specific - it appears only on the day the exception first appears
- On the next day, the "NEW" badge is automatically dropped (items are either resolved or become "existing" exceptions)

## Capabilities

### New Capabilities

- `new-exception-badges`: Visual "NEW" indicator on exceptions that appeared since the last completed checkoff, shown only on the exceptions panel and printouts.

### Modified Capabilities

- None. This enhances existing exception display without changing core requirements.

## Impact

- Updates to exceptions panel to compare current exceptions against last completed check
- Updates to print document generation to include "NEW" badges
- Logic to query last completed check data for comparison
- No database changes required