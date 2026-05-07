## 1. Remove n8n Reporting Path

- [x] 1.1 Remove `N8N_BASE_URL` from `.env.example` and documentation
- [x] 1.2 Remove `N8NGUIDE.md` and n8n workflow assets
- [x] 1.3 Remove or replace n8n-oriented alert documentation references
- [x] 1.4 Decide whether `/api/alerts/incomplete-units` is deleted or retained as a diagnostic endpoint without n8n coupling

## 2. Database and Environment Setup

- [x] 2.1 Add migration for `admin_users.email` and `admin_users.receives_daily_report`
- [x] 2.2 Add migration for `daily_email_report_runs` with unique `report_date`
- [x] 2.3 Add email format validation for nullable admin user emails
- [x] 2.4 Add Resend and cron environment variables to examples/docs
- [x] 2.5 Install `resend` dependency

## 3. Admin Report Recipient Management

- [x] 3.1 Update admin users list API to select email and report opt-in fields
- [x] 3.2 Update admin user create API to accept and validate optional email and report opt-in
- [x] 3.3 Update admin user update API to edit email and report opt-in without requiring password change
- [x] 3.4 Update Admin Users page to create, display, and edit email addresses
- [x] 3.5 Update Admin Users page to display and edit daily report opt-in status

## 4. Daily Report Data Layer

- [x] 4.1 Create shared daily report data utility for report date, unchecked units, exceptions, and recipients
- [x] 4.2 Ensure unchecked unit logic matches current fleet/checksheet completion rules
- [x] 4.3 Ensure exceptions include missing checkboxes, below-par quantities, and non-OK condition items
- [x] 4.4 Handle no-recipient, no-unchecked-units, and no-exceptions cases explicitly

## 5. Resend Email Delivery

- [x] 5.1 Create server-only Resend client/helper
- [x] 5.2 Create daily report text and HTML email template
- [x] 5.3 Send emails only to eligible admin report recipients
- [x] 5.4 Include clear configuration errors for missing Resend settings

## 6. PDF Attachment Generation

- [x] 6.1 Extract or share the existing checksheet document renderer used by `/admin/checksheets/print`
- [x] 6.2 Implement daily checksheet PDF generation for report attachments
- [x] 6.3 Preserve one-unit-per-page and three-column printable layout in the PDF
- [x] 6.4 Fail the daily report send if PDF generation fails

## 7. Protected Cron Endpoint and Idempotency

- [x] 7.1 Create `/api/cron/daily-email-report` route
- [x] 7.2 Require `Authorization: Bearer {CRON_SECRET}` for the cron route
- [x] 7.3 Check `daily_email_report_runs` before sending to prevent duplicates
- [x] 7.4 Record successful, failed, and skipped runs with useful details
- [x] 7.5 Support authorized manual testing without exposing secrets to client code

## 8. Documentation and Deployment

- [x] 8.1 Document Resend account, domain verification, DNS, and API key setup
- [x] 8.2 Document required production environment variables
- [x] 8.3 Document scheduler setup for Vercel, Cloudflare, or chosen host
- [x] 8.4 Document recipient setup through the Admin Users page
- [x] 8.5 Document manual protected test request for the cron endpoint

## 9. Verification

- [x] 9.1 Run typecheck and lint
- [x] 9.2 Verify invalid email addresses are rejected
- [x] 9.3 Verify no-recipient run skips email and records/logs skipped status
- [x] 9.4 Verify duplicate sends are prevented for the same report date
- [x] 9.5 Verify email includes unchecked units, exceptions, and `None` sections when empty
- [x] 9.6 Verify PDF attachment opens and matches the existing three-column checksheet layout
- [x] 9.7 Verify app no longer requires n8n or `N8N_BASE_URL`
