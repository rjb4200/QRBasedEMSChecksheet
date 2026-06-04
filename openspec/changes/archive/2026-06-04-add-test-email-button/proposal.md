## Why

Testing the daily email report currently requires sending a curl request with the CRON_SECRET. Adding an in-app test button with a user-selector dropdown on the admin users page lets admins send test reports without using the terminal.

## What Changes

- Add a "Send Test Email" button to the admin users page.
- Add a dropdown to select which admin user receives the test.
- Create a `/api/admin/test-daily-report` endpoint that generates and sends the report to a single recipient.
- The endpoint uses the admin session for authentication instead of CRON_SECRET.

## Capabilities

### Modified Capabilities

- `resend-daily-email-reports`: Admin users page provides an in-app test email button with recipient selection.

## Impact

- New API route: `src/app/api/admin/test-daily-report/route.ts`
- Affects: `src/app/admin/users/page.tsx`
