## Why

`units.status` only reflects the current unit state, so historical records cannot reliably answer which units were expected, out of service, or later archived on a specific operational date. A minimal daily snapshot in `daily_unit_ledgers` gives the Fleet Panel and archive views a stable source of truth without introducing advanced reporting or maintenance workflows.

## What Changes

- Extend `daily_unit_ledgers` with `archived` and `status_note` fields.
- Create or update today's ledger row whenever an admin changes a unit between in service and out of service.
- Create or update today's ledger row when a unit is archived through `deleted_at`, setting `archived = true`.
- Update the Fleet Panel data path to prefer today's ledger snapshot when available, falling back to current `units.status` only when no snapshot exists.
- Preserve archive behavior that uses `daily_unit_ledgers` for historical dates so OOS and archived-later units remain visible correctly.
- Keep this intentionally small: no analytics, maintenance module, alerting, label history, or complex status workflow.

## Capabilities

### New Capabilities
- `daily-unit-service-snapshots`: Daily unit service-state snapshots using `daily_unit_ledgers`, including in-service/out-of-service, archived flag, and optional note.

### Modified Capabilities
- `past-checkoff-record-summary`: Historical records use the expanded daily ledger snapshot to show daily unit service and archived state.
- `fleet-panel-status-badges`: Fleet Panel status uses today's daily ledger snapshot when available before falling back to current unit status.

## Impact

- **Database**: Add `archived boolean not null default false` and `status_note text` to `daily_unit_ledgers`.
- **Code**: Admin unit status/archive actions, `src/lib/fleet.ts`, archive record queries, shift reset ledger writer.
- **Behavior**: OOS and archived unit state can be represented per operational date without a separate history table.
- **Risk**: Dates before snapshots exist remain best-effort and should keep existing fallback behavior.
