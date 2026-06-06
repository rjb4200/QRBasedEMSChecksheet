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

### Requirement: Admin users store Pushover notification credentials
The system SHALL extend the admin user record with an optional Pushover User Key field and four Pushover notification preference booleans.

#### Scenario: Admin user with full Pushover configuration
- **WHEN** an admin user record has a Pushover User Key and all notification toggles set
- **THEN** the system SHALL persist all Pushover fields with the user record

#### Scenario: Admin user with no Pushover configuration
- **WHEN** an admin user record has no Pushover User Key and all toggles are false
- **THEN** the system SHALL exclude the user from all Pushover notifications

#### Scenario: Pushover User Key validated on save
- **WHEN** an admin saves a Pushover User Key shorter than 30 characters or longer than 40 characters
- **THEN** the system SHALL reject with a validation error

#### Scenario: Null or empty User Key accepted
- **WHEN** an admin clears the Pushover User Key or leaves it empty
- **THEN** the system SHALL accept the save (Pushover is optional)

### Requirement: Admin users page displays Pushover fields
The Admin Users page SHALL display Pushover preference fields when editing or creating an admin user.

#### Scenario: Edit user shows Pushover section
- **WHEN** an admin opens the edit form for an admin user
- **THEN** the system SHALL display a Pushover section with: master toggle, User Key input, missed checkoff checkbox, missed checkoff follow-up checkbox, shift selection, and a test send button

#### Scenario: Create user shows Pushover section
- **WHEN** an admin opens the create user form
- **THEN** the system SHALL display the Pushover section with all fields defaulting to disabled/false/empty

#### Scenario: Test send button visible only with valid User Key
- **WHEN** the admin user has a valid Pushover User Key
- **THEN** the "Test Pushover" button SHALL be enabled
- **WHEN** the admin user has no User Key
- **THEN** the "Test Pushover" button SHALL be disabled or hidden

### Requirement: Admin user API accepts Pushover fields
The admin users create and update API routes SHALL accept the Pushover fields in the request body.

#### Scenario: Create user with Pushover fields
- **WHEN** an admin creates a user with Pushover fields in the request body
- **THEN** the system SHALL persist all Pushover fields to the admin_users record

#### Scenario: Update user Pushover fields
- **WHEN** an admin updates a user's Pushover preferences
- **THEN** the system SHALL persist the new values

#### Scenario: Partial update preserves unchanged Pushover fields
- **WHEN** an admin updates a user without sending Pushover fields
- **THEN** existing Pushover values SHALL remain unchanged

### Requirement: Admin users can opt in or out of weekly issues digest
The system SHALL store a `receives_weekly_issues_digest` boolean per admin user, defaulting to true, controlling whether they receive the weekly issues digest email.

#### Scenario: User record stores weekly digest preference
- **WHEN** an admin user is created or updated
- **THEN** the `receives_weekly_issues_digest` preference SHALL be persisted

#### Scenario: Admin Users page shows weekly digest toggle
- **WHEN** an admin views or edits a user on the Admin Users page
- **THEN** a "Weekly issues digest" checkbox SHALL be displayed alongside the daily report checkbox
