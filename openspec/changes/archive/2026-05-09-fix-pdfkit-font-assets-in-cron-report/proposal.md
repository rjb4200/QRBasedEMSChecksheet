## Why

The daily email cron report is failing in production with `ENOENT: no such file or directory, open '/ROOT/node_modules/pdfkit/js/data/Helvetica.afm'`. The PDFKit library requires `.afm` font metric files for built-in fonts, but Next.js standalone deployment does not include these files in the server bundle, causing the cron job to fail.

## What Changes

- Add `outputFileTracingIncludes` configuration to `next.config.ts` to include PDFKit's `.afm` font metric files in the server bundle for the cron endpoint
- No changes to PDF layout, email flow, or Resend configuration
- No changes to PDF generation code in `src/lib/pdf/daily-checksheets.ts`

## Capabilities

### New Capabilities

- None - this is a bug fix, not a new feature

### Modified Capabilities

- None - no spec-level behavior changes

## Impact

- `next.config.ts`: Add output tracing includes for PDFKit AFM files
- `src/app/api/cron/daily-email-report/route.ts`: No changes needed (already uses `runtime = "nodejs"`)
- `src/lib/pdf/daily-checksheets.ts`: No changes needed (uses built-in Helvetica font)
- Dependencies: No new dependencies required