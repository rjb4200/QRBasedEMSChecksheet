## Context

The Fleet dashboard is a server component that loads fleet status, discrepancies, and renders client components for comments and exceptions. Adding an issues summary follows the same client-component pattern as `RecentComments`.

## Goals / Non-Goals

**Goals:**
- Show 3 most recent open/in_progress issues on the Fleet dashboard
- Each issue shows title, first tag badge, unit badge, status badge, and links to the detail page
- "Open Issues →" link to `/admin/issues?filter=active`
- Reduce exceptions from 7 days to 4 days, default to collapsed

**Non-Goals:**
- No create-issue from Fleet (use Issues page or comment escalation)
- No real-time updates
- No configurable issue count (hardcoded to 3)

## Decisions

### Decision 1: Client component separate from RecentComments

`RecentIssues` is its own component, not embedded in `RecentComments`. It queries the existing `GET /api/admin/issues` endpoint and filters to open + in_progress client-side, taking the 3 most recent.

**Rationale:** Clean separation of concerns. Comments and issues have different data models and display purposes.

### Decision 2: Compact row layout with badges

Each issue row shows: title (bold, truncated), first tag badge (if any), unit badge (if assigned), status badge (colored). The entire row is a Link to the detail page.

**Rationale:** Matches the issues list page style but more compact for the dashboard. Three rows fit in roughly the same height as one Recent Comments card.

### Decision 3: Exceptions default to collapsed, 4 days

The exceptions section `discrepancyRange` changes from 7 days to 4 days (from 6 back to 3). The `expandedDates` default changes to an empty set instead of showing the first 3 groups.

**Rationale:** 4 days is still useful for catching recent trends. Collapsing by default saves vertical space for the new issues summary.
