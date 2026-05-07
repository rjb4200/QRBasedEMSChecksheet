## Why

qrCheckoff currently tracks daily checkoffs by a generic daily shift date, but Winchester Fire Department operates a 24/48 rotating 1st/2nd/3rd shift schedule with a 06:00 operational day rollover. Archives need explicit shift assignment and timing data so command staff can review who checked each unit, when checks started, when they were submitted, and how long completion took.

## What Changes

- Add a `shift_calendar` source of truth for operational dates, assigned shift names, and start/end timestamps.
- Extend shift helpers to resolve operational date at 06:00 server/department time and look up the assigned 24/48 shift.
- Enhance check/archive tracking with start time, last activity, submitted time, completion duration, and checked-by user.
- Link shift archives to the shift calendar and preserve operational date/shift assignment in historical records.
- Update archive/record data and printable check sheets to include operational date, shift, crew, checked by, started/submitted times, duration, checks, issues, comments, and signature section.
- Keep analytics dashboards, staffing imports, realtime shift monitoring, and advanced reporting out of the MVP.

## Capabilities

### New Capabilities
- `shift-rotation-calendar`: 24/48 Winchester Fire Department shift calendar, 06:00 operational rollover, and shift lookup behavior.
- `check-time-tracking`: Server-side start/submission/activity timestamp and duration tracking for unit checkoffs.

### Modified Capabilities
- `past-checkoff-record-summary`: Past records and print/export data include shift-aware archive metadata and timing fields.

## Impact

- **Database**: Add `shift_calendar`; extend `shift_archives`; likely extend `compartment_checks`/crew records where needed for reliable start/submission/user timing.
- **Code**: `src/lib/shifts.ts`, checkoff actions/pages, kit checkoff actions/pages, shift reset Edge Function, archive records, check sheet documents, and print/export consumers.
- **Behavior**: Operational dates roll over at 06:00; archives are tied to assigned 1st/2nd/3rd shift; timing uses server-generated timestamps.
- **Risk**: Backfilled historical archives may not have exact start/submission timing and should display blanks or derived values rather than fabricated data.
