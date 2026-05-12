## 1. Shared Data Builder

- [ ] 1.1 Confirm `getDailyUnitRecords` or a thin wrapper returns the full shape needed by both the archive print page and PDF generator.
- [ ] 1.2 Export a shared type for the archive report data shape consumed by the PDF.

## 2. PDF Generator

- [ ] 2.1 Create or update `src/lib/pdf/daily-checksheets.ts` to generate a landscape letter PDF with an archive-style table layout.
- [ ] 2.2 Include WFD branding (logo + department name) in the PDF header matching the archive print page.
- [ ] 2.3 Render a table with columns for unit name, service status, check status, sections completed/total, exceptions, comments, and crew.
- [ ] 2.4 Handle long exception and comment text gracefully (smaller font, no overflow).
- [ ] 2.5 Use the filename `daily-check-archive-YYYY-MM-DD.pdf` for the attachment.
- [ ] 2.6 Ensure PDF generation works in production/Vercel with no missing font or file errors.

## 3. Cron Route Integration

- [ ] 3.1 Update `src/app/api/cron/daily-email-report/route.ts` to call the updated PDF generator.
- [ ] 3.2 Preserve existing authorization, force-send, dedup, and record-run logic.
- [ ] 3.3 Ensure the email body and subject remain unchanged.

## 4. Verification

- [ ] 4.1 Test with `?force=true` on the cron endpoint to confirm email sends with the archive-style PDF.
- [ ] 4.2 Open the PDF attachment and verify content matches the archive print page for the same date.
- [ ] 4.3 Test with a date that has incomplete, not-started, and OOS units.
- [ ] 4.4 Test with a date that has exceptions and comments.
- [ ] 4.5 Run `npm run typecheck` and `npm run lint`.
