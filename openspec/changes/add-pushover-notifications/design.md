## Context

The application currently has zero Pushover integration. Notifications are email-only via Resend. The n8n workflow that handled missed-checkoff alerts is deprecated and its `/api/alerts/incomplete-units` endpoint is unused. Per-admin notification preferences are limited to a single `receives_daily_report` boolean.

Pushover is a push notification SaaS with a simple REST API. Each admin creates a free Pushover account, gets a 30-character User Key, and installs the Pushover app on their devices. The app-side holds a shared Application Token. Sending a push is a POST to `api.pushover.net/1/messages.json` with `token`, `user`, and `message`.

## Goals / Non-Goals

**Goals:**
- Store per-admin Pushover User Key and per-event-type notification booleans
- Send Pushover alerts at 0930 (initial missed-checkoff) and 1300 (follow-up) via Vercel cron
- Send a Pushover summary after the 1000 daily report email succeeds
- Enforce quiet hours (0800-2200 ET) on all automated sends; manual test sends always bypass
- Provide a test send button in the admin users UI
- Remove the deprecated incomplete-units alerts API

**Non-Goals:**
- Per-device configuration (admins manage devices in Pushover app)
- Per-event priority levels (all automated sends use normal priority)
- Quiet hours configurability (hardcoded 0800-2200)
- Replacing email — Pushover is additive, not a replacement
- Pushover for storage warnings (future enhancement)

## Decisions

### Decision 1: Shared app token + per-admin User Key

One `PUSHOVER_APP_TOKEN` env var shared across all admins. Each admin provides their own Pushover User Key. This is the standard Pushover pattern — the app token identifies the application, the user key identifies the recipient.

**Alternatives considered:**
- Per-admin app tokens: Adds admin UI complexity for no benefit. Pushover users manage devices/sounds per-app already.
- Global user key (one recipient for all pushes): Defeats the purpose of per-admin preferences.

### Decision 2: Simple POST-based client, no SDK

Pushover's API is a single POST endpoint with a JSON response. A lightweight wrapper in `src/lib/pushover.ts` is sufficient — no npm package needed. This avoids a dependency with potential vulnerabilities and keeps the integration simple.

### Decision 3: Five boolean columns on admin_users, not a separate table

A separate `admin_notification_preferences` table adds join complexity for minimal normalization benefit. Five nullable columns on `admin_users` is simpler and matches the existing pattern (`email`, `receives_daily_report`). Pushover is the only push channel; if more channels are added later, a separate table can be introduced then.

### Decision 4: 0930 and 1300 as separate cron entries, shared handler

Both cron entries call the same route handler. The handler determines which alert type to send by comparing the current hour against the configured times. This avoids duplicating the incomplete-units query logic.

### Decision 5: Hardcoded quiet hours with manual test bypass

Quiet hours (0800-2200 ET) are hardcoded in the pushover client. Automated cron sends check the hour before sending. The test send endpoint bypasses this check entirely. This keeps complexity minimal while preventing middle-of-the-night accidental cron sends.

### Decision 6: Remove incomplete-units alerts API entirely

The `/api/alerts/incomplete-units` endpoint and its helper `src/lib/email/missed-checkoff.ts` are only used by the deprecated n8n workflow. The cron-based Pushover handler uses the same Supabase queries directly, so the API has no remaining consumer. Removing it cleans up dead code.

The `getCheckoffDiscrepancies` helper in `src/lib/discrepancies.ts` may be used elsewhere — verify before removing.

### Decision 7: Pushover as a post-email enhancement to daily report

The daily report cron already handles email delivery, dedup, error handling, and logging. Pushover is added as an additional step after successful email send — if Pushover fails, the email still succeeded and the failure is logged separately. Pushover failure does not block email.

## Risks / Trade-offs

- **[Risk] Pushover API downtime** → Mitigation: Pushover failures are logged to system_logs and do not block email delivery. No retry — the next cron run handles it naturally.
- **[Risk] Cron fires outside quiet hours due to Vercel scheduling drift** → Mitigation: The handler double-checks the current hour before sending.
- **[Risk] Admin forgets Pushover User Key and stops receiving alerts** → Mitigation: Test send button lets admins verify their key works. System logs show which admins received each push.
- **[Trade-off] No per-device control from app UI** → Pushover's native device management is more capable than anything we'd build. Admins already configure devices there.
- **[Trade-off] Duplicate alerts if cron misfires** → Mitigation: Pushover messages include the report date; recipients can ignore duplicates. A future dedup table could be added if this becomes a problem.
