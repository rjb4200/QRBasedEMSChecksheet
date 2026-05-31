## Why

The system log page shows each row as a collapsed entry with the action verb and actor/target, but the actual state change (what happened) is hidden inside expandable JSON. Parsing `before_data` and `after_data` into a short summary sentence on each collapsed row lets admins scan the log without expanding every entry.

## What Changes

- Add a server-side helper that generates a human-readable summary sentence for each log row using `before_data`, `after_data`, `metadata`, and `message` fields.
- Display the summary as the primary description line in each collapsed log row.
- Preserve existing expanded detail view with raw JSON.

## Capabilities

### Modified Capabilities

- `system-activity-log`: Each log row displays a human-readable summary sentence instead of relying on expanding to see what changed.

## Impact

- Affects the system log page rendering and a new utility function.
- No database schema changes.
