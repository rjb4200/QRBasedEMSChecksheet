## Why

Admins track long-running issues through the Issues tracker but must manually check the Issues page to stay informed. A weekly email digest — sent every Friday at 7 AM ET — gives admins an end-of-week summary of all active issues without needing to log in. This follows the established daily report email pattern and gives supervisors visibility into what's outstanding as they wrap up the week.

## What Changes

- Add a `receives_weekly_issues_digest` boolean column to `admin_users` (default true) for opt-in
- Create a `weekly_email_report_runs` table for duplicate prevention
- Create a weekly issues report data layer querying all open and in_progress issues with their latest note
- Create an HTML/TEXT email builder for the weekly digest
- Create a Vercel cron endpoint at `/api/cron/weekly-issues-report` (Friday 7 AM ET)
- Create a test endpoint at `/api/admin/test-weekly-report` for sending a test digest to a single email
- Add opt-in toggle to the Admin Users page
- Schedule via `vercel.json`

## Capabilities

### New Capabilities

- `weekly-issues-digest`: A Monday-morning email digest summarizing all open and in-progress issues with status, tags, unit, creator, note count, and latest note preview

### Modified Capabilities

- `admin-report-recipients`: Extend admin user record with `receives_weekly_issues_digest` boolean preference

## Impact

- **New files**: `src/lib/weekly-issues-report.ts`, `src/lib/email/weekly-issues-report.ts`, `src/app/api/cron/weekly-issues-report/route.ts`, `src/app/api/admin/test-weekly-report/route.ts`, database migration
- **Modified files**: `src/app/admin/users/page.tsx`, `src/app/api/admin-users/route.ts`, `src/app/api/admin-users/[id]/route.ts`, `vercel.json`
- **Database**: New column on `admin_users`, new `weekly_email_report_runs` table
- **Dependencies**: Uses existing Resend email infrastructure
