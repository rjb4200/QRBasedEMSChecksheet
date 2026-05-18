## Why

The checkoff system has no structured audit trail. When admins need to answer "who changed that unit's status?" or "did the daily report send this morning?" they have no way to find out. A system activity log provides accountability for configuration changes, operational events, and system task outcomes without becoming a noisy debug log.

## What Changes

- Create `public.system_logs` table with actor, action, area, target, result, and JSONB detail columns.
- Add `logSystemEvent()` shared helper in `src/lib/system-log.ts` for server-side log writes.
- Instrument key server actions to write log entries: unit status changes, crew lock/unlock, manual restock changes, admin CRUD operations.
- Instrument the daily email cron route to log success/failure.
- Create `/admin/system-log` page with date range, area, result, and text search filters, plus expandable row details.
- Retain system log rows for 3 months and purge older rows automatically.
- Add navigation link to the admin layout.

## Capabilities

### New Capabilities
- `system-activity-log`: Admin-accessible audit trail of operational, administrative, and system events.

### Modified Capabilities
<!-- None — existing behavior is unchanged. -->

## Impact

- **Database**: New `system_logs` table with indexes and 3-month retention cleanup. Migration required.
- **Code**: New `src/lib/system-log.ts` helper, `src/app/admin/system-log/page.tsx`, admin layout nav link, log writes added to existing server actions and cron route.
- **Dependencies**: None.
