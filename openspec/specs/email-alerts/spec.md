## Requirements

### Requirement: Alert includes unit details and completion percentage
Each Pushover alert SHALL include the count of incomplete units and the names and completion percentages of the worst-offending units in the push message body.

#### Scenario: Alert includes completion details
- **WHEN** a Pushover alert is sent for missed checkoffs
- **THEN** the push message SHALL include the count of incomplete units and summary details for the lowest-completion units

### Requirement: Out-of-service units are excluded from alerts
Units marked as "Out-of-Service" SHALL NOT be included in missed checkoff alerts.

#### Scenario: OOS unit excluded from alert
- **WHEN** an out-of-service unit is incomplete at alert time
- **THEN** the unit is not included in the Pushover alert

### Requirement: Daily email includes section comments alongside unchecked units and exceptions
The daily email report SHALL include compartment and kit section comments for the report date alongside the existing unchecked unit and exception content.

#### Scenario: Email contains section comments section
- **WHEN** the daily email report is generated for a date with section comments
- **THEN** the email content SHALL include a Section Comments section
- **AND** comments SHALL be grouped by unit name

#### Scenario: Email preserves existing content
- **WHEN** section comments are added to the daily email
- **THEN** the existing unchecked units, exceptions, and attachment sections SHALL remain unchanged
