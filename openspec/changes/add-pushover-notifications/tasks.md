## 1. Database Migration

- [x] 1.1 Create migration adding pushover columns to admin_users (pushover_user_key, pushover_alert_enabled, pushover_daily_report, pushover_missed_checkoff, pushover_missed_checkoff_fup)
- [x] 1.2 Apply migration
- [x] 2.1 Create `src/lib/pushover.ts` with `sendPushoverNotification()` function using the Pushover REST API
- [x] 2.2 Add quiet hours check (0800-2200 ET) that automated sends respect but manual tests bypass
- [x] 2.3 Add `PUSHOVER_APP_TOKEN` to `.env.example`
- [x] 3.1 Remove `src/app/api/alerts/incomplete-units/route.ts`
- [x] 3.2 Remove `src/lib/email/missed-checkoff.ts`
- [x] 3.3 Remove `getCheckoffDiscrepancies` export from `src/lib/discrepancies.ts`
- [x] 3.4 Remove `N8N_BASE_URL` from `.env.example`
- [x] 4.1 Update create user route (`src/app/api/admin-users/route.ts`) to accept pushover fields
- [x] 4.2 Update update user route (`src/app/api/admin-users/[id]/route.ts`) to accept pushover fields
- [x] 5.1 Add Pushover preferences section to admin users page (`src/app/admin/users/page.tsx`) create form
- [x] 5.2 Add Pushover preferences section to admin users page edit form (User Key input, master toggle, three event-type checkboxes)
- [x] 5.3 Add "Test Pushover" button that sends a test notification to the current user's devices
- [x] 5.4 Add test Pushover API route (`src/app/api/admin/test-pushover/route.ts`)
- [x] 6.1 Create `src/app/api/cron/pushover-missed-checkoff/route.ts` with CRON_SECRET authorization and quiet hours check
- [x] 6.2 Query incomplete in-service units and submit Pushover to opted-in admins
- [x] 6.3 Support both 0930 (initial) and 1300 (follow-up) via the same handler, filtering recipients by the respective preference toggle
- [x] 6.4 Log send results to system_logs
- [x] 7.1 After successful email send in `src/app/api/cron/daily-email-report/route.ts`, query Pushover recipients and send summary
- [x] 7.2 Log Pushover send result separately from email result (Pushover failure does not affect email status)
- [x] 8.1 Add 0930 and 1300 cron entries to `vercel.json` for the pushover-missed-checkoff endpoint
- [x] 9.1 Add Pushover setup section to `ADMINGUIDE.md` covering account setup, User Key, preference toggles, alert types, test sends, and quiet hours policy

## 10. Verification

- [x] 10.1 Run `npm run typecheck`
- [x] 10.2 Run `npm run build`
- [ ] 10.3 Manual test: Pushover test send from admin users page
