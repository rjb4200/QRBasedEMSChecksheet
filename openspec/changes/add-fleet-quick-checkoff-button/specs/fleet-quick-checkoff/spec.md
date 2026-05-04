## ADDED Requirements

### Requirement: Fleet matrix displays checkoff button
The system SHALL display a "View Checkoff" button on each unit card within the admin fleet matrix page.

#### Scenario: Button visible on all unit cards
- **WHEN** an admin user views the fleet matrix page
- **THEN** each unit card SHALL display a "View Checkoff" button

#### Scenario: Button present regardless of completion status
- **WHEN** a unit is in any state (not started, in progress, completed)
- **THEN** the "View Checkoff" button SHALL still be visible on the unit card

### Requirement: Button navigates to checkoff page
The system SHALL navigate to the unit's daily checkoff page when the "View Checkoff" button is clicked.

#### Scenario: Navigation to checkoff page
- **WHEN** an admin user clicks the "View Checkoff" button on a unit card
- **THEN** the browser SHALL navigate to the `/units/{unitId}` page
- **AND** the daily checkoff page SHALL display with current crew progress

#### Scenario: Correct unit loaded
- **WHEN** an admin user clicks "View Checkoff" on a specific unit
- **THEN** the checkoff page SHALL load the correct unit's data
- **AND** the URL SHALL reflect the correct unit ID