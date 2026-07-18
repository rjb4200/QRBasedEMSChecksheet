## Context

The Fleet Matrix obtains live unit rows and current-shift daily ledger rows in `getFleetStatus`. When any ledger rows exist, it constructs the display list by placing every ledger-backed unit before live units without a ledger. A unit service-status change creates or updates one current-shift ledger row, so a partial ledger causes that changed unit to move to the beginning of the dashboard.

Fleet status is also retained in a module-level, current-shift cache for 60 seconds. Route revalidation does not clear that in-memory cache, so a successful status action can leave the dashboard stale until its cache expires.

## Goals / Non-Goals

**Goals:**

- Keep Fleet Matrix unit order stable when daily ledger coverage is incomplete.
- Order apparatus names naturally, so numbered units such as EC1 through EC7 appear in numeric sequence.
- Retain ledger-provided status and historical metadata.
- Make a completed service-status action visible on the next dashboard render.

**Non-Goals:**

- Reintroducing a ledger refresh write on every Fleet Matrix read.
- Changing daily-ledger schema, status history, or print/records ordering.
- Defining a manual administrator-controlled unit sort order.

## Decisions

### Sort the completed Fleet Matrix result by natural unit name

After merging the ledger and live sources and computing each unit's status, order the final `FleetUnit[]` by its display name using numeric-aware comparison. This preserves the existing ledger precedence for metadata while removing its accidental effect on presentation order.

Natural sorting is selected over raw SQL ordering because the result is assembled from two sources in application memory. It also correctly orders multi-digit unit names such as EC2 before EC10. A locale-sensitive, numeric comparison with a deterministic text fallback will ensure a stable result for non-numeric apparatus names.

Alternative considered: Refresh every active unit's ledger after a status change. Rejected because it reinstates broad write behavior and does not protect ordering if ledger coverage is partial for another reason.

### Export an explicit fleet-cache invalidation function

`fleet.ts` will expose a small cache-reset function. The service-status action will call it after the database and ledger updates succeed, before revalidating relevant routes. The next Fleet Matrix request will then recompute status from current data.

Alternative considered: Reduce the cache TTL or remove the cache. Rejected because it does not guarantee immediate correctness and would undo the existing query-load optimization.

### Test the partial-ledger status-transition path

Fleet aggregation coverage will simulate a current shift in which EC4 is ledger-backed while EC1-EC3 and EC5-EC7 come only from live unit data. The expected result remains EC1 through EC7. Unit action coverage will verify the status-transition workflow clears the fleet cache after successful persistence.

## Risks / Trade-offs

- [Natural ordering can vary with locale for non-EC labels] → Use a fixed comparison locale and a deterministic fallback.
- [Clearing a module cache only affects the current application instance] → This matches the existing cache scope; each instance independently refreshes within its normal request lifecycle.
- [A post-write cache reset must not occur after a failed persistence operation] → Invoke invalidation only after the unit and ledger operations complete successfully.

## Migration Plan

No database migration or backfill is required. Deploy the code change, then verify a service-status transition leaves EC1-EC7 ordered while its status badge updates on the next dashboard render. Rollback consists of reverting the code change; stored ledger data is unaffected.

## Open Questions

None.
