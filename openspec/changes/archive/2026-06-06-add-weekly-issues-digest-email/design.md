## Context

The daily report email infrastructure provides a proven pattern: cron handler with CRON_SECRET auth → data layer → email builder → Resend send → duplicate prevention via runs table → system logging. The weekly issues digest follows this exact pattern but replaces unit checkoff data with issue tracker data.

## Goals / Non-Goals

**Goals:**
- Send a Friday morning email (7 AM ET) listing all open and in_progress issues
- Each issue card shows: title, unit, status, tags, creator, note count, latest note preview
- Summary stats at top: counts by status
- Duplicate prevention via `weekly_email_report_runs` table keyed by week start date
- End-of-email link to Issues page

**Non-Goals:**
- No PDF attachment (different from daily report)
- No closed issues (only open + in_progress)
- No per-tag summaries
- No issue detail page links in the email (just a general link to the Issues page)

## Decisions

### Decision 1: Friday morning, 7 AM ET

`0 11 * * 5` in Vercel cron (11 AM UTC = 7 AM ET). Gives admins an end-of-week summary before the weekend.

**Rationale:** Friday morning lets admins review what's outstanding before the weekend. Different cadence from the daily operational report.

### Decision 2: `receives_weekly_issues_digest` boolean, default true

A new column on `admin_users`, independent of `receives_daily_report`. Both can be toggled independently. Defaults to `true` so existing admins automatically receive it (opt-out rather than opt-in).

**Rationale:** Separate from the daily report preference because they serve different audiences. An admin might want the daily operational report but not the weekly issues summary, or vice versa.

### Decision 3: Issue cards include latest note preview

Each issue card in the email shows the text of the most recent note (truncated to 200 chars), along with total note count. If no notes exist, shows "No notes."

**Rationale:** The latest note gives the recipient context about what's happening with the issue without needing to open the Issues page. This is the most valuable piece of information in the digest.

### Decision 4: No per-issue links in the email

One link at the bottom to `/admin/issues`. Individual issue permalinks in email are fragile (the admin may not be authenticated on that device).

**Rationale:** The email is a summary, not a replacement for the Issues page. Clicking through opens the full list with all filtering available.

### Decision 5: `weekly_email_report_runs` keyed by week start date

The table uses `report_week_start DATE UNIQUE` (the Monday of the report week) as the dedup key. Same pattern as `daily_email_report_runs` but with a different key.

**Rationale:** Prevents duplicate sends if the cron fires multiple times on the same Monday.

## Risks / Trade-offs

- **[Risk] Email is long if many issues exist** → Mitigation: Only open + in_progress issues are included. If volume becomes a problem, can add pagination or summary-only mode.
- **[Trade-off] No issue detail links** → Acceptable for a summary digest. The Issues page link is sufficient.
- **[Risk] Monday holidays** → The cron still fires on Monday regardless. Edge case for a small admin team.
