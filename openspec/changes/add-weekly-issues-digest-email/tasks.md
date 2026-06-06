## 1. Database

- [x] 1.1 Create migration adding `receives_weekly_issues_digest boolean DEFAULT true` to `admin_users`
- [x] 1.2 Create migration for `weekly_email_report_runs` table (id, report_week_start date UNIQUE, sent_at, recipient_count, status, error_message)
- [x] 1.3 Apply both migrations
- [x] 2.1 Add `receives_weekly_issues_digest` to GET select, POST insert, and PUT update in admin-users API routes
- [x] 2.2 Add "Weekly issues digest" checkbox to Admin Users page create/edit forms
- [x] 3.1 Create `src/lib/weekly-issues-report.ts` — query open+in_progress issues with latest note, recipient selection
- [x] 3.2 Create `src/lib/email/weekly-issues-report.ts` — build HTML+TEXT email with issue cards, summary stats
- [x] 4.1 Create `src/app/api/cron/weekly-issues-report/route.ts` — CRON_SECRET auth, data fetch, email send, duplicate prevention, system logging
- [x] 5.1 Create `src/app/api/admin/test-weekly-report/route.ts` — admin session auth, single recipient, build + send
- [x] 6.1 Add `0 11 * * 5` cron entry to `vercel.json`
- [x] 7.1 Run `npm run typecheck`
- [x] 7.2 Run `npm run build`
- [ ] 7.3 Manual test: send test weekly digest, verify content
