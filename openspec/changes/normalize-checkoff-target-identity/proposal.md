## Why

Checkoff saves currently drift from the existing atomic-save contract: multiple paths still use SELECT-then-INSERT/UPDATE against `compartment_checks`, which can race and create or expose duplicate rows for the same unit target and shift. The current partial unique-index model also makes Supabase/PostgREST `upsert(..., onConflict)` less reliable than a single normalized target identity key.

## What Changes

- Add normalized target identity fields to `compartment_checks`: `target_type` and `target_id`
- Backfill target identity from existing `compartment_id` / `unit_kit_id` values while keeping legacy columns intact
- Detect duplicate check rows before enforcing the new unique target identity
- Add a unique constraint/index for one check row per `(unit_id, target_type, target_id, shift_date, shift_period)`
- Update all checkoff write paths to use atomic upsert on the normalized target key
- Preserve legacy compartment and kit columns during this change for reader compatibility and rollback safety
- Add a submit/autosave guard so pending debounced in-progress saves cannot race manual completion submits
- Document rollback controls: Git clean point, database backup, additive migration, and non-destructive first release

## Capabilities

### New Capabilities
- `checkoff-target-identity`: Defines normalized target identity, duplicate validation, unique enforcement, and additive migration/rollback expectations for `compartment_checks`

### Modified Capabilities
- `atomic-checkoff-saves`: Changes atomic save conflict targeting from partial legacy target indexes to the normalized `(unit_id, target_type, target_id, shift_date, shift_period)` key
- `collision-prevention`: Updates page-load auto-create expectations to use normalized-target atomic upsert while preserving lock/status behavior

## Impact

- Supabase migrations for `compartment_checks` schema, backfill, duplicate validation, and unique constraint/index creation
- `src/app/checkoff/[unitId]/[compartmentId]/actions.ts` atomic save implementation
- `src/app/checkoff/[unitId]/[compartmentId]/page.tsx` page-load auto-create implementation
- `src/app/checkoff/[unitId]/kit/[unitKitId]/page.tsx` readers may continue using legacy target columns during the compatibility window
- `src/app/checkoff/[unitId]/[compartmentId]/checkoff-form.tsx` debounce/submit coordination
- Existing readers of `compartment_id` and `unit_kit_id` remain compatible because those columns are preserved
