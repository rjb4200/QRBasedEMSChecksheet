## Why

The daily email report currently lists every individual exception item, creating long, hard-to-scan emails. It also omits general unit comments, showing only section comments. Grouping information into per-unit cards with summary stats, exception counts, progress bars, and all comments (general + section) makes the email faster to scan and more actionable.

## What Changes

- Replace per-item exception listings with per-unit exception counts.
- Include general unit comments from `daily_unit_comments` alongside section comments.
- Format the email body as unit cards with status badges, completion stats, progress bars, and grouped comments.
- Show a summary line at the top with total unit counts, complete/open counts, and total exceptions.
- Display complete units as compact green cards.

## Capabilities

### Modified Capabilities

- `resend-daily-email-reports`: Daily email report format uses per-unit cards with exception counts, general comments, progress bars, and summary stats.

## Impact

- Affects `src/lib/daily-report.ts` (data model and query), `src/lib/email/daily-report.ts` (email body generation).
