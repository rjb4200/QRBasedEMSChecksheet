## Why

Fleet Panel comments currently show the unit, source, date/time, and comment text, but not the crew associated with the unit for that shift. Adding crew names as tags gives supervisors immediate context about who was assigned when the comment was made.

## What Changes

- Include crew/provider names with each Fleet Panel Recent Comments row when available.
- Render crew names as a compact visual tag on comment rows.
- Preserve existing unit, source, date/time, comment text, ordering, compact preview, and expanded 10-day behavior.
- Omit the crew tag when no crew names are available for the comment's unit/date/shift.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `fleet-recent-comments`: Comment rows will include crew/provider name tags when crew data exists for the matching unit, shift date, and shift period.

## Impact

- Affects the Fleet Recent Comments API/query and row rendering.
- May require joining or separately mapping `daily_unit_crews` by unit/date/shift.
- No database schema changes expected.
- No new dependency expected.
