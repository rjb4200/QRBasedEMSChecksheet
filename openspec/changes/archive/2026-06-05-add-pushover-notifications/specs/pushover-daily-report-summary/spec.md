## ADDED Requirements

### Requirement: Daily report summary is pushed after email success
After the 1000 daily report email sends successfully, the system SHALL push a brief summary to admin users opted into Pushover daily report alerts.

#### Scenario: Summary pushed after successful email
- **WHEN** the daily report cron sends email successfully
- **THEN** the system SHALL send a Pushover summary to all admins with `pushover_daily_report` enabled
- **AND** the message SHALL include report date, unit completion count, and exception count

#### Scenario: Summary skipped when email has no recipients
- **WHEN** the daily report cron skips email because no recipients are configured
- **THEN** no Pushover summary SHALL be sent

#### Scenario: Summary skipped when email fails
- **WHEN** the daily report email fails to send
- **THEN** no Pushover summary SHALL be sent (the email failure error SHALL be the primary concern)

#### Scenario: Pushover failure does not affect email
- **WHEN** the daily report email sends successfully but the Pushover push fails
- **THEN** the email SHALL still be considered successfully sent
- **AND** the Pushover failure SHALL be logged separately

#### Scenario: Outside quiet hours
- **WHEN** the daily report cron runs outside 0800-2200 ET
- **THEN** the Pushover summary SHALL NOT be sent (email is still sent normally)

### Requirement: Pushover daily report respects per-admin preferences
The system SHALL only push the daily report summary to admin users who have opted into Pushover daily report alerts.

#### Scenario: Recipient filtering
- **WHEN** the daily report push fires
- **THEN** only admins with `pushover_alert_enabled = true`, `pushover_daily_report = true`, AND a valid `pushover_user_key` SHALL receive the push
- **AND** this filtering SHALL be independent of the email recipient list (an admin can receive Pushover without receiving email, and vice versa)
