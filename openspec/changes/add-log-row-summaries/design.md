## Context

The system log stores structured data in `before_data`, `after_data`, and `metadata` JSONB columns, plus `message` text and `action` string. These are displayed as raw JSON in expanded detail panels. The collapsed summary only shows the action name and actor/target — nothing about what actually happened.

## Goals / Non-Goals

**Goals:**

- Generate a one-line summary sentence for each log row from existing data.
- Support common actions: `unit.status_changed`, `unit.created`, `unit.archived`, `daily_report.*`, `rotate_records`, `crew.locked`, and generic fallback.
- Keep the summary readable without expanding the row.

**Non-Goals:**

- Change how log data is written.
- Parse every possible action — use a generic fallback for unrecognized actions.

## Decisions

1. Generate summaries server-side during page render.

   A pure function that takes a log row and returns a string. This keeps the summary logic testable and doesn't add client-side complexity.

   Alternative: client-side parsing. Would run after page load and could flash content.

2. Match on action prefix for summary generation.

   Use `action.startsWith()` to group related actions (e.g., `unit.*`, `daily_report.*`) and extract relevant fields from data columns.

   Alternative: full action name matching. Requires updating the helper for every new action.

3. Generic fallback shows actor + action + target.

   When no specific handler matches, show: `{actor} {action} on {target}`. Same as the current display but formatted as a sentence.

## Risks / Trade-offs

- `before_data`/`after_data` may have inconsistent shapes across different log sources → handle missing keys gracefully and fall back to generic summary.
- Summary could get long → cap at a reasonable length per line.
