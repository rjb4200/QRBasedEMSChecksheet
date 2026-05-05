## ADDED Requirements

### Requirement: Default values from recent completed check
The system SHALL populate compartment check values from the most recent completed check within the last 7 days when starting a new daily checkoff.

#### Scenario: Use previous check values when available
- **WHEN** a crew begins a new checkoff for a unit that has a completed check within the last 7 days
- **THEN** the compartment item values SHALL be populated from that previous check
- **AND** the checkbox states SHALL reflect the previous check's states

#### Scenario: Fall back to par when no recent check
- **WHEN** a crew begins a new checkoff for a unit with no completed checks within the last 7 days
- **THEN** the compartment item values SHALL default to par values

#### Scenario: New unit with no history
- **WHEN** a crew begins a checkoff for a newly created unit with no previous checks
- **THEN** the compartment item values SHALL default to par values

### Requirement: Completed check identification
The system SHALL identify a completed check by a locked crew record.

#### Scenario: Check with locked crew is completed
- **WHEN** a daily_unit_crews record has `locked` set to true
- **THEN** that check SHALL be considered completed

#### Scenario: Check without lock is not completed
- **WHEN** a daily_unit_crews record has `locked` set to false
- **THEN** that check SHALL NOT be considered for default value population

### Requirement: Most recent check selected
The system SHALL select the most recent completed check when multiple exist within the 7-day window.

#### Scenario: Multiple checks in last 7 days
- **WHEN** multiple completed checks exist within the last 7 days
- **THEN** the system SHALL use the most recent one by crew record update time

### Requirement: Checkbox default behavior preserved
The system SHALL maintain the default checkbox state (checked) for all items regardless of default value source.

#### Scenario: Checkboxes default to checked
- **WHEN** compartment items are loaded with default values from previous check or par
- **THEN** all checkbox inputs SHALL default to checked state
