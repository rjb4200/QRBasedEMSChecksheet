## Why

Crew members report problems in daily unit comments — broken equipment, supply shortages, safety concerns — but these comments are shift-scoped and disappear with data rotation. The admin has no way to escalate a comment into a persistent tracked issue without manually re-typing everything into the Issues page. Bridging these two systems lets an admin create a tracked issue directly from a crew comment in one click.

## What Changes

- Add a "Create Issue" button to each comment card in the Fleet panel's Recent Comments widget
- Clicking the button opens an inline form pre-filled with the comment text as the issue description, the unit name as the title prefix, and the unit auto-selected
- The form submits to the existing `/api/admin/issues` POST endpoint, creates the issue, and collapses the form inline
- No new API routes, no database changes — only UI changes on the recent-comments component

## Capabilities

### New Capabilities

- `comment-to-issue-escalation`: An inline escalation form on the Fleet panel's Recent Comments widget that lets admins create tracked issues from crew-submitted unit and section comments

### Modified Capabilities

- `issue-tracker`: The existing `/api/admin/issues` POST endpoint already supports creating issues; no API changes are needed, but the escalation feature extends the issue creation entry points

## Impact

- **Modified files**: `src/components/recent-comments.tsx` (add "Create Issue" button + inline escalation form per comment card)
- **New files**: None
- **API**: No new routes — uses existing `POST /api/admin/issues`
- **Database**: No changes — uses existing `issues` table
