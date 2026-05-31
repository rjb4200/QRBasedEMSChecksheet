## ADDED Requirements

### Requirement: Log rows display a human-readable summary
Each collapsed log row on the system log page SHALL display a human-readable summary sentence generated from the row's data fields instead of requiring expansion to understand what happened.

#### Scenario: Status change shows direction
- **WHEN** a log row has `action = unit.status_changed` with before/after status data
- **THEN** the summary SHALL show the direction of change, e.g., "changed status from in_service to out_of_service"

#### Scenario: Creation shows what was created
- **WHEN** a log row has `action = unit.created`
- **THEN** the summary SHALL indicate a unit was created with the target name

#### Scenario: Generic fallback for unrecognized actions
- **WHEN** a log row has an action without a specific summary handler
- **THEN** the summary SHALL display the actor, action, and target in a readable format

#### Scenario: Message is included when available
- **WHEN** a log row has a non-null `message` field
- **THEN** the summary SHALL include the message text
