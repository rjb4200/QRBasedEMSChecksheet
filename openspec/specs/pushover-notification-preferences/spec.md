## ADDED Requirements

### Requirement: Admin users can store Pushover credentials
The system SHALL allow admin user records to store an optional Pushover User Key for receiving push notifications.

#### Scenario: Admin has Pushover User Key
- **WHEN** an admin user record has a valid Pushover User Key
- **THEN** the system SHALL use that key when sending push notifications to the user

#### Scenario: Admin has no Pushover User Key
- **WHEN** an admin user record has no Pushover User Key
- **THEN** the system SHALL exclude that user from all Pushover notification sends

#### Scenario: User Key is validated on save
- **WHEN** an admin saves a Pushover User Key
- **THEN** the system SHALL validate it is a non-empty string between 30 and 40 characters

### Requirement: Admin users can enable or disable Pushover alerts
The system SHALL store a master toggle for whether an admin user receives any Pushover alerts.

#### Scenario: Pushover enabled with User Key set
- **WHEN** an admin user has `pushover_alert_enabled` set to true AND a valid Pushover User Key
- **THEN** the system SHALL include that user in matching notification sends

#### Scenario: Pushover disabled
- **WHEN** an admin user has `pushover_alert_enabled` set to false
- **THEN** the system SHALL exclude that user from all Pushover notification sends regardless of per-event toggles

### Requirement: Admin users can opt in or out of specific Pushover event types
The system SHALL store independent boolean preferences for missed checkoff alert and missed checkoff follow-up alert.

#### Scenario: Only missed checkoff enabled
- **WHEN** an admin has only `pushover_missed_checkoff` enabled
- **THEN** the system SHALL send that admin only the 0930 missed checkoff alert
- **AND** the system SHALL NOT send follow-up alerts to that admin

#### Scenario: Only follow-up enabled without initial alert
- **WHEN** an admin has `pushover_missed_checkoff_fup` enabled but `pushover_missed_checkoff` disabled
- **THEN** the system SHALL send that admin only the 1300 follow-up alert
- **AND** the system SHALL NOT send the 0930 initial alert to that admin

### Requirement: Admin Users page manages Pushover preferences
The Admin Users page SHALL allow admins to view, edit, and test Pushover notification preferences for each admin user.

#### Scenario: View Pushover preferences
- **WHEN** an admin views the Users page
- **THEN** the system SHALL display each user's Pushover status (enabled/disabled) and which event types are active

#### Scenario: Edit Pushover preferences
- **WHEN** an admin edits a user's Pushover User Key and event type toggles
- **THEN** the system SHALL persist all changes

#### Scenario: Test Pushover send
- **WHEN** an admin clicks "Test Pushover" for a user with a valid User Key
- **THEN** the system SHALL send a test push notification to that user's Pushover devices
- **AND** the system SHALL bypass quiet hours for the test send
- **AND** the system SHALL display a success or error message

#### Scenario: Test Pushover fails
- **WHEN** an admin clicks "Test Pushover" but the User Key is invalid or Pushover API is unreachable
- **THEN** the system SHALL display an error message
- **AND** the error SHALL be logged to system_logs
