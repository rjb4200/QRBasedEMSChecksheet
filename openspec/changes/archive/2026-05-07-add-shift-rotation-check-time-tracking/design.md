## Context

The app currently treats checkoffs as a single `daily` shift period keyed by `shift_date`. `src/lib/shifts.ts` already uses a 06:00 Eastern rollover, but it does not assign a Winchester Fire Department 1st/2nd/3rd shift or persist a shift calendar. Checkoff rows already include `last_activity_at`, `completed_at`, `time_on_page`, and `checked_by`, but the current server actions set some timing values from application code and do not preserve a unit-level started/submitted/duration archive record. `shift_archives` currently stores aggregate completion data, but lacks operational date, shift calendar linkage, start/submission timing, duration, and checked-by metadata.

Winchester Fire Department uses a 24/48 rotation. The reference rule is that 1st Shift works tomorrow, then 2nd Shift the next day, then 3rd Shift, repeating. This change should make that rotation explicit and use it for current checkoffs, archives, records pages, and printable daily apparatus inspection sheets.

## Goals / Non-Goals

**Goals:**
- Add a durable `shift_calendar` table with one row per operational date.
- Resolve operational dates at the 06:00 department-time rollover.
- Assign every operational date to 1st/2nd/3rd Shift using the 24/48 rotation.
- Track check start, activity, submission, duration, and checked-by using server timestamps.
- Carry shift and timing metadata into `shift_archives` and printable/archive records.
- Keep historical display robust when timing fields are missing for older records.

**Non-Goals:**
- Do not build analytics dashboards, staffing imports, realtime shift monitoring, or advanced reporting.
- Do not change the checkoff item entry UX beyond necessary timing persistence.
- Do not fabricate precise historical timing for old rows that do not contain it.

## Decisions

**Use `shift_calendar` as source of truth.**

Create `shift_calendar` with `operational_date`, `shift_name`, `starts_at`, and `ends_at`. The app should be able to generate or upsert a date range from a known anchor where 2026-05-08 is 1st Shift. This avoids hardcoding shift labels into archive records without a stable lookup table.

**Keep `shift_date` compatibility while adding operational fields.**

Existing code and data use `shift_date` and `shift_period`. To minimize disruption, add `operational_date` and `shift_id` to archives while treating `shift_date` as the current operational date for compatibility. New code should prefer `operational_date` and `shift_id` where available.

**Use server-side timestamps.**

Check actions should set timestamps on the server. For existing Next.js server actions, `new Date().toISOString()` is acceptable server time. Database defaults/triggers should be used where possible for insert/update safety.

**Track target-level timing from first persisted row.**

`compartment_checks` should preserve `started_at` on first insert and never overwrite it on later saves. `last_activity_at` updates on every save. `submitted_at` is set when a target is submitted/completed. For compatibility, `completed_at` may remain as the target completion timestamp or be mirrored from `submitted_at`.

**Compute unit archive timing from required targets.**

When shift reset archives a unit, `started_at` is the earliest required target start, `submitted_at` is the latest required target submission, and `time_to_complete_seconds` is the difference when both are present. `checked_by` should use the final submitter if available.

**Printable records use available metadata.**

Daily printable apparatus records should show Winchester Fire Department, operational date, shift, crew, checked by, started/submitted times, duration, checks, issues/comments, and signature section. Missing legacy timing should render as blank or `Not recorded`.

## Risks / Trade-offs

- **Historical gaps**: Older checks may lack start/submission/duration. Mitigation: display missing values as not recorded and avoid backfilling fabricated times.
- **Rotation anchor errors**: A wrong anchor shifts every future label. Mitigation: document the anchor and seed calendar rows from 2026-05-08 = 1st Shift.
- **Schema overlap**: `shift_date` and `operational_date` may duplicate values initially. Mitigation: keep both during migration and migrate consumers gradually.
- **Checked-by availability**: Some flows currently set `checked_by` to null. Mitigation: add tasks to preserve authenticated submitter where available and tolerate null in displays.

## Migration Plan

1. Add `shift_calendar` and seed/generate an initial date range around the current operating year.
2. Extend `compartment_checks` and `shift_archives` with timing and shift metadata fields.
3. Update shift helper APIs to return operational date, shift period, shift id/name, starts_at, and ends_at.
4. Update checkoff save/submit actions to preserve `started_at`, update `last_activity_at`, set `submitted_at`, and calculate target durations.
5. Update shift reset/archive generation to write shift metadata and unit-level timing.
6. Update archive records and printable check sheet data to show shift/timing fields.
7. Verify 06:00 rollover, 24/48 rotation sequence, archive persistence, and print output.
