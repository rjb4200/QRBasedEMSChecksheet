## MODIFIED Requirements

### Requirement: Past records denominator uses in-service units for the day
The Past Checkoff Records daily summary denominator SHALL represent required units from the selected date's ledger-backed daily readiness record, excluding units marked not required for that day.

#### Scenario: Ledger exists for date
- **WHEN** daily unit ledger rows exist for a date
- **THEN** the denominator SHALL count ledger rows whose readiness state is checked, incomplete, or not started
- **AND** the denominator SHALL NOT count units whose readiness state is not required

#### Scenario: Ledger missing but check data exists
- **WHEN** no daily unit ledger rows exist for a date
- **AND** checkoff data or unit data is available for that date
- **THEN** the system SHALL build a best-effort daily summary instead of displaying `0/0` solely because the ledger is missing

### Requirement: Ledgers remain authoritative when available
The system SHALL prefer saved daily unit ledgers over reconstructed records when both are available, and SHALL use ledger rows as the authoritative source for historical unit inclusion, service status, and not-required status.

#### Scenario: Ledger and check data both exist
- **WHEN** a date has saved daily unit ledger rows and compartment check rows
- **THEN** Past Checkoff Records SHALL use the ledger rows to determine historical unit inclusion and unit status
- **AND** check rows SHALL enrich ledger rows with completion and exception details rather than deciding which units appear

## ADDED Requirements

### Requirement: Past records distinguish readiness states
Past Checkoff Records SHALL distinguish checked, incomplete, not started, and not required unit readiness states for each unit/day record.

#### Scenario: Daily summary contains multiple states
- **WHEN** a date has units in different readiness states
- **THEN** Past Checkoff Records SHALL expose each unit's readiness state
- **AND** the daily summary SHALL include counts by readiness state

### Requirement: Not required units remain visible outside completion denominator
Past Checkoff Records SHALL keep not required units visible in the historical daily record while excluding them from required-unit completion totals.

#### Scenario: Unit was out of service on selected date
- **WHEN** a ledger row marks a unit out of service for the selected date
- **THEN** the unit SHALL appear in the historical daily record as not required
- **AND** the unit SHALL NOT reduce the checked-over-required completion summary

### Requirement: Records include exception details in historical unit rows
Past Checkoff Records SHALL include date-specific exception details for each unit/day row when exception data exists.

#### Scenario: Exception data exists for unit date
- **WHEN** a unit has failed, missing, or exception check records for a historical date
- **THEN** Past Checkoff Records SHALL expose those exception details on the unit/day row

#### Scenario: Exception data missing for unit date
- **WHEN** a unit has no exception records for the historical date
- **THEN** Past Checkoff Records SHALL show no recorded exceptions without fabricating exception content
