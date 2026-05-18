## Context

The "Previous Exceptions" section was removed from the unit dashboard in May 2026 to declutter the page and eliminate blocking historical queries from the initial render. However, crews still need visibility into unresolved exceptions from the prior shift — especially items that failed yesterday's check and may still need attention today.

The current unit dashboard (`src/app/units/[id]/page.tsx`) loads only current-shift data in a single `Promise.all` block. The `shift_archives` table stores completed check data as a `check_data` JSONB column keyed by compartment/kit ID, along with `completion_percentage` and `completed_compartments` counts.

The `getPreviousShift()` utility already exists in `src/lib/shifts.ts` and returns the previous shift's date and period.

## Goals / Non-Goals

**Goals:**
- Fetch previous-shift exceptions from an API route after the dashboard renders.
- Show a loading state while the fetch runs.
- Show a summary count when exceptions are found.
- Show "No previous exceptions found" when none exist.
- On fetch failure, show nothing — degrade silently rather than confusing the crew with error messages or retry controls.
- Update only the panel — never reload the page or reset form state.

**Non-Goals:**
- Do not load previous exceptions in the initial page render query.
- Do not change how exceptions are calculated.
- Do not change current-day checkoff logic, completion logic, or archive behavior.
- Do not load full equipment catalog data for previous exceptions.

## Decisions

### Decision 1: API route for previous exceptions

**Choice**: Create `GET /api/units/[id]/previous-exceptions` as a server-side route that queries `shift_archives` for the most recent previous shift and computes exceptions from the `check_data` JSONB column.

**Rationale**: Keeps the computation server-side so the client only receives a lightweight result (exception count and item names). Avoids shipping check-data logic to the client or loading full equipment catalog data.

**Alternatives considered**: Server action. Rejected because API routes are simpler for GET-only data fetches that don't mutate state, and the client can use `fetch()` with standard error handling.

### Decision 2: Client component with `useEffect` fetch

**Choice**: A `"use client"` `PreviousExceptionsPanel` component that uses `useEffect` to fetch the API route on mount. State: `idle → loading → loaded | empty | error`.

**Rationale**: Simple React pattern with no extra dependencies. The component is self-contained and updates only its own DOM subtree.

### Decision 3: Check only the most recent previous shift archive

**Choice**: Query the single most recent `shift_archives` row with `unit_id` matching and `operational_date < current` ordered descending.

**Rationale**: Crews care about the immediate previous shift's outstanding items. Checking multiple historical shifts adds query cost with diminishing returns. The `shift_archives_unit_idx` on `(unit_id, shift_date desc)` already supports this efficiently.

### Decision 4: Exception computation with par-level fallback

**Choice**: The API route first queries `shift_archives` for the most recent prior shift's `check_data` JSONB. If found, it computes exceptions from the archived check data. If no archive exists or the query fails, the route falls back to computing potential exceptions using the unit's equipment items and their configured par levels — any quantity item with `par_level > 0` or any checkbox item is flagged as a potential exception.

**Rationale**: The crew benefits from exception visibility even when yesterday's archive is missing. Rather than showing a confusing retry button or error message, the system uses the unit's own equipment configuration to estimate what might need attention. Par levels are straightforward to query from `unit_compartment_items` and `kit_items` and don't require historical archive data.

### Decision 5: Silent degradation on client fetch failure

**Choice**: If the client fetch fails entirely (network error, 500, timeout), the panel renders nothing — the component returns null.

**Rationale**: A retry button presents a confusing UX for crews who don't know what it does or why it failed. The previous-exceptions panel is advisory, not critical. A silent miss is better than an unexplained error state.

## Risks / Trade-offs

- **Risk**: `shift_archives` may not have a row for the previous shift (e.g., unit was not checked yesterday). → **Mitigation**: Fall back to par-level-based exception estimation from `unit_compartment_items` and `kit_items`.
- **Risk**: The API route adds a small additional query load per dashboard view. → **Mitigation**: Archive query is a single indexed lookup; par-level fallback query is also lightweight. Both together are minimal overhead.
- **Trade-off**: Par-level fallback may over-count exceptions (items that were actually stocked yesterday show as potential exceptions). → Acceptable — it errs on the side of showing things that might need attention, which is operationally safer than missing them.
- **Trade-off**: Client failure results in the panel silently disappearing. → Acceptable — the panel is non-critical advisory content; a crew who needs detailed exception history can visit the Archives page.

## Migration Plan

1. Deploy new API route and client component.
2. Add `<PreviousExceptionsPanel>` to the unit dashboard page.
3. No database changes needed — `shift_archives` and its indexes already exist.
4. Rollback: remove the component import and the API route file.
