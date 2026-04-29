## ADDED Requirements

### Requirement: Missed checkoff alerts are sent at 09:00
The system SHALL send email alerts to admin users at 09:00 for any in-service unit that is not 100% complete.

#### Scenario: Alert sent at 09:00 for incomplete daily checkoff
- **WHEN** the clock reaches 09:00 and an in-service unit is not 100% complete for the current daily checkoff
- **THEN** an email alert is sent to admin users listing the incomplete units

### Requirement: Alert includes unit details and completion percentage
Each email alert SHALL include the unit name, number of compartments completed, total compartments, and completion percentage.

#### Scenario: Alert includes completion details
- **WHEN** an alert email is sent
- **THEN** it includes "EC3: 18 of 25 compartments completed (72%)"

### Requirement: No alert sent when all units are complete
If all in-service units are 100% complete at alert time, no email SHALL be sent.

#### Scenario: All units complete at 09:00
- **WHEN** all in-service units are 100% complete for the current daily checkoff
- **THEN** no email alert is sent at 09:00

### Requirement: Out-of-service units are excluded from alerts
Units marked as "Out-of-Service" SHALL NOT be included in missed checkoff alerts.

#### Scenario: OOS unit excluded from alert
- **WHEN** an out-of-service unit is incomplete at alert time
- **THEN** the unit is not included in the email alert

### Requirement: Alerts are sent via n8n scheduled workflow
Email alerts SHALL be triggered by an n8n scheduled workflow that queries the system for incomplete units.

#### Scenario: n8n workflow executes at scheduled time
- **WHEN** the n8n cron schedule triggers at 09:00
- **THEN** the workflow queries the database and sends emails for incomplete units
