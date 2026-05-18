## Why

The unit dashboard previously loaded Previous Exceptions during initial page render, requiring historical archive queries and exception-comparison logic that delayed the first usable view. Those cards were removed to declutter the page, but crews still benefit from knowing about unresolved exceptions from the prior shift. This change brings back previous-exception checking as a deferred background load that never blocks the dashboard.

## What Changes

- Add an API route `GET /api/units/[id]/previous-exceptions` that queries the most recent shift archive and returns a list of unresolved exceptions from that shift. If no archive exists, fall back to computing potential exceptions from the unit's equipment par levels.
- Create a `PreviousExceptionsPanel` client component that renders after the dashboard mounts.
- The panel shows "Checking previous exceptions..." during the fetch, a summary with count when results arrive.
- On fetch failure, the panel gracefully degrades to showing nothing rather than displaying an error or retry control.
- The panel updates itself without reloading the page or resetting dashboard state.
- The initial dashboard query does NOT load historical archive data or full equipment catalog data for previous exceptions.

## Capabilities

### New Capabilities
- `deferred-previous-exceptions`: The unit dashboard automatically checks for previous-shift exceptions in the background after the page becomes usable.

### Modified Capabilities
- `unit-comments`: The unit page may now display a previous-exceptions panel loaded asynchronously after initial render.

## Impact

- **Code**: New API route `src/app/api/units/[id]/previous-exceptions/route.ts`, new client component `src/components/previous-exceptions-panel.tsx`, updated `src/app/units/[id]/page.tsx`.
- **Database**: Query `shift_archives` for the most recent previous shift with matching unit_id. No new tables or migrations.
- **Dependencies**: None.
