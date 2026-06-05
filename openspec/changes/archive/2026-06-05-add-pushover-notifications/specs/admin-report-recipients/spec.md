## ADDED Requirements

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
- **THEN** the system SHALL display a Pushover section with: master toggle, User Key input, daily report checkbox, missed checkoff checkbox, missed checkoff follow-up checkbox, and a test send button

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
