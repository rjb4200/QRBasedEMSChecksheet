## Context

The daily email report is triggered by cron or manual curl with CRON_SECRET. The admin users page is a client component that already manages user state and has API access.

## Goals / Non-Goals

**Goals:**

- Add a dropdown to select an admin user as the test recipient.
- Add a "Send Test Email" button that sends the daily report to just that user.
- Show a loading state and success/error feedback.

**Non-Goals:**

- Change the cron endpoint behavior.
- Record test sends in `daily_email_report_runs`.

## Decisions

1. New admin-auth endpoint at `/api/admin/test-daily-report`.

   Accepts a POST with `{ email: string }`. Authenticates via admin session cookie (matching the pattern used by `/api/admin-users`). Calls `getDailyEmailReport()` and `sendEmailWithAttachment()` with a single recipient.

   Alternative: call the cron endpoint from the client with the CRON_SECRET. Would expose the secret to the browser.

2. Dropdown populated from existing users list.

   The page already fetches the full user list on mount. Filter to only users with email addresses and `receives_daily_report = true`.

   Alternative: add a new API to list eligible recipients. Unnecessary since the data is already loaded.

3. Send from the server directly, bypassing database recording.

   Test emails do not record a row in `daily_email_report_runs` or `system_logs`. This keeps test sends from interfering with production reporting state.

   Alternative: record test runs. Would pollute the production run history.
