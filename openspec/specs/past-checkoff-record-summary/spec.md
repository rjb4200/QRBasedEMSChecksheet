## Requirements

### Requirement: Past records count units over 95 percent as complete
The Past Checkoff Records daily summary SHALL count an in-service unit as complete when its completion percentage is greater than 95 percent.

#### Scenario: Unit over threshold
- **WHEN** an in-service unit has a completion percentage greater than 95 for a day
- **THEN** the daily summary completed-unit numerator SHALL include that unit

#### Scenario: Unit at or below threshold
- **WHEN** an in-service unit has a completion percentage less than or equal to 95 for a day
- **THEN** the daily summary completed-unit numerator SHALL NOT include that unit

### Requirement: Past records denominator uses in-service units for the day
The Past Checkoff Records daily summary denominator SHALL represent units that were in service for the record date.

#### Scenario: Ledger exists for date
- **WHEN** daily unit ledger rows exist for a date
- **THEN** the denominator SHALL count ledger rows with `unit_status` equal to `in_service`

#### Scenario: Ledger missing but check data exists
- **WHEN** no daily unit ledger rows exist for a date
- **AND** checkoff data or unit data is available for that date
- **THEN** the system SHALL build a best-effort daily summary instead of displaying `0/0` solely because the ledger is missing

### Requirement: Ledgers remain authoritative when available
The system SHALL prefer saved daily unit ledgers over reconstructed records when both are available.

#### Scenario: Ledger and check data both exist
- **WHEN** a date has saved daily unit ledger rows and compartment check rows
- **THEN** Past Checkoff Records SHALL use the ledger rows to determine historical unit inclusion and unit status

### Requirement: Historical target totals include all daily check targets
The system SHALL calculate historical completion percentages using compartments, assigned kits, and the crew-name lock target.

#### Scenario: Unit has compartments and kits
- **WHEN** a unit has compartments, assigned kits, and crew-name completion for a day
- **THEN** the total target count SHALL equal compartments plus assigned kits plus one crew-name target

### Requirement: Shift reset writes usable daily ledger rows
The shift reset process SHALL write daily unit ledger rows for the day being closed so future Past Checkoff Records have historical unit context.

#### Scenario: Shift reset closes a day
- **WHEN** the shift reset process runs for the previous daily checkoff date
- **THEN** the system SHALL save one ledger row for each non-deleted unit included in that day's fleet context
- **AND** each row SHALL include the unit status and total daily target count for that day
