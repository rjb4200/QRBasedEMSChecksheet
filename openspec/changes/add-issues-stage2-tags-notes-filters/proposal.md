## Why

The Stage 1 issues tracker provides a basic list of operational problems with status transitions, but offers no way to categorize, add ongoing context, or efficiently find issues. As the issue count grows, admins need tags to group related problems, notes to log updates over time, and filters/sorting to quickly locate what matters.

## What Changes

- Add a `tags` text array column to the `issues` table for lightweight categorization (equipment, maintenance, safety, etc.)
- Create an `issue_notes` table and API for threaded admin notes on each issue, enabling conversation-like context over time
- Add a filter bar to the Issues page: unit dropdown, tag dropdown (populated from all tags in use), and free-text search
- Add a sort dropdown: newest first (default), oldest first, recently updated, title A-Z
- Update the Issues page card layout to show tag badges and an expandable notes section
- Update the issue API (PUT) to accept tag updates
- Create a notes API (`GET/POST /api/admin/issues/[id]/notes`) for adding and listing notes

## Capabilities

### New Capabilities

- `issue-tags`: Tag-based categorization on issues using a text array column, displayed as badges on issue cards with tag filtering
- `issue-notes`: Threaded admin notes on issues — a new `issue_notes` table with API endpoints for adding and listing notes per issue
- `issue-filters-and-sort`: Expanded filtering (unit, tag, search) and sorting (date, title) on the Issues page

### Modified Capabilities

- `issue-tracker`: The issues API and page are extended to support tags, notes, filters, and sorting — all additive changes to the existing issue lifecycle

## Impact

- **New files**: `src/app/api/admin/issues/[id]/notes/route.ts`
- **Modified files**: `src/app/admin/issues/page.tsx` (filter bar, sort, tag badges, notes section), `src/app/api/admin/issues/route.ts` (accept tags in POST), `src/app/api/admin/issues/[id]/route.ts` (accept tags in PUT)
- **Database**: New `tags text[]` column on `issues`, new `issue_notes` table with FK to issues
- **Dependencies**: None
