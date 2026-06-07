## Context

The chart currently gets its data by calling `getDailyUnitRecords({})` a second time (fleet-wide, no filter) and using the `groups` output. This function was designed for the detailed records view — it queries units, ledgers, compartments, checks, archives, crews, comments, and section comments, then builds complex `DailyUnitRecord` objects with restocking lists, exceptions, and timestamps. For the chart, only three fields per group are needed: `date`, `completedInServiceUnits`, `totalInServiceUnits`.

The pipeline has two code paths (ledger presence vs fallback) with different checkMap construction and different completion calculation logic. This duplication is fragile and makes the chart data unreliable when edge cases occur.

## Goals / Non-Goals

**Goals:**
- Give the chart its own lightweight data function that queries only what it needs.
- Compute completion counts directly from database aggregates without building `DailyUnitRecord` objects.
- Output the existing `DailyRecordGroup[]` type so `CompletionTrendChart` needs zero changes.
- Simplify the page by replacing the second `getDailyUnitRecords({})` call.

**Non-Goals:**
- Do not change `getDailyUnitRecords`, `buildLedgerBackedDailyUnitRecords`, or `groupDailyUnitRecords` — they continue serving the records list.
- Do not redesign the chart component or its visual appearance.
- Do not change how the records list or filters work.

## Decisions

1. Create a new `getTrendGroups()` function that directly queries the 14-day range.

   Rationale: A dedicated function is simpler than debugging the existing pipeline. It queries only `daily_unit_ledgers`, `compartment_checks`, and `daily_unit_crews` for the date range, avoiding the complex per-date record building.

   Alternative considered: Fix the existing pipeline by tracing the exact bug. Rejected because the pipeline has two separate checkMap implementations and untangling them is riskier than a focused rewrite.

2. Compute the `> 95%` completion rule directly from the data.

   For each date in the range:
   - `totalInServiceUnits` = count of ledgers with `unit_status = 'in_service'`
   - `completedInServiceUnits` = count of those where `(completed_compartments + (crewLocked ? 1 : 0)) / (total_compartments + 1) * 100 > 95`

   Rationale: This matches the existing rule in `getCheckStatus` and `groupDailyUnitRecords` without building the full `DailyUnitRecord` type.

3. Make the function a `"use server"` action or a regular async function called from the server component.

   Rationale: The chart data is fetched server-side during page render. A regular async function using `createAdminClient` works without any client-side fetching.

4. Keep `CompletionTrendChart` as a server component accepting `groups: DailyRecordGroup[]`.

   Rationale: The chart is purely presentational. Changing only the data source is the minimal fix.

## Risks / Trade-offs

- The new function runs additional database queries where previously the chart shared data with the records fetch. Mitigation: the queries are lightweight (counts + aggregations across 14 days) and use the same Supabase client, typically 2-3 parallel queries.
- The completion rule is duplicated between the chart function and the records function. Mitigation: extract the `> 95%` check into a shared helper used by both.
