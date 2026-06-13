## Context

The `compartment_checks` table currently represents targets with two nullable legacy columns: `compartment_id` for compartment checks and `unit_kit_id` for kit checks. The schema enforces target uniqueness using partial unique indexes:

```
compartment target:
  unique(unit_id, compartment_id, shift_date, shift_period)
  where compartment_id is not null

kit target:
  unique(unit_id, unit_kit_id, shift_date, shift_period)
  where unit_kit_id is not null
```

The existing `atomic-checkoff-saves` spec requires atomic upserts, but the current source still uses SELECT-then-INSERT/UPDATE in the primary server action and page-load auto-create path. Partial unique indexes also make the Supabase/PostgREST `onConflict` target less straightforward than a single unique key.

This change introduces a normalized target identity while keeping legacy columns for compatibility:

```
compartment_checks
┌────────────────┐
│ unit_id        │
│ target_type    │  compartment | kit
│ target_id      │  compartment_id | unit_kit_id
│ shift_date     │
│ shift_period   │
└────────────────┘
        │
        ▼
unique(unit_id, target_type, target_id, shift_date, shift_period)
```

## Goals / Non-Goals

**Goals:**
- Enforce one `compartment_checks` row per unit target per shift using one normalized unique identity
- Keep the migration additive and reversible by preserving `compartment_id` and `unit_kit_id`
- Backfill existing rows and detect duplicates before creating the normalized unique constraint/index
- Update all checkoff writes to use atomic upsert on the normalized target key
- Prevent pending debounced autosaves from racing a manual completion submit
- Establish rollback/backup expectations before applying schema changes

**Non-Goals:**
- Dropping `compartment_id` or `unit_kit_id` in this change
- Rewriting every reader to use only `target_type` / `target_id`
- Adding real-time subscriptions or live collaboration
- Changing lock ownership semantics beyond making writes atomic
- Automatically deleting production duplicates without an explicit deterministic cleanup rule

## Decisions

### Decision 1: Add normalized identity columns while preserving legacy columns

`compartment_checks` will gain `target_type` and `target_id`. Existing rows will be backfilled:

```
if compartment_id is not null:
  target_type = 'compartment'
  target_id = compartment_id

if unit_kit_id is not null:
  target_type = 'kit'
  target_id = unit_kit_id
```

Legacy columns remain populated on new writes. This allows old readers, summaries, archive code, printouts, and reports to continue working during the compatibility window.

Alternative considered: only use current partial indexes with `.upsert(..., onConflict)`. Rejected as the primary plan because partial-index conflict inference can be brittle through PostgREST, and the system already has a natural normalized target identity pattern in `daily_section_comments` (`source_type` / `source_id`).

### Decision 2: Add duplicate validation before unique enforcement

Before adding the normalized unique index, the migration will query duplicate groups:

```
unit_id, target_type, target_id, shift_date, shift_period having count(*) > 1
```

If duplicates exist, implementation must stop and use a deterministic cleanup step before enforcing uniqueness.

Recommended winner order:

1. Prefer `status = 'completed'`
2. Prefer latest `updated_at`
3. Prefer row with non-empty/richer `item_data`
4. Prefer lowest `id` as final tie-breaker

The cleanup decision should be visible in migration comments or a supporting SQL script.

### Decision 3: Atomic saves target the normalized key

All save paths will upsert using:

```
onConflict: "unit_id,target_type,target_id,shift_date,shift_period"
```

The payload will still include the legacy target columns:

```
compartment target:
  target_type = 'compartment'
  target_id = compartmentId
  compartment_id = compartmentId
  unit_kit_id = null

kit target:
  target_type = 'kit'
  target_id = unitKitId
  compartment_id = null
  unit_kit_id = unitKitId
```

### Decision 4: Preserve completed status against stale in-progress saves

The app currently avoids downgrading completed rows by reading the existing row first. Atomic upsert cannot rely on a prior SELECT. The implementation should preserve completed rows either by:

- using a database RPC/function with conditional update logic, or
- using SQL-level `ON CONFLICT DO UPDATE` conditions in a migration-backed function, or
- re-reading after upsert and refusing to overwrite completed state in an explicit transaction

Preferred approach: a small database RPC for check saves if plain Supabase `.upsert()` cannot express “do not downgrade completed to in_progress” safely. The spec still requires atomic behavior; implementation may choose direct `.upsert()` only if completed-status preservation remains correct.

### Decision 5: Add client-side submit/autosave guard

The form should keep the debounce timer in a ref, clear it on submit, and use an `isSubmittingRef` guard so auto-save callbacks return without network calls while submit is in flight.

This is not the primary correctness mechanism; the database remains the source of truth. It reduces avoidable write races and improves UX.

## Risks / Trade-offs

- **Existing duplicate rows** → Mitigate by running duplicate detection before adding the unique index and pausing for cleanup if duplicates are found.
- **Migration rollback difficulty** → Mitigate by taking a targeted `compartment_checks` backup table before migration; a full Supabase snapshot or CLI dump is optional but recommended when available.
- **App/schema deployment ordering** → Mitigate with additive columns first, legacy columns preserved, and writes populating both old and new identity fields.
- **Completed row downgrade** → Mitigate with SQL/RPC conditional update semantics or equivalent atomic guard; do not depend only on client-side suppression.
- **Main branch rollback** → Mitigate by creating and pushing a Git tag/branch clean point before implementation.

## Migration Plan

1. Create Git rollback point:

```
git tag before-normalized-checkoff-targets
git push origin before-normalized-checkoff-targets
```

2. Create the required targeted backup table for the table touched by this migration. A full Supabase dashboard snapshot or CLI dump is optional when available, but the targeted table backup is the required rollback point for this change:

```sql
create table compartment_checks_backup_YYYYMMDD as
select * from compartment_checks;
```

3. Add nullable `target_type` and `target_id` columns.

4. Backfill existing rows from `compartment_id` and `unit_kit_id`.

5. Detect duplicate normalized target groups. If any exist, pause and clean deterministically.

6. Add normalized unique index/constraint on `(unit_id, target_type, target_id, shift_date, shift_period)`.

7. Update application writes to populate both normalized and legacy target fields and use atomic save semantics.

8. Add submit/autosave guard.

9. Run typecheck/build and manually verify compartment and kit save flows.

10. Leave legacy columns and prior partial indexes in place until a later cleanup change.

Rollback path:

- If migration fails before unique index, restore `compartment_checks` from the targeted backup table. If a full Supabase snapshot or CLI dump was also taken, it may be used as a broader restore option.
- If app deployment fails, roll back Git to `before-normalized-checkoff-targets`; legacy columns remain intact.
- If normalized writes misbehave, disable new app version and keep old readers functional because legacy fields were preserved.

## Open Questions

- Do duplicates already exist in production? This must be checked before final migration.
- Should the implementation use plain Supabase `.upsert()` or a database RPC to preserve completed-state semantics atomically?
- Should duplicate cleanup be included in the main migration or handled as a separate operator-reviewed SQL script if duplicates are found?
