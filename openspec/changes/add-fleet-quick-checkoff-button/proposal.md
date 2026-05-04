## Why

Admin users need quick access to view the current status of in-progress daily checkoffs directly from the fleet matrix. Currently, admin must navigate through multiple pages to check on crew progress. Adding a quick action button to each unit card on the fleet matrix will streamline this workflow.

## What Changes

- Add a "View Checkoff" button to each unit card on the admin fleet matrix page
- The button navigates directly to the unit's daily checkoff page (`/units/[id]`)
- This allows admin to quickly monitor crew progress without additional navigation steps
- The button is visible for all unit states (in-progress, completed, not started)

## Capabilities

### New Capabilities

- `fleet-quick-checkoff`: Quick access button on fleet matrix unit cards that navigates to the daily checkoff page for real-time progress monitoring.

### Modified Capabilities

- None. This is a UI enhancement that doesn't change existing requirements.

## Impact

- Updates to admin fleet page component to add button to each unit card
- No database changes required
- No changes to authentication or authorization
- No changes to public checkoff flow