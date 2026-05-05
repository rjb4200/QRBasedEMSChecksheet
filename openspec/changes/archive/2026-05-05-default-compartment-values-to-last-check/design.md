## Context

Currently, when a crew begins a new daily checkoff, all compartment items default to their par values. This means crews must manually adjust each item that differs from par, even when the actual inventory hasn't changed since yesterday. The current checkoff workflow stores target item data in `compartment_checks` and crew lock state in `daily_unit_crews`.

## Goals / Non-Goals

**Goals:**
- Default compartment check values to the most recent completed check within 7 days
- Fall back to par values when no completed check exists within 7 days
- Preserve the existing checkbox default behavior (items default to checked)

**Non-Goals:**
- Changing how par values are stored or managed
- Modifying the print or records functionality
- Adding any new database columns

## Decisions

### 1. Query Strategy

**Decision:** Query for the most recent completed check by looking at `daily_unit_crews` records with `locked = true` within the last 7 days, using `updated_at` as the lock-time ordering value.

**Rationale:** A "completed check" is defined by the crew lock being engaged. The current `daily_unit_crews` table tracks lock state with the `locked` boolean and updates `updated_at` when the lock action is saved.

**Implementation:**
1. For the given unit, query `daily_unit_crews` for records within the last 7 days where `locked = true`
2. Order by `updated_at` descending to get the most recent locked crew record
3. Use the matching `compartment_checks.item_data` for the selected shift to populate default values

### 2. Fallback Logic

**Decision:** If no completed check exists within 7 days, use par values from the unit's compartment configuration.

**Rationale:** Par values are the safest default when no recent data exists, as they represent the expected inventory level.

### 3. Item Matching

**Decision:** Match compartment items by their `compartment_id` when copying values from the previous check.

**Rationale:** Each compartment has a consistent ID across checks, allowing reliable matching of items.

## Risks / Trade-offs

- **Performance:** Querying for previous check adds a small delay to page load. Mitigated by efficient DB query with date filter.
- **Data Consistency:** If previous check had incorrect values, those errors propagate. Mitigated by crews still reviewing and adjusting as needed.
- **New Units:** Units with no previous checks will correctly fall back to par values.

## Migration Plan

1. Update checkoff page data fetching to query previous check values
2. Implement logic to get most recent completed check within 7 days
3. Populate default values from previous check or fall back to par
4. Test with units that have recent completed checks
5. Test with units that have no recent checks (fallback to par)
6. Deploy to production

## Open Questions

- Should we show a indicator when values are pulled from previous check vs par? (Optional enhancement, not required)
- How to handle items that existed in previous check but were later removed? (Ignore removed items, only include current compartment items)
