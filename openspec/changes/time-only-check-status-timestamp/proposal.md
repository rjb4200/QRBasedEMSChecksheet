## Why

The checked-unit timestamp under "Check Status" in the daily readiness records (screen and print) shows the full date and time, but the date is redundant since it already appears at the top of the form. Showing only the time reduces visual clutter and matches the context established by the page header.

## What Changes

- Change the timestamp format under "Check Status" for checked units from full date+time to time only (e.g., "2:30:00 PM" instead of "5/11/2026, 2:30:00 PM").
- Apply to the screen Records page, the printable daily record, and the daily email PDF.

## Capabilities

### New Capabilities
<!-- None — display formatting change only -->

### Modified Capabilities
- `daily-readiness-ledger-records`: Timestamp display format under check status changes from full date-time to time-only.

## Impact

- `src/app/admin/archives/print/page.tsx` — `formatTimestamp` used under Check Status
- `src/lib/pdf/daily-checksheets.ts` — `formatTimestamp` used in PDF table
- `src/app/admin/archives/page.tsx` — `formatTimestamp` used (if applicable)
