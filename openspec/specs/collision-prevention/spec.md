## ADDED Requirements

### Requirement: Compartment status shows Grey, Yellow, or Green
Each compartment SHALL display one of three statuses: Grey (not started), Yellow (in-progress by another user), or Green (completed).

#### Scenario: New compartment shows Grey
- **WHEN** no checkoff has been started for a compartment in the current shift
- **THEN** the compartment displays as Grey (not started)

#### Scenario: Active checkoff shows Yellow
- **WHEN** a user has opened a compartment form but not yet submitted
- **THEN** the compartment displays as Yellow (in-progress)

#### Scenario: Completed checkoff shows Green
- **WHEN** a user has submitted a compartment checkoff form
- **THEN** the compartment displays as Green (completed)

### Requirement: Status determined by database row check on page load

The system SHALL determine compartment status by checking the `compartment_checks` table when the page loads, without real-time subscriptions. The page-load auto-create of in-progress rows SHALL use atomic `.upsert()` with `onConflict`.

#### Scenario: Page load checks database for status

- **WHEN** user navigates to the unit dashboard
- **THEN** each compartment's status is determined by querying the database

#### Scenario: Page-load auto-create uses upsert

- **WHEN** a page-load creates an initial in-progress checkoff row
- **THEN** the operation SHALL use `.upsert()` with `onConflict` targeting the unique index, not a separate SELECT followed by INSERT

### Requirement: Locked notice when another user has compartment open
When a user scans a QR code for a compartment that is already in-progress by another user, the system SHALL display a locked notice with the other user's identity.

#### Scenario: User scans compartment owned by another
- **WHEN** user scans QR for a compartment where another user has an in-progress checkoff
- **THEN** a notice is displayed showing "In progress by [Provider Name]"

### Requirement: View Only mode allows viewing another user's progress
The locked notice SHALL include a "View Only" option that allows the scanning user to see the other user's entered data without editing.

#### Scenario: View Only displays existing data
- **WHEN** user selects "View Only" on a locked compartment
- **THEN** the form displays with all entered data in read-only mode

### Requirement: Take Over silently transfers ownership
The locked notice SHALL include a "Take Over" option that transfers the compartment checkoff ownership to the current user without notifying the previous owner.

#### Scenario: Take Over transfers ownership
- **WHEN** user selects "Take Over" on a locked compartment
- **THEN** the compartment ownership is transferred to the current user and the form loads with the previous user's entered data

#### Scenario: Previous owner not notified
- **WHEN** user takes over a compartment from another user
- **THEN** no notification is sent to the previous owner

### Requirement: Stale lock timeout releases ownership
If a compartment has been in-progress for more than 30 minutes without activity, the lock SHALL be automatically released.

#### Scenario: Stale lock is released
- **WHEN** a compartment has been in-progress for 30+ minutes without save activity
- **THEN** the next user who scans the QR code can start a fresh checkoff
