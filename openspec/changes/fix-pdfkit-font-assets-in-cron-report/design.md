## Context

The daily email cron job at `/api/cron/daily-email-report` uses PDFKit to generate PDF attachments. PDFKit's built-in fonts (Helvetica, Helvetica-Bold) require `.afm` (Adobe Font Metric) files from `node_modules/pdfkit/js/data/`. In production, Next.js standalone output does not include these files, causing ENOENT errors when the cron job runs.

## Goals / Non-Goals

**Goals:**
- Include PDFKit's `.afm` font metric files in the Next.js server bundle for the cron endpoint
- Fix the production cron job without changing PDF layout or email flow
- Use Next.js built-in output file tracing configuration

**Non-Goals:**
- Change PDF generation code or library
- Modify email delivery logic or Resend configuration
- Add new dependencies or alternative font solutions

## Decisions

1. **Use `outputFileTracingIncludes` in next.config.ts**
   - Rationale: Next.js 14+ provides `outputFileTracingIncludes` to include additional files in server bundles. This is the recommended approach for edge cases where file tracing misses dependencies.
   - Alternative: Copy AFM files to public folder - rejected as not idiomatic for server-side dependencies.

2. **Scope to cron API route only**
   - Rationale: Only the cron endpoint uses PDFKit with built-in fonts. Scoping to that route keeps the change minimal.
   - Pattern: `/api/cron/daily-email-report/**`

## Risks / Trade-offs

- **Risk**: AFM file path may differ between pdfkit versions
  - **Mitigation**: Verify path `pdfkit/js/data/*.afm` matches installed version in `node_modules/`
- **Risk**: Testing locally won't catch the issue (local dev uses full node_modules)
  - **Mitigation**: Need to build standalone and test the output bundle, or verify in staging

## Migration Plan

1. Add `outputFileTracingIncludes` to `next.config.ts`
2. Build the project (`npm run build`)
3. Verify AFM files are included in `.next/server/chunks/` or `.next/cache/`
4. Deploy to production
5. Test cron endpoint with `?force=true` parameter
6. Monitor for ENOENT errors in logs

## Open Questions

- None - the fix is straightforward Next.js configuration