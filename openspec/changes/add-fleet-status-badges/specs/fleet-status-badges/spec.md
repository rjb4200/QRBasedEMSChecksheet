## ADDED Requirements

### Requirement: Done before 10AM badge
The system SHALL display a "Done Before 10AM" badge on fleet matrix unit cards when the checkoff was completed before 10:00 AM.

#### Scenario: Check completed early
- **WHEN** a unit's checkoff has a locked_at timestamp before 10:00 AM
- **THEN** a green "Done Before 10AM" badge SHALL be displayed on that unit's fleet card

#### Scenario: Check completed after 10AM
- **WHEN** a unit's checkoff was locked at or after 10:00 AM
- **THEN** no "Done Before 10AM" badge SHALL be displayed

### Requirement: In Progress badge
The system SHALL display an "In Progress" badge on fleet matrix unit cards when the checkoff has been started but not completed.

#### Scenario: Check in progress
- **WHEN** a unit has a checkoff record but no locked_at timestamp
- **THEN** a blue "In Progress" badge SHALL be displayed on that unit's fleet card

#### Scenario: Check completed
- **WHEN** a unit's checkoff has a locked_at timestamp
- **THEN** no "In Progress" badge SHALL be displayed

### Requirement: Current Exceptions badge with count
The system SHALL display a "Current Exceptions" badge with the count of items below par on fleet matrix unit cards.

#### Scenario: Has exceptions
- **WHEN** a unit's checkoff has items where count is less than par
- **THEN** a red badge SHALL be displayed showing the exception count
- **AND** the count SHALL reflect the number of items below par

#### Scenario: No exceptions
- **WHEN** a unit's checkoff has all items at or above par
- **THEN** no "Current Exceptions" badge SHALL be displayed

### Requirement: New Exceptions badge with count
The system SHALL display a "New Exceptions" badge with the count of items below par that were not exceptions in yesterday's check.

#### Scenario: Has new exceptions
- **WHEN** a unit has exceptions today that were not exceptions in yesterday's completed check
- **THEN** an orange/yellow badge SHALL be displayed showing the new exception count

#### Scenario: No new exceptions
- **WHEN** all today's exceptions were also exceptions yesterday
- **THEN** no "New Exceptions" badge SHALL be displayed

#### Scenario: No previous check
- **WHEN** there is no completed check from yesterday
- **THEN** all current exceptions SHALL be considered "new" and show on the badge

### Requirement: Has Comments badge
The system SHALL display a "Has Comments" badge when crew comments were added to the checkoff.

#### Scenario: Comments present
- **WHEN** a unit's checkoff has non-empty comments
- **THEN** a purple "Has Comments" badge SHALL be displayed on that unit's fleet card

#### Scenario: No comments
- **WHEN** a unit's checkoff has no comments or empty comments
- **THEN** no "Has Comments" badge SHALL be displayed