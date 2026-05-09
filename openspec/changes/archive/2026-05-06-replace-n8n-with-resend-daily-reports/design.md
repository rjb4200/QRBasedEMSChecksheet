## Context

The app currently has n8n-oriented alerting assets: `N8N_BASE_URL` in `.env.example` and README, `N8NGUIDE.md`, an `n8n/` workflow, and `/api/alerts/incomplete-units` that returns alert payload data instead of sending email itself. The app also has a printable checksheet page at `/admin/checksheets/print` backed by `getDailyChecksheetDocument`, with a three-column print layout that already highlights exceptions.

Admin users are stored in `admin_users` and currently have username/password fields only. Daily report delivery needs email recipients, opt-in state, cron security, duplicate send protection, Resend delivery, and a PDF attachment path owned by the app.

## Goals / Non-Goals

**Goals:**
- Remove n8n from daily email reporting and app documentation.
- Send the 1000 daily report from a protected app route using Resend.
- Store recipient email addresses and report opt-in state on admin users.
- Include unchecked units, submitted exceptions, and an all-unit checksheet PDF attachment.
- Reuse existing checksheet document data and preserve the same three-column printable Fleet-panel layout for the attachment.
- Ensure daily email PDF attachments visually match the Fleet panel print sheets, including the three-column compartment flow, WFD/city branding, bordered checksheet frame, compact typography, status badges, exception-row highlighting, and one-unit-per-page behavior.
- Prevent duplicate daily sends with a database run log.

**Non-Goals:**
- Do not keep n8n as a fallback or parallel delivery path.
- Do not expose Resend or cron secrets to client code.
- Do not change checkoff submission behavior.
- Do not redesign the printable checksheet layout beyond the changes needed to render it as an attachment.

## Decisions

**Use `admin_users` for report recipients.**

`admin_users` is the current custom admin identity table used by the Users page and admin session logic, so recipient fields belong there rather than the Supabase Auth `users` table. Add nullable `email` and non-null `receives_daily_report` defaulting to true. Reports send only to admin users with a valid non-empty email and opt-in true.

**Use a protected app cron endpoint.**

Create `/api/cron/daily-email-report` and require `Authorization: Bearer ${CRON_SECRET}`. The endpoint should be callable by Vercel Cron, Cloudflare Cron, or another scheduler at `0 10 * * *`. The endpoint determines the report date with existing daily shift logic and `DAILY_REPORT_TIMEZONE` where needed.

**Use Resend from server-only code.**

Add `resend` and server helpers under `src/lib/email/`. Only server routes and server utilities read `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, optional reply-to, and optional subject prefix. Missing required config should produce clear server-side errors.

**Create shared daily report data functions.**

Introduce `src/lib/daily-report.ts` or equivalent to gather unchecked units, discrepancies, recipient data, and PDF data. The cron route should not duplicate fleet/checksheet/discrepancy query rules scattered across pages.

**Preserve Fleet-panel print layout in the daily email attachment.**

The checksheet attachment sent by `/api/cron/daily-email-report` must use the same checksheet document data as `/admin/checksheets/print` and must preserve the Fleet panel's three-column print intent. The generated PDF must remain a checksheet packet, not a summary report, and must display each unit with the same operational fields used by the Fleet print page: unit name, date, shift, unit/archive status, crew, checked-by, started/submitted/duration, daily comments, generated timestamp, completed/total count, compartments, item actuals, expected par values, and exception indicators.

The attachment renderer may use a dedicated PDF library, but any fallback renderer must intentionally mirror the Fleet print page's visual rules: one unit per page, letter page size, 0.25 inch print-margin equivalent, three columns, compact rows, bordered checksheet body, WFD logo, City seal, status badges, and red exception-row emphasis. Daily email code should not attach older static PDF assets or a separately designed report when the requested artifact is the Fleet-panel checksheet packet.

**Always send the daily email when recipients exist.**

The first version should send every day at 1000, even when unchecked units and exceptions are both empty, with `None` in those sections. This makes automation health visible.

**Use a run log for idempotency.**

Add `daily_email_report_runs` with unique `report_date`. A successful run blocks duplicate sends for that date. Failed/skipped statuses are recorded with error details or recipient count.

## Risks / Trade-offs

- **Browser PDF generation may not fit the host runtime** -> Confirm deployment target before implementation; keep dedicated PDF rendering as fallback.
- **Dedicated PDF output can drift from Fleet print CSS** -> Treat `/admin/checksheets/print` as the visual source of truth and update the PDF attachment renderer whenever the Fleet print layout changes.
- **PDF attachment size could grow** -> Generate one all-unit PDF first; fail loudly if Resend rejects attachment size, then optimize or split later.
- **Cron may run twice** -> Use `daily_email_report_runs` unique `report_date` and success-state checks before sending.
- **No recipients configured** -> Record skipped status and return success to avoid noisy scheduler retries.
- **Timezone mismatch** -> Use existing shift-date logic and document `DAILY_REPORT_TIMEZONE=America/New_York`; schedule at 1000 local where provider supports it.
- **Partial report on PDF failure could hide a problem** -> Do not send the email if PDF generation fails in the first version.

## Migration Plan

1. Add database migration for `admin_users.email`, `admin_users.receives_daily_report`, email format check, and `daily_email_report_runs`.
2. Add Resend dependency and environment documentation.
3. Remove n8n config/docs/workflow assets and n8n-oriented alerting assumptions.
4. Add recipient management to the Users API and page.
5. Add shared daily report data, email template, Resend helper, Fleet-print-aligned PDF attachment generator, and protected cron route.
6. Configure the production scheduler to call `/api/cron/daily-email-report` at 1000.
7. Test with a protected manual request before enabling the daily schedule.
8. Compare a manually generated daily email PDF against `/admin/checksheets/print?date=<date>` after layout changes to verify the same three-column checksheet packet is being sent.

## Open Questions

- Which host will run production cron and PDF generation: Vercel, Cloudflare, or another provider?
- Should `force=true` be allowed for manual testing after a successful send, and should it require the same cron secret only or admin authentication too?
- Should the existing `/api/alerts/incomplete-units` be deleted immediately or kept temporarily as a read-only diagnostic endpoint without n8n documentation?
