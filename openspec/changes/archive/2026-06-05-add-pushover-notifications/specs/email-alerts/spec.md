## REMOVED Requirements

### Requirement: Alerts are sent via n8n scheduled workflow
**Reason**: n8n workflow is deprecated. Missed-checkoff alerts are now handled by native Vercel cron jobs via the Pushover notification system. The `/api/alerts/incomplete-units` endpoint no longer has a consumer.
**Migration**: The new `pushover-missed-checkoff-alerts` capability supersedes n8n-based alerting. No migration required — n8n was already turned off. Remove `N8N_BASE_URL` environment variable.

### Requirement: Daily alert can include printable check sheets
**Reason**: The alerts API that returned print URLs was consumed by the n8n workflow, which is deprecated. The daily report email already includes a PDF attachment and remains the authoritative daily summary.
**Migration**: No migration needed. The daily report email continues to provide PDF attachments.

### Requirement: Missed checkoff alerts are sent at 09:00
**Reason**: Replaced by Pushover-based alerts at 0930 and 1300 via Vercel cron. The email-only approach and n8n dependency are both being retired.
**Migration**: Admin users should configure their Pushover preferences on the Admin Users page.

## MODIFIED Requirements

### Requirement: Alert includes unit details and completion percentage
Each Pushover alert SHALL include the count of incomplete units and the names and completion percentages of the worst-offending units in the push message body.

#### Scenario: Alert includes completion details
- **WHEN** a Pushover alert is sent for missed checkoffs
- **THEN** the push message SHALL include the count of incomplete units and summary details for the lowest-completion units

## REMOVED Requirements

### Requirement: Alert includes submitted item exceptions
**Reason**: The missed-checkoff Pushover alert focuses on unit-level completion status. Exception details remain available in the daily report email. Keeping the push message concise improves readability on mobile devices.
**Migration**: Exception details continue to be reported in the daily report email and the Records page.

### Requirement: No alert sent when all units are complete
**Reason**: Consolidated into the `pushover-missed-checkoff-alerts` spec which handles the same behavior for Pushover alerts.
**Migration**: The behavior is preserved in the Pushover cron handler — no push is sent when all units are complete.
