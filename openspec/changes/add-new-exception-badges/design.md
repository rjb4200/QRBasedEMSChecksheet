## Context

The exceptions panel displays items that are below par or missing. Currently, all exceptions appear the same regardless of whether they are longstanding or newly appeared. The check sheet printouts also show exceptions without distinguishing new from existing. A "NEW" badge would help crews and supervisors prioritize attention on emerging issues.

## Goals / Non-Goals

**Goals:**
- Display "NEW" badge on exceptions that appeared since the last completed checkoff
- Show "NEW" badge on both exceptions panel and check sheet printouts
- The badge is date-specific - only visible on the day the exception first appears

**Non-Goals:**
- Persisting "NEW" status beyond the current day
- Adding "NEW" badges to the compartment check page itself (only exceptions panel and printouts)
- Tracking historical "NEW" badges

## Decisions

### 1. Comparison Strategy

**Decision:** Compare current day's exceptions against the last completed checkoff's exception items.

**Rationale:** A completed checkoff is defined by the crew lock being engaged. By comparing the current day's exceptions (items below par) against the previous check's items at/below par, we can identify which exceptions are new.

**Implementation:**
1. Get the last completed checkoff (most recent daily_unit_crews with locked_at not null)
2. Extract items from that check that were below par
3. Compare against current day's exceptions
4. Items in current but not in previous are "NEW"

### 2. Badge Display Location

**Decision:** Display "NEW" badge next to the item name in the exceptions panel and in the print output.

**Rationale:** This matches where other exception indicators appear and ensures visibility without cluttering the UI.

### 3. Badge Styling

**Decision:** Use a distinct color (e.g., blue or purple) to differentiate "NEW" from the existing red/yellow exception indicators.

**Rationale:** "NEW" is informational, not a warning like above/below par. A neutral but prominent color communicates this appropriately.

### 4. Day Boundary

**Decision:** The "NEW" badge is calculated fresh each day based on the previous completed checkoff.

**Rationale:** Since we're comparing against the "last completed checkoff," the badge naturally drops off the next day - either the item is resolved (no longer an exception) or it becomes an existing exception.

## Risks / Trade-offs

- **No Previous Check:** If there is no previous completed check (first day or gap), all exceptions are considered "new" by default. Mitigated by treating this as expected behavior.
- **Same Day Comparison:** If the checkoff is started and saved without locking, it won't be considered "completed." Mitigated by only using locked checks for comparison.
- **Performance:** Comparing exception lists adds a small query. Mitigated by efficient set comparison.

## Migration Plan

1. Add function to get last completed checkoff items
2. Update exceptions panel to compare and show "NEW" badges
3. Update print document generation to include "NEW" badges
4. Test with scenarios: new exceptions, existing exceptions, no previous check
5. Deploy to production

## Open Questions

- Should the "NEW" badge appear on the unit detail page exceptions section? (Not required, only panel and printouts)
- How to handle if the previous check was more than 7 days ago? (Still compare against that check, not revert to par)