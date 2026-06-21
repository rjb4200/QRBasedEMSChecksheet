## Context

The unit dashboard currently renders a `UnitSummaryCacheHint` component that shows a blue banner with text like "Prepared summary for EC1: 5/12 checks complete. Live server data is shown below." This banner reads a cached unit summary from localStorage (60-second TTL) and displays it immediately while live server data is fetched in the background. The server-rendered dashboard already shows accurate, current state — the banner just adds a flash of potentially stale information before the live data renders over it. The crew has requested this be removed as it provides no actionable value.

## Goals / Non-Goals

**Goals:**
- Remove the visual "Prepared summary for EC..." banner from the unit dashboard
- Remove the `UnitSummaryCacheHint` component file since it is not used elsewhere
- Keep the underlying unit summary caching infrastructure intact (it still serves the prefetch workflow)

**Non-Goals:**
- Do not remove the unit summary cache layer (`checkoff-cache.ts` functions)
- Do not change the unit summary API endpoint or its data shape
- Do not change the `CheckoffPrefetch` or `UnitSummaryPrefetch` components

## Decisions

**Decision 1: Delete the component entirely rather than conditionally hiding it**
- **Rationale**: The component is dead code after removal. No other page or component imports or uses `UnitSummaryCacheHint`. The caching infrastructure (`readCachedUnitSummary`, `writeCachedUnitSummary`) remains in `checkoff-cache.ts` because it is still used by the checkoff page prefetch flow (`UnitSummaryPrefetch`).
- **Alternatives considered**: Adding a feature flag to hide the banner. Rejected because the requirement is permanent removal, not conditional toggling.

**Decision 2: No change to the caching layer**
- **Rationale**: The `readCachedUnitSummary` and `writeCachedUnitSummary` functions in `checkoff-cache.ts` are also consumed by `UnitSummaryPrefetch` (background prefetch on checkoff page open/submit). Removing those functions would break the prefetch optimization. The cache data still gets written and read for prefetch purposes; we are only removing the visible banner that shows the cached data.

## Risks / Trade-offs

- **Risk**: Slightly longer perceived load time on the unit dashboard since there is no longer an instant cached summary shown while server data loads. **Mitigation**: The unit dashboard is already a server-rendered page; the data is available on page load. There is no loading spinner period — the server-side render already populates the completion counts and status cards.
