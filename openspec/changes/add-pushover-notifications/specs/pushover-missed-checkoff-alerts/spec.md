## ADDED Requirements

### Requirement: Missed checkoff alerts are sent via Pushover at 0930
The system SHALL send Pushover alerts at 0930 ET listing any in-service units that are not 100% complete for the current daily shift.

#### Scenario: Incomplete units at 0930
- **WHEN** the Vercel cron triggers at 0930 ET on a day with one or more incomplete in-service units
- **THEN** the system SHALL send a Pushover notification to all admin users with `pushover_missed_checkoff` enabled
- **AND** the message SHALL include the count of incomplete units

#### Scenario: All units complete at 0930
- **WHEN** the Vercel cron triggers at 0930 ET and all in-service units are 100% complete
- **THEN** no Pushover notification SHALL be sent

#### Scenario: Outside quiet hours
- **WHEN** the Vercel cron triggers outside 0800-2200 ET
- **THEN** no Pushover notification SHALL be sent

### Requirement: Follow-up alert sent at 1300 if units remain incomplete
The system SHALL send a follow-up Pushover alert at 1300 ET for any units that are STILL incomplete since the 0930 initial alert.

#### Scenario: Units still incomplete at 1300
- **WHEN** the Vercel cron triggers at 1300 ET and incomplete units remain
- **THEN** the system SHALL send a Pushover notification to all admin users with `pushover_missed_checkoff_fup` enabled
- **AND** the message SHALL indicate it is a follow-up and include the count of still-incomplete units

#### Scenario: Units completed by 1300
- **WHEN** the Vercel cron triggers at 1300 ET and all units are now complete
- **THEN** no follow-up Pushover notification SHALL be sent

#### Scenario: Follow-up outside quiet hours
- **WHEN** the Vercel cron triggers outside 0800-2200 ET
- **THEN** no Pushover notification SHALL be sent

### Requirement: Alert message includes unit summary
Each Pushover alert SHALL include the count of incomplete units and a brief summary of the worst-offending units.

#### Scenario: Multiple incomplete units
- **WHEN** the 0930 alert fires with 4 incomplete units
- **THEN** the message SHALL state the count and list the 3 lowest-completion units with their names and percentages

#### Scenario: Single incomplete unit
- **WHEN** the 0930 alert fires with 1 incomplete unit
- **THEN** the message SHALL use singular grammar ("1 unit incomplete")

### Requirement: Out-of-service units are excluded
Units marked as "Out-of-Service" SHALL NOT be included in missed-checkoff Pushover alerts.

#### Scenario: OOS unit excluded
- **WHEN** an out-of-service unit is incomplete at alert time
- **THEN** the unit SHALL NOT appear in the Pushover alert

### Requirement: Alert recipient resolution respects per-admin preferences
The system SHALL only send each Pushover alert to admin users who have explicitly opted into that specific alert type.

#### Scenario: Initial alert recipient filtering
- **WHEN** the 0930 alert fires
- **THEN** only admins with `pushover_alert_enabled = true`, `pushover_missed_checkoff = true`, AND a valid `pushover_user_key` SHALL receive the alert

#### Scenario: Follow-up alert recipient filtering
- **WHEN** the 1300 follow-up alert fires
- **THEN** only admins with `pushover_alert_enabled = true`, `pushover_missed_checkoff_fup = true`, AND a valid `pushover_user_key` SHALL receive the alert

### Requirement: Alerts are triggered by Vercel cron, not n8n
The system SHALL use native Vercel cron scheduling for missed-checkoff alerts. No external workflow automation SHALL be required.

#### Scenario: Vercel cron triggers the handler
- **WHEN** Vercel fires the scheduled cron at 0930 or 1300 ET
- **THEN** the endpoint SHALL process the alert without any n8n dependency

### Requirement: Alert sends are logged to system_logs
Each Pushover alert send attempt SHALL be logged to the `system_logs` table.

#### Scenario: Successful alert logged
- **WHEN** a Pushover alert is sent successfully
- **THEN** the system SHALL log the event with `area = "pushover"`, `action = "missed_checkoff.sent"`, an `after_data` object listing recipient usernames and incomplete unit count, and `result = "success"`

#### Scenario: Failed alert logged
- **WHEN** a Pushover alert fails to send (API error, no recipients, etc.)
- **THEN** the system SHALL log the event with `result = "failure"` and include the error message
