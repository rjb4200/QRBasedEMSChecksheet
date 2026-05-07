## ADDED Requirements

### Requirement: Daily report email is sent through Resend
The system SHALL send the daily EMS checksheet report through Resend from server-side code.

#### Scenario: Daily report sends successfully
- **WHEN** the daily report job runs with Resend configured and at least one recipient configured
- **THEN** the system SHALL send an email through Resend
- **AND** the Resend API key SHALL only be read from server-side environment variables

#### Scenario: Resend configuration is missing
- **WHEN** the daily report job runs without required Resend configuration
- **THEN** the system SHALL fail with a clear server-side configuration error
- **AND** no client-side code SHALL expose the Resend API key

### Requirement: Daily report endpoint is protected
The system SHALL expose a protected cron endpoint for daily report sending.

#### Scenario: Authorized cron request
- **WHEN** `/api/cron/daily-email-report` receives a request with `Authorization: Bearer {CRON_SECRET}`
- **THEN** the system SHALL process the daily report request

#### Scenario: Unauthorized cron request
- **WHEN** `/api/cron/daily-email-report` receives a request without the correct bearer token
- **THEN** the system SHALL return `401 Unauthorized`
- **AND** no email SHALL be sent

### Requirement: Daily report runs at 1000 local time
The system SHALL support scheduled daily report execution at 1000 local time using the configured report timezone.

#### Scenario: Scheduled daily report
- **WHEN** the hosting scheduler calls the cron endpoint at 1000 local time
- **THEN** the system SHALL generate the report for the current daily shift date

### Requirement: Daily report includes unchecked units
The daily report email SHALL list in-service units that have not completed required daily checks.

#### Scenario: Some units are unchecked
- **WHEN** one or more in-service units are incomplete for the report date
- **THEN** the email SHALL list those units under `Unchecked Units`

#### Scenario: No units are unchecked
- **WHEN** all required daily checks are complete
- **THEN** the email SHALL show `Unchecked Units: None`

### Requirement: Daily report includes exceptions
The daily report email SHALL list submitted exceptions for the report date.

#### Scenario: Exceptions exist
- **WHEN** submitted checkoffs contain missing items, below-par quantities, or non-OK condition items
- **THEN** the email SHALL list each exception with unit, target, item, and issue details

#### Scenario: No exceptions exist
- **WHEN** no submitted exceptions exist for the report date
- **THEN** the email SHALL show `Exceptions: None`

### Requirement: Daily report always sends when recipients exist
The system SHALL send the daily report at the scheduled time even when unchecked units and exceptions are both empty.

#### Scenario: Nothing incomplete or exceptional
- **WHEN** the report has no unchecked units and no exceptions
- **AND** one or more recipients are configured
- **THEN** the system SHALL send the report with `None` in both sections

### Requirement: No recipient case is handled cleanly
The system SHALL skip email delivery without error when no eligible recipients exist.

#### Scenario: No configured recipients
- **WHEN** the daily report job finds no eligible recipient email addresses
- **THEN** the system SHALL not call Resend
- **AND** the system SHALL record or log a skipped run
- **AND** the cron endpoint SHALL return success

### Requirement: Duplicate daily sends are prevented
The system SHALL prevent duplicate successful daily report sends for the same report date.

#### Scenario: Report already sent
- **WHEN** a successful run already exists for the report date
- **THEN** the system SHALL not send a duplicate email
- **AND** the system SHALL return a clear already-sent result

#### Scenario: First successful send
- **WHEN** no successful run exists for the report date
- **AND** the report sends successfully
- **THEN** the system SHALL record the successful run with report date, sent timestamp, recipient count, and Resend message identifier when available

### Requirement: n8n is removed from daily email reporting
The system SHALL NOT depend on n8n for daily email report scheduling or delivery.

#### Scenario: Daily report delivery path
- **WHEN** the daily email report is configured
- **THEN** delivery SHALL use the app cron endpoint and Resend
- **AND** the app SHALL NOT require `N8N_BASE_URL`
