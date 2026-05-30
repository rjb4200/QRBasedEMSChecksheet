## ADDED Requirements

### Requirement: Admin sees eligible deletion date availability
The system SHALL display the oldest and newest eligible operational record dates in the DELETE Records section before the admin previews deletion counts.

#### Scenario: Eligible records exist
- **WHEN** an admin views the Records page and historical operational records exist before today's shift date
- **THEN** the DELETE Records section SHALL display the available eligible deletion date range

#### Scenario: No eligible records exist
- **WHEN** an admin views the Records page and no historical operational records exist before today's shift date
- **THEN** the DELETE Records section SHALL indicate that no eligible records are currently available for deletion

### Requirement: Delete range defaults to oldest eligible records
The system SHALL default the DELETE Records date range to the oldest eligible operational records, capped by the existing maximum deletion range and today's exclusion rule.

#### Scenario: Oldest eligible range is less than maximum range
- **WHEN** eligible operational records exist and the newest eligible date is within 60 days of the oldest eligible date
- **THEN** the default DELETE Records from date SHALL equal the oldest eligible date
- **AND** the default DELETE Records to date SHALL equal the newest eligible date

#### Scenario: Oldest eligible range exceeds maximum range
- **WHEN** eligible operational records exist and the newest eligible date is more than 60 days after the oldest eligible date
- **THEN** the default DELETE Records from date SHALL equal the oldest eligible date
- **AND** the default DELETE Records to date SHALL be no more than 60 days after the oldest eligible date

#### Scenario: Today's records exist
- **WHEN** operational records exist for today's shift date
- **THEN** today's shift date SHALL NOT be used as the default DELETE Records to date

### Requirement: Exact delete counts remain preview-gated
The system SHALL continue to require the admin to request a preview before displaying exact per-table deletion counts for the selected range.

#### Scenario: Admin has not previewed the range
- **WHEN** the DELETE Records section displays eligible date availability
- **THEN** the system SHALL NOT present exact per-table deletion counts until the admin requests a preview

#### Scenario: Admin previews selected range
- **WHEN** the admin requests a preview for the selected DELETE Records date range
- **THEN** the system SHALL display exact per-table row counts for that selected range
