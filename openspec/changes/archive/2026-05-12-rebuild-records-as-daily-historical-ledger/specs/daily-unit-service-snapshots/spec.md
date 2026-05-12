## ADDED Requirements

### Requirement: Daily ledgers cover all date-relevant units for Records
The system SHALL save daily unit ledger rows for every unit that was active or out of service for the operational date so Records can render the complete historical readiness ledger.

#### Scenario: Shift reset closes an operational date
- **WHEN** shift reset creates daily ledger rows for the operational date being closed
- **THEN** it SHALL include every non-deleted unit that was active or out of service for that date
- **AND** each row SHALL preserve the unit name, service status, target count, archived state, and status note for that date

#### Scenario: Unit is out of service for the operational date
- **WHEN** a unit is out of service during the operational date
- **THEN** the daily ledger SHALL include the unit so Records can display it as not required rather than missing

### Requirement: Daily ledgers support readiness classification
Daily unit ledger rows SHALL provide enough snapshot data for Records to determine whether a unit was required or not required for the date before applying checkoff completion data.

#### Scenario: Ledger row marks unit not required
- **WHEN** a ledger row identifies a unit as out of service or archived for the date
- **THEN** Records SHALL be able to classify that unit as not required without relying on current unit state

#### Scenario: Ledger row marks unit required
- **WHEN** a ledger row identifies a unit as active and required for the date
- **THEN** Records SHALL be able to classify the unit as checked, incomplete, or not started using date-specific checkoff evidence

### Requirement: Daily ledger snapshots remain date-scoped
Daily unit ledger data used by Records SHALL remain scoped to the operational date and shift period of the historical record.

#### Scenario: Same unit has later state changes
- **WHEN** a unit changes service status after a ledger row is saved
- **THEN** the saved ledger row SHALL continue to represent the unit's status for its original operational date and shift period
