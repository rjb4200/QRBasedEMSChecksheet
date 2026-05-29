## Context

Phase 2 (`add-historical-records-export-package`) provides a read-only ZIP export of historical records by date range. The storage warning banner on the admin dashboard warns at 90%+ usage but offers no action to reclaim space. All 8 operational tables (`compartment_checks`, `shift_archives`, `daily_unit_ledgers`, `daily_unit_crews`, `daily_unit_comments`, `daily_section_comments`, `daily_restock_items`, `daily_email_report_runs`) grow indefinitely. This design adds the clearing half of the data rotation loop.

The existing `system_logs` table and `logSystemEvent()` function provide the audit logging infrastructure. The Phase 2 `generateExportPackage()` provides the export step.

## Goals / Non-Goals

**Goals:**

- Admin selects a date range (max 60 days) and previews per-table row counts before taking action
- Export must succeed (ZIP generated with expected files) before clearing is allowed
- Slide-to-confirm gate prevents accidental deletion
- Clearing is transactional: all-or-nothing across the 7 primary operational tables plus `daily_email_report_runs`
- Configuration tables are never targeted for clearing
- Today's shift records are always excluded from clearing eligibility
- Every successful or failed rotation action is audited via `system_logs`

**Non-Goals:**

- No automatic clearing or scheduled rotation (admin-initiated only)
- No modification to Phase 2's export package format or manifest
- No changes to existing storage warning banner behavior (may link in a follow-up)
- No soft-delete or undo mechanism for cleared records (the export IS the backup)
- No clearing of `system_logs` (already auto-cleaned via pg_cron at 3-month TTL)

## Decisions

### 1. Two-Phase Flow: Preview → Export → Slide → Clear

```
┌──────────┐    ┌──────────┐    ┌───────────┐    ┌──────────┐
│ PREVIEW  │───▶│  EXPORT  │───▶│   SLIDE   │───▶│  CLEAR   │
│ Row      │    │ Phase 2  │    │ to confirm│    │ DELETE   │
│ counts   │    │ ZIP gen  │    │           │    │ + audit  │
└──────────┘    └──────────┘    └───────────┘    └──────────┘
```

**Rationale:** The admin must see what they're deleting (preview), export their backup (export), explicitly confirm (slide), and then the system clears. Each gate is a deliberate step. The export step reuses Phase 2's `generateExportPackage()` — if it throws or the ZIP is empty, the flow aborts before the slide gate even appears.

**Alternatives considered:**
- **Single button "Export and Clear"** — Too risky. No preview, no confirmation. Rejected for `high-risk` label.
- **Export after clear** — Contradicts the requirement "export must complete before clearing."

### 2. Slide-to-Confirm Mechanism

**Decision:** An HTML `<input type="range">` styled as a slide-to-confirm button. The admin drags a handle from left (locked) to right (confirmed). Only when the slider reaches 100% does the "Clear Records" button enable.

**Rationale:** More deliberate than a checkbox, less tedious than typing a phrase, visually weighty for a destructive action. Common pattern in mobile and admin UIs (e.g., iOS "slide to power off"). No additional dependencies.

**Alternatives considered:**
- **Type "DELETE" to confirm** — Adds friction but feels punitive for a trusted admin. User preferred slider.
- **Checkbox + confirm button** — Too easy to fat-finger. User preferred slider.
- **Password re-entry** — Overkill for a single-admin fire department tool.

### 3. Transactional Clearing via Stored Procedure

**Decision:** Create a PostgreSQL function `clear_operational_records(from_date text, to_date text)` via a new migration. The function wraps all DELETE statements in a single transaction and returns the count of deleted rows per table as JSONB. Called via `supabase.rpc()`.

**Rationale:** The Supabase JS client issues each `.from().delete()` as a separate HTTP request. Without a stored procedure, a network failure mid-clear could leave records partially deleted with no way to know which succeeded. A stored procedure guarantees all-or-nothing semantics.

**Schema:**
```sql
CREATE OR REPLACE FUNCTION clear_operational_records(from_date text, to_date text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'compartment_checks', (SELECT count(*) FROM compartment_checks WHERE shift_date >= from_date AND shift_date <= to_date),
    'shift_archives', (SELECT count(*) FROM shift_archives WHERE shift_date >= from_date AND shift_date <= to_date),
    'daily_unit_ledgers', (SELECT count(*) FROM daily_unit_ledgers WHERE shift_date >= from_date AND shift_date <= to_date),
    'daily_unit_crews', (SELECT count(*) FROM daily_unit_crews WHERE shift_date >= from_date AND shift_date <= to_date),
    'daily_unit_comments', (SELECT count(*) FROM daily_unit_comments WHERE shift_date >= from_date AND shift_date <= to_date),
    'daily_section_comments', (SELECT count(*) FROM daily_section_comments WHERE shift_date >= from_date AND shift_date <= to_date),
    'daily_restock_items', (SELECT count(*) FROM daily_restock_items WHERE shift_date >= from_date AND shift_date <= to_date),
    'daily_email_report_runs', (SELECT count(*) FROM daily_email_report_runs WHERE report_date >= from_date AND report_date <= to_date)
  ) INTO result;

  DELETE FROM compartment_checks WHERE shift_date >= from_date AND shift_date <= to_date;
  DELETE FROM shift_archives WHERE shift_date >= from_date AND shift_date <= to_date;
  DELETE FROM daily_unit_ledgers WHERE shift_date >= from_date AND shift_date <= to_date;
  DELETE FROM daily_unit_crews WHERE shift_date >= from_date AND shift_date <= to_date;
  DELETE FROM daily_unit_comments WHERE shift_date >= from_date AND shift_date <= to_date;
  DELETE FROM daily_section_comments WHERE shift_date >= from_date AND shift_date <= to_date;
  DELETE FROM daily_restock_items WHERE shift_date >= from_date AND shift_date <= to_date;
  DELETE FROM daily_email_report_runs WHERE report_date >= from_date AND report_date <= to_date;

  RETURN result;
END;
$$;
```

