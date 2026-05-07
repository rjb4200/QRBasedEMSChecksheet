## 1. Database Schema

- [x] 1.1 Add `shift_calendar` migration with `operational_date`, `shift_name`, `starts_at`, `ends_at`, and uniqueness on `operational_date`
- [x] 1.2 Seed or generate shift calendar rows using 2026-05-08 as `1st Shift` anchor and 1st/2nd/3rd repeating rotation
- [x] 1.3 Add timing fields to `compartment_checks`: `started_at`, `submitted_at`, and `time_to_complete_seconds`
- [x] 1.4 Add archive metadata fields to `shift_archives`: `operational_date`, `shift_id`, `started_at`, `submitted_at`, `last_activity_at`, `time_to_complete_seconds`, and `checked_by`
- [x] 1.5 Apply migrations to Supabase and review advisors for security/performance issues

## 2. Shift Resolution

- [x] 2.1 Extend `src/lib/shifts.ts` with operational-date helper that rolls over at 06:00 department time
- [x] 2.2 Add shift-calendar lookup or generation helper that returns shift id/name/start/end for an operational date
- [x] 2.3 Preserve compatibility for existing `shiftDate`/`shiftPeriod` consumers while exposing `operationalDate` and shift metadata
- [x] 2.4 Verify 2026-05-08, 2026-05-09, 2026-05-10, and 2026-05-11 map to 1st/2nd/3rd/1st Shift

## 3. Check Timing

- [x] 3.1 Update compartment and kit check actions to set `started_at` only on first insert
- [x] 3.2 Update save actions to set `last_activity_at` from server time on every save
- [x] 3.3 Update submit actions to set `submitted_at`, mirror/maintain `completed_at`, and calculate `time_to_complete_seconds`
- [x] 3.4 Store `checked_by` when authenticated submitter information is available and tolerate null otherwise

## 4. Archive Generation

- [x] 4.1 Update `shift-reset` to resolve the previous operational shift via `shift_calendar`
- [x] 4.2 Write `operational_date`, `shift_id`, timing fields, duration, and checked_by into `shift_archives`
- [x] 4.3 Compute unit-level archive `started_at` as earliest required target start and `submitted_at` as latest required target submission
- [x] 4.4 Keep existing ledger behavior intact while adding shift metadata

## 5. Records and Print Outputs

- [x] 5.1 Extend `src/lib/archive-records.ts` types and queries with shift/timing metadata
- [x] 5.2 Update Past Checkoff Records page and CSV export to include shift, started, submitted, duration, and checked-by data where appropriate
- [x] 5.3 Update `src/lib/checksheet-documents.ts` printable data with Winchester Fire Department header fields and timing metadata
- [x] 5.4 Ensure legacy rows with missing timing display blanks or `Not recorded` without failing

## 6. Verification

- [x] 6.1 Verify operational date changes at 06:00 using fixed date inputs
- [x] 6.2 Verify a new check preserves first start time across later saves
- [x] 6.3 Verify submitted checks calculate duration from start to submit
- [x] 6.4 Verify shift archives contain shift calendar linkage and timing data
- [x] 6.5 Run typecheck and lint
