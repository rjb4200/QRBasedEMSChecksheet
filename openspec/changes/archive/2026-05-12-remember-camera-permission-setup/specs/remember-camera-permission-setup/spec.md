## ADDED Requirements

### Requirement: Skip permission button on repeat visits
After a user successfully starts the built-in scanner once, the app SHALL skip the in-app "Request Camera Permissions" button on subsequent visits.

#### Scenario: First visit
- **WHEN** a user opens the scanner for the first time
- **THEN** the permission button SHALL be displayed

#### Scenario: Repeat visit after success
- **WHEN** a user opens the scanner after previously starting it successfully
- **THEN** the app SHALL skip the in-app permission button
- **AND** attempt to start the scanner directly
