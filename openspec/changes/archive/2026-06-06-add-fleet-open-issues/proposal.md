## Why

Admins currently must navigate to the Issues page to see open issues. The Fleet dashboard is their primary operational view — open issues should be visible there at a glance alongside unit status. Additionally, the Exceptions section defaults to 7 days and starts expanded, taking significant space. Reducing it to 4 days collapsed makes room.

## What Changes

- Add an "Open Issues" summary card to the Fleet dashboard showing the 3 most recent open or in-progress issues with title, tags, unit, status badge, and a link to view details
- Add a "View all" link to the Issues page
- Reduce the Exceptions date range from 7 to 4 days and default it to collapsed
- Create a `RecentIssues` client component that fetches from the existing issues API

## Capabilities

### New Capabilities

- `fleet-issues-summary`: An open-issues summary card on the Fleet dashboard showing the 3 most recent active issues with key metadata and links to the Issues page

## Impact

- **New files**: `src/components/recent-issues.tsx`
- **Modified files**: `src/app/admin/page.tsx` (add RecentIssues component, reduce exception range, collapse default)
- **API**: Uses existing `GET /api/admin/issues` — no new routes
- **Database**: No changes
