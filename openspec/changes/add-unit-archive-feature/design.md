## Context

The application currently has soft-delete functionality for units using a `deleted_at` column. However, there is no way to archive units (mark them as sold/stored) while keeping them accessible for historical records. Additionally, there is no OOS (Out of Service) status to mark units temporarily unavailable.

## Goals / Non-Goals

**Goals:**
- Add archive functionality with timestamp to mark units as archived
- Add OOS functionality with timestamp to mark units as Out of Service
- Exclude archived units from fleet panel, daily prints, and new record counts
- Preserve historical records for archived units (show on days they were present)
- Display archived units with greyed-out styling and "ARCHIVED" badge
- Display OOS units with distinct orange/yellow styling and "OOS" badge
- Allow unarchiving to restore unit to active status with compartment layout preserved

**Non-Goals:**
- Automatic archiving based on any criteria
- Archive/OOS notifications or alerts
- Bulk archive or OOS operations (single unit at a time)

## Decisions

### 1. Database Column Design

**Decision:** Add two new columns to the `units` table: `archived_at` (timestamp, nullable) and `oos_at` (timestamp, nullable).

**Rationale:** Using timestamps allows for precise tracking of when units were archived or marked OOS. Null values indicate active status. This follows the same pattern as the existing `deleted_at` soft-delete column.

**Alternative Considered:** Using a status enum field. Rejected because it doesn't track when the status changed and requires schema changes to add new statuses.

### 2. Filtering Strategy

**Decision:** Filter archived units at the query level in fleet, print, and record count functions.

**Rationale:** This ensures archived units are never included in active displays while keeping the historical data intact in the database.

**Implementation:**
- Fleet query: Add `AND archived_at IS NULL` condition
- Print query: Add `AND archived_at IS NULL` condition
- Record count: Add `AND archived_at IS NULL` condition

### 3. Visual Styling

**Decision:** Use grey background (#9CA3AF / gray-400) for archived units and orange/yellow background (#F59E0B / amber-500) for OOS units.

**Rationale:** These colors provide clear visual distinction while remaining accessible. Grey implies inactive/stored, while orange/yellow implies caution/warning.

**Badge Text:** "ARCHIVED" in grey for archived, "OOS" in orange for OOS.

### 4. Archive vs Delete

**Decision:** Archive is separate from soft-delete. Units can be archived without being deleted, and can be unarchived.

**Rationale:** Archive provides a middle ground between active use and full deletion. It allows preserving the unit's configuration for potential reactivation while hiding it from daily operations.

## Risks / Trade-offs

- **Data Consistency:** Existing units without `archived_at` or `oos_at` will be treated as active. Mitigated by setting defaults to null.
- **Historical Records:** Archived units should still appear in historical records for dates when they were active. Mitigated by checking ledger date vs archive date.
- **Migration:** Need to apply database migration for new columns. Mitigated by using Supabase migration tool.

## Migration Plan

1. Add `archived_at` and `oos_at` columns to `units` table via Supabase migration
2. Update fleet query functions to exclude archived units
3. Update print document generation to exclude archived units
4. Update record count queries to exclude archived units
5. Update unit detail page to show archived/OOS badges and styling
6. Add archive/unarchive and OOS toggle actions in admin
7. Test all flows and validate historical records
8. Deploy to production

## Open Questions

- Should archived units be included in the units dropdown for QR scanning? (Recommend: No, only active units)
- Should OOS units be included in fleet count? (Recommend: Yes, show but visually distinct)
- Should there be a confirmation dialog before archiving? (Recommend: Yes)