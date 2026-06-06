## ADDED Requirements

### Requirement: Admin users can opt in or out of weekly issues digest
The system SHALL store a `receives_weekly_issues_digest` boolean per admin user, defaulting to true, controlling whether they receive the weekly issues digest email.

#### Scenario: User record stores weekly digest preference
- **WHEN** an admin user is created or updated
- **THEN** the `receives_weekly_issues_digest` preference SHALL be persisted

#### Scenario: Admin Users page shows weekly digest toggle
- **WHEN** an admin views or edits a user on the Admin Users page
- **THEN** a "Weekly issues digest" checkbox SHALL be displayed alongside the daily report checkbox
