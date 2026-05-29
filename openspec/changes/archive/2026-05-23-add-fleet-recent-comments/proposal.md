## Why

The Fleet Panel is the main operational overview page, but supervisors currently need to open Records for each date to see what section comments crews have submitted. A collapsed Recent Comments browser on the Fleet Panel gives supervisors a quick way to scan recent notes across all units without leaving the page.

## What Changes

- Add a collapsed-by-default Recent Comments section to the Fleet Panel between the daily checksheet print bar and the Exceptions section.
- Lazy-load section comments from all units for the last 7 rolling days only when the section is expanded.
- Display each comment with unit name, source compartment/kit name, relative date/time, and comment text, ordered newest first.
- Show a loading state while comments are fetching and an empty state when no comments exist.
- Limit results to 50 most recent comments with a link to Records for deeper review.
- Keep the Fleet Panel initial load speed unaffected by the new feature.

## Capabilities

### New Capabilities
- `fleet-recent-comments`: A lazy-loading collapsed Recent Comments browser on the Fleet Panel showing section comments from the last 7 days.

### Modified Capabilities
- `fleet-dashboard`: The Fleet Panel now includes an optional Recent Comments section between the print bar and the Exceptions section.

## Impact

- **New API route**: `src/app/api/admin/recent-comments/route.ts`
- **New component**: `src/components/recent-comments.tsx`
- **Fleet page**: Update `src/app/admin/page.tsx` to include the component.
- **Behavior**: No changes to checkoff, Records, email, notifications, or existing Fleet Panel unit status behavior.
