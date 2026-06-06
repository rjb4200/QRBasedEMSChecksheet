## Why

The current issues page crams everything — description, tags, notes, status changes — into expandable sections within a single card. As issues grow in complexity, this becomes hard to scan and harder to work with. A split list/detail pattern (like GitHub Issues) separates discovery from deep work: admins scan a clean list to find what matters, then click into a dedicated detail page for full context, threaded notes, and status changes.

## What Changes

- Redesign `/admin/issues` as a clean table-style list page with scannable rows (title, tags, unit, status, date)
- Create `/admin/issues/[id]` as a dedicated detail page with full description, threaded notes, tag editing, and a status dropdown
- Clicking an issue row navigates to the detail page; a "← Back" link returns to the list
- The create-issue form and filter/sort bar remain on the list page
- No API changes — all existing endpoints are reused; the detail page fetches a single issue + notes

## Capabilities

### New Capabilities

- `issue-detail-page`: A dedicated detail page at `/admin/issues/[id]` showing full issue metadata, threaded notes, tag editing, and status changes, with back-navigation to the list

### Modified Capabilities

- `issue-tracker`: The main issues page is redesigned from expandable card layout to a scannable table-style list with clickable rows navigating to the detail page

## Impact

- **New files**: `src/app/admin/issues/[id]/page.tsx`
- **Modified files**: `src/app/admin/issues/page.tsx` (redesigned as list view)
- **API**: No changes — all existing endpoints are reused
- **Database**: No changes
