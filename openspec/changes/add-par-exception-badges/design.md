## Context

The compartment check pages display items with their current values (from previous check or par defaults). When items deviate from par, crews need immediate visual indication. Currently, all items look the same regardless of their relationship to par values.

## Goals / Non-Goals

**Goals:**
- Display yellow badge on items above par (count > par)
- Display red badge on items below par (count < par) or missing (count = 0)
- Show the par value in the badge for reference
- Only show badges on items that differ from par

**Non-Goals:**
- Changing the default values (that is handled by separate smart-defaults feature)
- Adding badges to items that match par
- Modifying print output (only visible on digital checkoff pages)

## Decisions

### 1. Badge Placement

**Decision:** Place the badge to the left of the item name or above the quantity input.

**Rationale:** This position is visible without obscuring the item name or input field. It should be the first thing noticed when scanning the list.

### 2. Badge Content

**Decision:** Badge shows a symbol (+ for above, ! for below) and the par value, e.g., "+2 PAR:5" or "!0 PAR:3".

**Rationale:** Showing both the deviation and the par value gives crews complete information at a glance.

### 3. Color Scheme

**Decision:** Yellow (#F59E0B / amber-500) for above par, Red (#EF4444 / red-500) for below par/missing.

**Rationale:** These colors are standard warning colors - yellow for caution/over, red for critical/under. They provide clear visual distinction.

### 4. Comparison Logic

**Decision:** Compare current item count against the compartment item's par value from the unit's configuration.

**Rationale:** Each compartment item has a defined par value in the unit's configuration. This is the source of truth for what "normal" looks like.

## Risks / Trade-offs

- **Performance:** Adding comparison logic to each item row. Mitigated by simple numeric comparison, no complex calculations.
- **Visual Clutter:** Too many badges could overwhelm the UI. Mitigated by only showing badges on items that differ from par.
- **Zero Values:** A count of 0 should trigger the red "below par" badge, not be treated as "no data".

## Migration Plan

1. Update compartment item component to accept par value prop
2. Add comparison logic to determine exception status
3. Add badge rendering with appropriate styling
4. Test with various scenarios: above par, below par, at par, zero
5. Deploy to production

## Open Questions

- Should badges be clickable to show more detail? (Not required for initial implementation)
- Should the badge show the difference amount (e.g., "+2" instead of just "+")? (Optional enhancement)