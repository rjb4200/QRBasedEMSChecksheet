## ADDED Requirements

### Requirement: Check target start time is preserved
The system SHALL store when a check target is first started using a server timestamp.

#### Scenario: New check target row is created
- **WHEN** a user begins or saves a check target for the first time
- **THEN** the system SHALL set `started_at` using server time

#### Scenario: Existing check target is updated
- **WHEN** a user returns to an existing check target and saves again
- **THEN** the system SHALL NOT overwrite the original `started_at`

### Requirement: Check target activity and submission times are tracked
The system SHALL update activity time on every save and submission time when a target is completed.

#### Scenario: Check target is saved
- **WHEN** a user saves check data
- **THEN** `last_activity_at` SHALL update to server time

#### Scenario: Check target is submitted
- **WHEN** a user submits a completed check target
- **THEN** `submitted_at` SHALL be set to server time
- **AND** target completion duration SHALL be calculated when `started_at` is available

### Requirement: Shift archives preserve unit-level timing metadata
The system SHALL write unit-level archive timing metadata when a daily shift is archived.

#### Scenario: Unit archive is created
- **WHEN** shift reset archives an in-service unit
- **THEN** `started_at` SHALL be the earliest required target start time for that unit
- **AND** `submitted_at` SHALL be the latest required target submission time for that unit
- **AND** `time_to_complete_seconds` SHALL be the elapsed duration between those timestamps when both exist

### Requirement: Check submitter is preserved
The system SHALL preserve the user who submitted a completed check target or unit archive when that user is known.

#### Scenario: Authenticated user submits check
- **WHEN** an authenticated user submits a check target
- **THEN** the check record SHALL store that user in `checked_by`

#### Scenario: Submitter unavailable
- **WHEN** no submitter can be determined
- **THEN** the system SHALL allow `checked_by` to remain null without blocking submission
