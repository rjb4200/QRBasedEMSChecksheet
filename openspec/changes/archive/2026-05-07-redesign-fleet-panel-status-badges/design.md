## Context

The current Fleet Panel renders each unit card with percentage, progress bar, completed/in-progress text, a conditionally emphasized `View Checkoff` link, and an optional admin `Manage Unit` link. This mixes operational status with navigation styling, making the page less scannable during morning operations.

Fleet status is currently computed in `src/lib/fleet.ts` from `units`, `compartment_checks`, and `daily_unit_crews`, then rendered by `src/components/fleet-matrix.tsx`. The current data shape does not include completion timestamp, exception count, comment presence, or explicit crew completion state. No existing daily unit comment storage was found in the codebase or migrations, so comment badges require either an existing external table not represented locally or a small local table/migration.

## Goals / Non-Goals

**Goals:**
- Make unit cards scannable through compact operational badges.
- Keep exactly one primary status badge per card.
- Show completion time for complete units using the latest required component timestamp.
- Show exception counts, comment presence, and crew missing state only when applicable.
- Remove the `Manage Unit` action from Fleet Panel cards.
- Avoid N+1 data fetching for badge values.

**Non-Goals:**
- Do not redesign the full Fleet Panel layout.
- Do not remove or change `View Checkoff` navigation.
- Do not change checkoff submission, archive, or unit management behavior.
- Do not implement optional future badges such as `Below Par`, `Late`, or `Recheck Required`.

## Decisions

**Compute badges in the fleet status layer.**

`src/lib/fleet.ts` should return badge-ready fields so the component stays mostly presentational:
- `completedAt?: string | null`
- `exceptionCount: number`
- `hasComments: boolean`
- `crewComplete: boolean`

This keeps Fleet Matrix rendering simple and ensures future CSV/API consumers can reuse the same operational state if needed.

**Use one primary badge derived from operational state.**

Primary badge priority:
1. Out of service
2. Completed time
3. In progress
4. Not started

This avoids competing state labels. Complete status uses the latest completed timestamp among required checks and crew lock completion if that timestamp is available.

**Use existing records for exception counts.**

Exception counts should be derived in bulk for the current shift from completed/current check item data where possible, using the same exception rules already used by discrepancy reporting: missing values, below-par quantities, and failed condition checks. If the existing discrepancy helper cannot be reused without extra per-unit queries, add a small aggregation helper in `fleet.ts` or a shared utility.

**Add minimal comment storage only if none exists.**

Because no local comment table exists, implementation should add a minimal `daily_unit_comments` table only if the deployed schema does not already provide one. The badge only needs to know whether a nonblank comment exists for `unit_id`, `shift_date`, and `shift_period`; comment editing UI is outside this change unless already present elsewhere.

**Preserve the current layout shape.**

The card should keep unit identity, percentage, progress bar, completion count, and `View Checkoff`. Badge rows replace status text clutter and button-state styling. Blue/dark emphasis should not indicate in-progress state.

## Risks / Trade-offs

- **Completion timestamp may be incomplete for crew completion**: `daily_unit_crews` may not currently store a lock timestamp. Use check completion timestamps for required check targets and add/use a crew timestamp only if available.
- **Exception counting can be expensive**: Avoid per-unit checks by fetching current-shift checks once and aggregating in memory or server-side.
- **Comment schema uncertainty**: If production already has a comment table not represented in migrations, implementation must reuse it instead of creating a duplicate.
- **Badge clutter**: Keep secondary badges conditional and compact so cards stay scannable.

## Migration Plan

1. Extend fleet status data fetching and types for badge fields.
2. Add/reuse daily unit comment presence data.
3. Aggregate current-shift exception counts by unit.
4. Update Fleet Matrix rendering to badges and remove `Manage Unit`.
5. Verify desktop and mobile wrapping, typecheck, and lint.
