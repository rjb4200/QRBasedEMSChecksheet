## Context

The daily checksheet print functionality currently includes all units regardless of their status. With the addition of archived and OOS (Out of Service) status features, the printout should filter out these inactive units to only show units that are actively in service.

## Goals / Non-Goals

**Goals:**
- Exclude archived units from daily checksheet print
- Exclude OOS units from daily checksheet print
- Only include active units (not archived, not OOS) in printed checksheets

**Non-Goals:**
- Changing what appears on the fleet dashboard or records view
- Adding any new database columns

## Decisions

### 1. Filter Implementation

**Decision:** Add WHERE clause conditions to filter out archived and OOS units in the print query.

**Rationale:** The units table already has archived_at and oos_at columns. Adding simple NULL checks in the query WHERE clause is the most straightforward and performant approach.

**Implementation:**
- `archived_at IS NULL` - only include non-archived units
- `oos_at IS NULL` - only include non-OOS units

### 2. Historical Prints

**Decision:** Apply the same filter to historical print functionality.

**Rationale:** Whether printing today's checksheet or viewing historical records, OOS and archived units should not appear on printouts.

## Risks / Trade-offs

- **No Risks Identified:** This is a simple filter addition with no complex logic or side effects.

## Migration Plan

1. Update print query to add archived_at and oos_at filters
2. Test with active, archived, and OOS units
3. Deploy to production

## Open Questions

- Should the print page show a count of excluded units? (Optional, not required for initial implementation)