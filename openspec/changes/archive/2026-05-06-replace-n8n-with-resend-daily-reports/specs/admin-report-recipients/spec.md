## ADDED Requirements

### Requirement: Admin users store report email addresses
The system SHALL allow admin user records to store optional email addresses for daily report delivery.

#### Scenario: Admin user has email
- **WHEN** an admin user record has a valid email address
- **THEN** the system SHALL be able to use that email address for daily report recipient resolution

#### Scenario: Admin user has no email
- **WHEN** an admin user record has no email address
- **THEN** the system SHALL exclude that user from daily report recipients

### Requirement: Admin users can opt in or out of daily reports
The system SHALL store whether an admin user receives daily reports.

#### Scenario: Recipient opted in
- **WHEN** an admin user has a non-empty email address
- **AND** `receives_daily_report` is true
- **THEN** the system SHALL include that user as a daily report recipient

#### Scenario: Recipient opted out
- **WHEN** an admin user has a non-empty email address
- **AND** `receives_daily_report` is false
- **THEN** the system SHALL exclude that user from daily report recipients

### Requirement: Users page manages report recipient fields
The Admin Users page SHALL allow admins to create, view, and update report recipient email settings.

#### Scenario: Create user with email
- **WHEN** an admin creates a new admin user with username, password, and email address
- **THEN** the system SHALL save the email address with the user record

#### Scenario: View user email
- **WHEN** an admin views the Users page
- **THEN** the system SHALL display each user's email address when one is configured

#### Scenario: Update user email
- **WHEN** an admin updates an existing user's email address
- **THEN** the system SHALL persist the new email address

#### Scenario: Update report opt-in
- **WHEN** an admin updates whether a user receives daily reports
- **THEN** the system SHALL persist the updated opt-in value

### Requirement: Recipient email addresses are validated
The system SHALL reject invalid report recipient email addresses.

#### Scenario: Invalid email on create
- **WHEN** an admin creates a user with an invalid email address
- **THEN** the system SHALL reject the request with a validation error

#### Scenario: Invalid email on update
- **WHEN** an admin updates a user with an invalid email address
- **THEN** the system SHALL reject the request with a validation error
