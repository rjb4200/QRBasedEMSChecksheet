## Context

The Fleet Panel summarizes unit checkoff status using current unit records and, when available, today's `daily_unit_ledgers` service snapshot. Existing requirements already say the Fleet Panel uses ledger unit status, archived flag, and status note for unit service display, but archived unit visibility is not explicitly constrained.

## Goals / Non-Goals

**Goals:**
- Ensure archived units are excluded from Fleet Panel cards.
- Preserve visibility for active units and out-of-service units.
- Apply filtering consistently whether status comes from today's ledger snapshot or the unit fallback data.

**Non-Goals:**
- Change archived unit behavior outside the Fleet Panel.
- Change checkoff URLs, unit management screens, or historical records.
- Change badge styling or status labels for visible units.

## Decisions

1. **Filter before rendering Fleet Panel cards**
   - Rationale: The Fleet Panel should receive or derive a list of operationally relevant units, so archived units do not participate in card rendering, badge computation, or empty-state logic.
   - Alternative considered: Hide archived cards only in JSX. Rejected because archived units could still affect counts or derived status data.

2. **Treat out-of-service as visible even when unavailable for checks**
   - Rationale: OOS units are operationally important to display because crews need awareness that the unit is unavailable.
   - Alternative considered: Hide all non-active units. Rejected because it would remove OOS visibility requested by the current Fleet Panel behavior.

3. **Prefer ledger archived state when today's snapshot exists**
   - Rationale: Existing behavior uses today's ledger snapshot for service display, so the archived visibility decision should match the same effective service state.
   - Alternative considered: Always use `units.archived`. Rejected because it can conflict with the daily snapshot requirement.

## Risks / Trade-offs

- **Risk**: Archived units may still be included in upstream data and affect derived counts.
  - **Mitigation**: Apply the filter in the fleet status computation before returning card data.
- **Risk**: Status/archived field names may differ between `units` and `daily_unit_ledgers`.
  - **Mitigation**: Verify the existing data mapping and filter on the effective archived flag already used for display.
- **Risk**: An archived unit marked OOS in stale data could be ambiguous.
  - **Mitigation**: Archived state wins for Fleet Panel visibility; only non-archived active and non-archived OOS units are shown.
