## Context

`daily_unit_ledgers` is already the intended daily fleet snapshot table and is used by Past Checkoff Records when available. It currently captures `shift_date`, `shift_period`, `unit_id`, `unit_name`, `unit_status`, and target count, but it cannot record whether a unit had been archived that day or an operator note explaining why a unit was out of service.

Admin unit status changes currently update `units.status` directly in `src/app/admin/units/actions.ts`. Unit archiving sets `deleted_at` and forces `status = out_of_service`. Fleet status currently reads live `units.status` from `src/lib/fleet.ts`, which means current unit state can leak into same-day operational display when a ledger exists.

## Goals / Non-Goals

**Goals:**
- Use `daily_unit_ledgers` as the single minimal daily service snapshot.
- Capture in-service/out-of-service state for each operational date.
- Capture whether a unit was archived on that operational date.
- Allow a short optional note for OOS/status context.
- Prefer today's ledger snapshot in the Fleet Panel when available.
- Keep archive views ledger-authoritative for historical dates.

**Non-Goals:**
- No downtime analytics.
- No maintenance tracking.
- No alerting or reporting.
- No separate status history/timeline table.
- No new UI views beyond existing Fleet Panel/admin unit/archive behavior.

## Decisions

**Extend `daily_unit_ledgers`, do not add another history table.**

Add `archived boolean not null default false` and `status_note text`. This preserves the existing daily snapshot model and keeps implementation small.

**Update ledger rows from admin unit mutations.**

When `toggleUnitStatus` changes a unit status, upsert today's ledger row with current unit name, status, target count, `archived = false`, and optional note when available. When `deleteUnit` archives a unit, upsert today's ledger row with `unit_status = out_of_service`, `archived = true`, and optional note.

**Use current operational date helpers.**

Ledger updates should use `getCurrentShift()` so the snapshot aligns with the existing 06:00 operational-day rollover and current daily period.

**Fleet Panel prefers ledger only when today's ledger exists.**

If at least one ledger row exists for today, fleet status should build unit display state from those ledger rows. If no ledger exists for today, keep existing fallback to active `units` rows so rollout is safe.

**Archive views continue to prefer ledgers.**

Past Checkoff Records already prefers ledgers. This change extends record types/queries so `archived` and `status_note` can be displayed/exported without altering fallback behavior for dates without ledgers.

## Risks / Trade-offs

- **Partial same-day ledger coverage**: If only one unit has a row today, Fleet Panel ledger mode could omit other units. Mitigation: implementation should either seed all current units when the first same-day ledger is needed or merge missing active units as fallback.
- **Notes are basic**: `status_note` is not a full maintenance record. Mitigation: scope explicitly defers maintenance workflows.
- **Archived units still require retained unit rows**: The design assumes soft delete via `deleted_at`, which already exists.

## Migration Plan

1. Add `archived` and `status_note` columns to `daily_unit_ledgers`.
2. Add a shared helper to upsert today's ledger row for a unit.
3. Call the helper from unit status toggle and delete/archive actions.
4. Update `shift-reset` ledger creation to include `archived` and `status_note` defaults.
5. Update fleet status to prefer today's ledger data when available.
6. Update archive records/CSV to expose archived flag and status note.
7. Verify typecheck and lint.
