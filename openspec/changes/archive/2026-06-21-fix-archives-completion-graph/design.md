## Context

The Archives page loads selected-day Records detail data through `getDailyUnitRecords()`, but its completion trend chart separately calls `getTrendGroups()`. That helper duplicates date range, ledger, checks, crew, percentage, and threshold logic and does not share the same grouping path as Records detail rows.

Issue #117 confirms the database data for 2026-06-07 is correct, but the graph numerator is wrong. The safest fix is to remove the duplicate graph-specific helper and feed the chart from `getDailyUnitRecords({}).groups`, which is already built from `DailyUnitRecord` values and `groupDailyUnitRecords()`.

## Goals / Non-Goals

**Goals:**

- Make the Archives graph numerator match Records detail completion grouping.
- Remove the stale duplicate trend helper and inconsistent threshold.
- Add focused regression coverage for a 96% unit counting complete under `completionPercentage > 95`.

**Non-Goals:**

- Do not change the official completion threshold.
- Do not change archive schema or live database data.
- Do not redesign the Archives page.

## Decisions

- Use `getDailyUnitRecords({})` for chart groups.
  - Rationale: This is the existing official Records read model and avoids a second source of truth.
  - Alternative considered: Patch `getTrendGroups()` to match the threshold. Rejected because it would preserve duplicate logic and future drift risk.

- Remove `getTrendGroups()` entirely.
  - Rationale: Search shows only the Archives page uses it, so removal prevents stale imports and debug logging.

## Risks / Trade-offs

- The chart query may load richer records than the old helper -> The page already uses the same read model for Records data, and correctness is more important than preserving a broken optimized path.
- Existing broad lint failures may still block `npm run lint` -> Record unrelated failures if they persist after this focused change.
