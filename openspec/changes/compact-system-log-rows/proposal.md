## Why

System log rows currently stack the action name, summary, and a redundant UUID column on separate lines. Removing the UUID column and placing the action and summary inline with the badges makes scanning faster and the page denser.

## What Changes

- Remove the right-side target_type/target_id column from collapsed log rows.
- Display the action name and summary inline after the result/area/timestamp badges on one line.
- Preserve the existing expanded detail view.

## Capabilities

### Modified Capabilities

- `system-activity-log`: Collapsed log rows display inline badges, action, and summary on a single line.

## Impact

- Affects `src/app/admin/system-log/page.tsx`.
