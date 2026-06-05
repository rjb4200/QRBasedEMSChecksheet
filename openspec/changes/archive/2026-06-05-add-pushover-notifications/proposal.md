## Why

The current notification system is email-only, and the n8n scheduled workflow that handled missed-checkoff alerts is deprecated. Admin users need real-time push notifications for urgent checkoff issues without relying on external workflow automation. Pushover provides a battle-tested push notification platform that admins can configure per-device on their own terms.

## What Changes

- Add per-admin Pushover credentials (User Key) and four independent notification preference booleans to the admin users record
- Add a Pushover API client library for sending push notifications via the Pushover API
- Add two new Vercel cron endpoints: 0930 missed-checkoff alert and 1300 follow-up if units remain incomplete
- Enhance the existing 1000 daily report cron to push a summary to Pushover after the email is sent
- Hardcode quiet hours (0800-2200 ET) for all automated alerts; manual test sends always allowed
- Add Pushover preferences UI to the Admin Users page (User Key input, toggle checkboxes, test send button)
- Remove the deprecated `/api/alerts/incomplete-units` endpoint and its n8n dependency
- **BREAKING**: The `/api/alerts/incomplete-units` endpoint is removed; any external consumers must migrate

## Capabilities

### New Capabilities

- `pushover-notification-preferences`: Per-admin Pushover credential storage (User Key) and per-event-type notification toggles on the admin users record
- `pushover-missed-checkoff-alerts`: 0930 initial + 1300 follow-up Vercel cron jobs that push missed-checkoff alerts to opted-in admins via Pushover
- `pushover-daily-report-summary`: Post-email Pushover summary after the 1000 daily report cron completes successfully

### Modified Capabilities

- `email-alerts`: Replace n8n-based missed-checkoff alert workflow with native Vercel cron jobs; remove the `/api/alerts/incomplete-units` endpoint and its `N8N_BASE_URL` dependency
- `resend-daily-email-reports`: Add optional Pushover push after successful daily report email send
- `admin-report-recipients`: Extend admin user record with Pushover credential and notification preference fields
- `in-app-documentation-guides`: Add Pushover setup and configuration section to the admin guide

## Impact

- **New files**: `src/lib/pushover.ts` (API client), `src/app/api/cron/pushover-missed-checkoff/route.ts` (cron handler), new database migration
- **Modified files**: `src/app/api/cron/daily-email-report/route.ts`, `src/app/admin/users/page.tsx`, `src/app/api/admin-users/route.ts`, `src/app/api/admin-users/[id]/route.ts`, `ADMINGUIDE.md`
- **Removed files**: `src/app/api/alerts/incomplete-units/route.ts`, `src/lib/email/missed-checkoff.ts`, `src/lib/discrepancies.ts` (if only used by alerts)
- **New env var**: `PUSHOVER_APP_TOKEN`
- **New doc section**: Pushover setup guide added to `ADMINGUIDE.md`
- **Database**: 5 new columns on `admin_users` (pushover_user_key, pushover_alert_enabled, pushover_daily_report, pushover_missed_checkoff, pushover_missed_checkoff_fup)
- **Vercel config**: Two new cron entries (0930, 1300)
- **Dependency**: Pushover HTTP API (no SDK — simple POST request)
