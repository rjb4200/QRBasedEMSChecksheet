## ADDED Requirements

### Requirement: Daily report cron pushes Pushover summary after email
After the 1000 daily report email sends successfully, the system SHALL push a brief summary notification to admin users opted into Pushover daily report alerts.

#### Scenario: Pushover sent after successful email
- **WHEN** the daily report email sends successfully to one or more recipients
- **THEN** the system SHALL query `admin_users` for recipients with `pushover_alert_enabled = true`, `pushover_daily_report = true`, and a valid `pushover_user_key`
- **AND** the system SHALL send each a Pushover notification with report date, unit completion count, and exception count

#### Scenario: Pushover skipped when email is skipped
- **WHEN** the daily report cron skips email delivery (no email recipients)
- **THEN** the system SHALL NOT send Pushover summaries

#### Scenario: Pushover failure logged but email unaffected
- **WHEN** the Pushover push fails after a successful email send
- **THEN** the email send SHALL still be recorded as successful
- **AND** the Pushover failure SHALL be logged to system_logs with `area = "pushover"` and `result = "failure"`

#### Scenario: Pushover summary logged on success
- **WHEN** the Pushover daily report summary sends successfully
- **THEN** the system SHALL log the event to system_logs with `area = "pushover"`, `action = "daily_report.sent"`, and `result = "success"`
- **AND** the `after_data` SHALL include recipient usernames and the Pushover receipt/request ID

#### Scenario: Pushover outside quiet hours
- **WHEN** the daily report cron runs outside 0800-2200 ET
- **THEN** the Pushover summary SHALL NOT be sent
- **AND** the email SHALL still be delivered normally
- **AND** the quiet-hours skip SHALL be logged to system_logs

#### Scenario: No Pushover recipients configured
- **WHEN** no admin users have Pushover daily report alerts enabled
- **THEN** the system SHALL skip the Pushover send without error and log that no Pushover recipients exist
