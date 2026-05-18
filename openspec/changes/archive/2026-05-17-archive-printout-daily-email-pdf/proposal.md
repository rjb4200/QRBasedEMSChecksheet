## Why

The daily email report currently attaches a checksheet-style PDF that does not match the archive printout format supervisors use at `/admin/archives/print`. The archive print page provides a better daily record layout showing unit service status, check completion states, exceptions, crew names, and comments for the selected date. The emailed PDF should match that same historical record format so the attachment mirrors the official printed daily ledger.

## What Changes

- Replace the daily email PDF attachment from a per-unit checksheet layout to the archive printout layout matching `/admin/archives/print?date=YYYY-MM-DD`.
- Create a shared archive report data builder so the archive print page and email PDF generator use the same data shape.
- Generate the email PDF using PDFKit with a landscape table layout matching the archive print page content.
- Use the filename `daily-check-archive-YYYY-MM-DD.pdf` for the attachment.
- **BREAKING**: Daily email PDF attachment format changes from per-unit checksheet pages to a single archive-style ledger table.

## Capabilities

### New Capabilities
- `archive-printout-email-pdf`: PDF generation for daily email that matches the archive printout layout with service status, check states, exceptions, crew names, and comments.

### Modified Capabilities
- `daily-checksheet-pdf-attachment`: PDF attachment requirements change from per-unit checksheet pages to archive-style daily ledger format.

## Impact

- `src/lib/pdf/daily-checksheets.ts` — PDF generation internals
- `src/app/api/cron/daily-email-report/route.ts` — attachment reference
- `src/app/admin/archives/print/page.tsx` — may share data builder
- Existing cron schedule, recipient logic, and Resend setup remain unchanged
