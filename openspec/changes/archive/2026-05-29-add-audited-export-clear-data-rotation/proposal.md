## Why

Phase 2 gave admins a read-only export package for historical records. But the database still grows indefinitely — `compartment_checks`, `daily_unit_ledgers`, and other operational tables accumulate daily with no mechanism to reclaim space. Phase 3 completes the data rotation strategy by adding a controlled, audited export-and-clear workflow: the admin exports historical records to a ZIP, explicitly confirms deletion intent via a slide-to-confirm gate, and the system transactionally clears the exported records while logging every rotation action for auditability.

## What Changes

- Add an "Export and Clear" workflow on the Records page that combines Phase 2's ZIP export with a subsequent data clearing step
- Admin selects a date range (max 60 days), previews row counts per table, then triggers the export
- After a successful export, a slide-to-confirm gate appears showing exact deletion counts — admin must slide to confirm before any records are deleted
- Clearing is transactional: all-or-nothing across the 8 operational tables filtered by `shift_date` range
- Configuration tables (units, compartments, kits, equipment catalog, users, templates, QR targets, shift calendar) are **never** cleared
- Every rotation action is audited via `system_logs` with action `rotate_records`, area `data_rotation`, and metadata capturing the export ID, date range, and per-table cleared counts
- Today's shift records are never eligible for clearing
- Export must succeed (non-empty ZIP with expected file count) before clearing can proceed

## Capabilities

### New Capabilities

- `data-rotation`: Admin-only export-and-clear workflow for historical operational records, including row count preview, slide-to-confirm gate, transactional clearing, audit logging, 60-day range limit, and today's-shift exclusion

### Modified Capabilities

- `archive-history`: Records page gains a "Clear Records" workflow alongside existing export options, with date range selection for clearing and row count preview

## Impact

- **New UI**: Slide-to-confirm component, row count preview panel, "Clear Records" button on `/admin/archives`
- **New Route Handler**: `/admin/archives/clear-records` — Server Action or Route Handler for the actual deletion
- **New library**: `src/lib/data-rotation.ts` — row counting, clearing logic, guardrails (today exclusion, 60-day limit)
- **Modified**: `src/app/admin/archives/page.tsx` — Clear Records button and flow integration
- **Reuses**: `src/lib/export-package.ts` (Phase 2 ZIP generation), `src/lib/system-log.ts` (audit logging)
- **No new dependencies** — all infrastructure exists
- **New database migration** — stored procedure for transactional clearing (`clear_operational_records`)
