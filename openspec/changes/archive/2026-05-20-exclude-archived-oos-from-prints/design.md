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

**Decision:** Add active-unit filters to the checksheet document source so archived and OOS units never become printable sources.

**Rationale:** The current data model uses `deleted_at` for archived units and `status = out_of_service` for OOS units. Filtering those states at the document-source layer is the smallest correct change and also lets ledger-backed prints exclude archived rows.

**Implementation:**
- `deleted_at IS NULL` - only load non-archived units from `units`
- `status = 'in_service'` - only include active units
- `daily_unit_ledgers.archived = false` - exclude archived ledger rows when the print uses ledger-backed sources

### 2. Historical Prints

**Decision:** Apply the same filter to historical print functionality.

**Rationale:** Whether printing today's checksheet or viewing historical records, OOS and archived units should not appear on printouts.

## Risks / Trade-offs

- **No Risks Identified:** This is a simple filter addition with no complex logic or side effects.

## Migration Plan

1. Update the checksheet document unit source filtering to exclude `deleted_at` units, `out_of_service` units, and archived ledger rows
2. Test with active, archived, and OOS units
3. Deploy to production

## Open Questions

- Should the print page show a count of excluded units? (Optional, not required for initial implementation)
