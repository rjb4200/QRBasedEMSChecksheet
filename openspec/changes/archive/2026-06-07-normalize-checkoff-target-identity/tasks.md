## 1. Rollback Preparation

- [x] 1.1 Create and push Git rollback tag `before-normalized-checkoff-targets`
- [x] 1.2 Confirm current branch is clean before schema/app changes begin
- [x] 1.3 Use targeted `compartment_checks_backup_YYYYMMDD` table as the required database rollback point before running migrations; full Supabase snapshot/CLI dump is optional
- [x] 1.4 Create targeted backup table `compartment_checks_backup_YYYYMMDD` from current `compartment_checks`

## 2. Schema Migration: Normalized Identity

- [x] 2.1 Add nullable `target_type` column to `compartment_checks`
- [x] 2.2 Add nullable `target_id` column to `compartment_checks`
- [x] 2.3 Backfill compartment rows with `target_type = 'compartment'` and `target_id = compartment_id`
- [x] 2.4 Backfill kit rows with `target_type = 'kit'` and `target_id = unit_kit_id`
- [x] 2.5 Add validation query that finds duplicate `(unit_id, target_type, target_id, shift_date, shift_period)` groups
- [x] 2.6 If duplicates exist, pause implementation and prepare deterministic cleanup using completed/latest/richest/lowest-id winner order
- [x] 2.7 Add normalized unique index or constraint for `(unit_id, target_type, target_id, shift_date, shift_period)` after duplicate validation passes
- [x] 2.8 Preserve `compartment_id`, `unit_kit_id`, and existing legacy partial unique indexes

## 3. Atomic Checkoff Save Path

- [x] 3.1 Update shared checkoff save payload construction to populate `target_type`, `target_id`, and legacy target columns
- [x] 3.2 Replace `upsertTargetCheck` SELECT-then-INSERT/UPDATE flow with atomic save semantics using the normalized target key
- [x] 3.3 Ensure completed rows cannot be downgraded to `in_progress` by stale autosaves under the chosen atomic implementation
- [x] 3.4 Keep `started_at`, `submitted_at`, `completed_at`, `checked_by`, and `time_to_complete_seconds` behavior equivalent to current behavior
- [x] 3.5 Keep section comment upsert/delete behavior unchanged

## 4. Page-Load Auto-Create Path

- [x] 4.1 Update compartment page-load auto-create to use normalized-target atomic save instead of conditional update/insert
- [x] 4.2 Ensure page-load auto-create still preserves carried-forward item data for newly started checks
- [x] 4.3 Verify concurrent page loads cannot create duplicate rows for the same normalized target identity

## 5. Autosave/Submit Coordination

- [x] 5.1 Store the 700ms autosave timer in a ref so it can be cancelled explicitly
- [x] 5.2 Add `isSubmittingRef` guard to suppress autosave callbacks during manual submit
- [x] 5.3 Clear any pending autosave timer when the submit button is clicked
- [x] 5.4 Verify a stale autosave cannot change a completed row back to `in_progress`

## 6. Verification

- [x] 6.1 Run duplicate detection SQL and record whether duplicates were present (none found)
- [x] 6.2 Run TypeScript typecheck with no new errors
- [x] 6.3 Run production build with no new errors
- [x] 6.4 Manually verify compartment autosave and submit flows
- [x] 6.5 Manually verify kit autosave and submit flows
- [x] 6.6 Manually verify unit dashboard status colors still reflect not-started, in-progress, and completed states
- [x] 6.7 Confirm new writes contain both normalized identity fields and legacy target fields
