## ADDED Requirements

### Requirement: Operational day rolls over at 06:00 department time
The system SHALL assign checkoff activity to the operational date that starts at 06:00 in the department timezone.

#### Scenario: Before rollover
- **WHEN** the current department-local time is 05:59
- **THEN** the operational date SHALL be the previous calendar date

#### Scenario: At rollover
- **WHEN** the current department-local time is 06:00
- **THEN** the operational date SHALL be the current calendar date

### Requirement: Shift calendar stores assigned shift per operational date
The system SHALL maintain a `shift_calendar` record for each operational date with the assigned shift name and shift boundaries.

#### Scenario: Calendar row exists
- **WHEN** an operational date is resolved
- **THEN** the system SHALL be able to read its assigned shift name, start timestamp, and end timestamp from `shift_calendar`

### Requirement: Shift rotation follows 24/48 pattern
The system SHALL assign 1st Shift, 2nd Shift, and 3rd Shift on a repeating 24/48 rotation.

#### Scenario: Reference date rotation
- **WHEN** the operational date is 2026-05-08
- **THEN** the assigned shift SHALL be `1st Shift`

#### Scenario: Following dates rotate
- **WHEN** operational dates follow 2026-05-08
- **THEN** 2026-05-09 SHALL be `2nd Shift`
- **AND** 2026-05-10 SHALL be `3rd Shift`
- **AND** 2026-05-11 SHALL be `1st Shift`

### Requirement: Shift helper returns operational shift context
The system SHALL expose a shift helper that returns operational date, daily period, shift id, shift name, and shift boundaries.

#### Scenario: Current shift context requested
- **WHEN** app code requests the current shift context
- **THEN** the returned data SHALL include operational date and assigned shift metadata suitable for queries and display