**Alternatives considered:**
- **Sequential JS deletes** — Risk of partial state on network failure. Rejected for `high-risk` label.
- **Batch delete via edge function** — Adds complexity. Stored procedure is simpler and lives in the database.

### 4. Row Count Preview (Read-Only Query)

**Decision:** A server-side function queries `SELECT count(*)` from each operational table for the selected date range and returns the counts. The admin sees these before export or clear is allowed.

**Rationale:** The admin must understand the scope of the operation. Seeing "247 compartment checks, 30 unit ledgers" makes the decision concrete.

This uses the same stored procedure but in preview-only mode (count before delete). Or a separate RPC that only counts. For simplicity, the migration can include a `preview_operational_counts(from_date, to_date)` function that only counts, and the clear function handles both count and delete.

Actually, simpler: the clear function already counts before deleting and returns counts. For preview, the client calls a lighter function or queries each table individually. Since preview is read-only and non-destructive, sequential JS queries are fine for counting.

### 5. Today's Shift Exclusion

**Decision:** The date range's `to` date must be strictly less than `getCurrentShift().shiftDate`. Records for today's shift are never eligible for clearing regardless of the date range selected.

**Rationale:** Today's shift may still be in progress. Deleting mid-shift records could break active checkoffs or dashboard displays. This guardrail is enforced server-side before any delete.

### 6. 60-Day Range Limit

**Decision:** `to - from` must be ≤ 60 days. The server rejects ranges exceeding this.

**Rationale:** Prevents timeouts from excessively large date ranges. 60 days balances operational need against performance. A full year (365 days) could generate hundreds of PDFs and thousands of deletes, risking Vercel function timeouts.

### 7. Audit Log Format

**Decision:** After a successful clear, call `logSystemEvent()` with:

```
actorType: "admin"
action: "rotate_records"
area: "data_rotation"
targetType: "records"
result: "success"
metadata: {
  exportId: "<uuid>",
  dateRange: { from, to },
  unitId: null | "<uuid>",
  clearedCounts: { compartment_checks: 247, daily_unit_ledgers: 30, ... },
  totalCleared: 509
}
```

On failure, log with `result: "failure"` and include the error in `message`.

**Rationale:** Uses the existing logging infrastructure. The `data_rotation` area is new but the `system_logs` table accepts any area string. The system log viewer can filter by this area.

### 8. UI Integration: Client-Side State Machine

**Decision:** The "Clear Records" flow is a client-side state machine on the Records page (`/admin/archives`). States: `idle` → `previewing` → `exporting` → `confirming` → `clearing` → `done` (success) or `error`.

The slide-to-confirm is a client component (`SlideToConfirm`) that renders a styled range input. It calls an `onConfirm` callback only when the slider reaches 100%. The parent page manages the flow state.

**Rationale:** Keeps the entire flow on one page without navigation. The client component handles the interactive parts (slider), while server actions handle the data operations (export, preview counts, clear).

### 9. Unit Filter Handling

**Decision:** If a unit filter is selected on the Records page, the clear operation uses it to scope the deletion: `DELETE FROM ... WHERE shift_date >= $from AND shift_date <= $to AND unit_id = $unitId`. The stored procedure accepts an optional `unit_id text` parameter (NULL = all units).

**Rationale:** Admins may want to clear records for a specific decommissioned unit without touching other units' history.

## Risks / Trade-offs

- **[Irreversible data loss]** — Once cleared, records are gone. **Mitigation:** The export MUST succeed before clearing. The slide-to-confirm gate makes accidental clearing unlikely. If export fails, clearing is impossible.
- **[Stored procedure migration]** — Introduces a DB migration in a previously migration-free phase. **Mitigation:** The function is idempotent (CREATE OR REPLACE), can be re-run safely, and only affects operational tables with `shift_date` columns.
- **[Cascading deletes from FK]** — Deleting `compartment_checks` doesn't cascade to anything. `daily_unit_ledgers` has no FK. `shift_archives` has SET NULL for users/calendar. Safe.
- **[Large date ranges timing out]** — Even at 60 days, with many units, deletes could take seconds. **Mitigation:** The stored procedure runs entirely in Postgres, no network round-trips. 60-day limit bounds row counts.
- **[System log viewer area filter]** — The new `data_rotation` area must be added to the system log viewer's filter dropdown. **Mitigation:** Check if the viewer uses a hardcoded list or queries distinct areas. If hardcoded, add to the list.

## Open Questions

- Should the cleared-record manifest be written back into the ZIP? (Current decision: no, audit log IS the record.)
- Should we add a `data_rotation` area filter to the system log viewer page as part of this change?
