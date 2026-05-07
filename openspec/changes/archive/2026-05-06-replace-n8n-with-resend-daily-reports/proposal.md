## Why

The app currently relies on optional n8n automation for daily email alerts, which places scheduling and email delivery logic outside the QR Checksheet app. Moving daily reports into the app with Resend reduces operational complexity, centralizes troubleshooting, and enables the report to include unchecked units, submitted exceptions, and the existing printable checksheet document as a PDF attachment.

## What Changes

- Remove n8n-specific daily email automation, documentation, workflow files, and `N8N_BASE_URL` configuration.
- Add Resend-based transactional email support using server-only environment variables.
- Add admin user email management so report recipients can be configured from the Users page.
- Add daily report recipient logic based on admin users with email addresses and report opt-in status.
- Add a protected cron API route for the 1000 daily report.
- Generate a daily email containing unchecked units, exceptions, and a PDF attachment of all unit check sheets for the date.
- Reuse or share the existing three-column printable checksheet layout for PDF generation.
- Add duplicate send protection through a report run log table.
- Update deployment and setup documentation for Resend, cron authorization, and recipient configuration.

## Capabilities

### New Capabilities
- `resend-daily-email-reports`: App-owned daily email report delivery through Resend, including recipients, cron security, duplicate protection, report content, and PDF attachment requirements.
- `admin-report-recipients`: Admin user email address and daily report recipient management.
- `daily-checksheet-pdf-attachment`: App-owned daily checksheet PDF generation for report attachments using the existing printable checksheet layout.

### Modified Capabilities

## Impact

- **Dependencies**: Add `resend`; likely add a server-side PDF generation dependency or hosted rendering strategy depending on deployment constraints.
- **Database**: Add email/report-recipient fields to `admin_users`; add `daily_email_report_runs` for duplicate send protection.
- **Environment**: Remove `N8N_BASE_URL`; add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `DAILY_REPORT_TIMEZONE`, `CRON_SECRET`, and optional reply-to/subject prefix variables.
- **API**: Add protected `/api/cron/daily-email-report` route.
- **UI**: Extend Admin Users page and API to create, display, and update email/report recipient settings.
- **Docs**: Remove n8n setup guidance and replace with Resend/domain/cron setup instructions.
- **Reporting**: Daily email should use the same unchecked-unit, exception, and checksheet data rules as the existing app views.
