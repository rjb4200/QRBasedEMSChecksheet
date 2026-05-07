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

### Requirement: Fallback excludes units without historical records
The system SHALL NOT include units in historical summaries solely because they are currently in service.

#### Scenario: Ledger missing, current units have check data
- **WHEN** no daily unit ledger rows exist for a date
- **AND** current in-service units have compartment_check rows for that date
- **THEN** the daily summary SHALL include only those units that have check or archive rows for that specific date
- **AND** the daily summary SHALL NOT include units that have no historical data for that date

### Requirement: Use unknown status when historical status unavailable
The system SHALL mark unit status as "unknown" when historical status cannot be determined.

#### Scenario: Unit has checks but no ledger or archive
- **WHEN** a unit has compartment_check rows for a date but no ledger or archive rows
- **THEN** the unit status SHALL be marked as "unknown"
- **AND** the unit SHALL NOT count toward in-service totals

### Requirement: Only date-specific records build fallback summaries
The system SHALL build fallback summaries only from records that exist for the specific date.

#### Scenario: Building fallback for missing-ledger date
- **WHEN** no daily_unit_ledgers exist for a date
- **THEN** the system SHALL collect units from compartment_checks, shift_archives, and daily_unit_crews for ONLY that date
- **AND** the system SHALL NOT iterate over all current units

### Requirement: Past records include shift-aware archive metadata
Past Checkoff Records SHALL include operational date, assigned shift, checked-by user, start time, submission time, and completion duration when that metadata exists.

#### Scenario: Archive metadata exists
- **WHEN** a unit archive has shift and timing metadata
- **THEN** Past Checkoff Records SHALL expose that metadata for page display, CSV export, and print consumers

#### Scenario: Legacy archive metadata is missing
- **WHEN** a unit archive lacks shift or timing metadata
- **THEN** Past Checkoff Records SHALL still render the record
- **AND** missing metadata SHALL be displayed as blank or not recorded rather than fabricated

### Requirement: Printable daily check sheets include shift and timing header fields
Printable archived check sheets SHALL include Winchester Fire Department header information and shift-aware timing fields.

#### Scenario: Printing archived daily record
- **WHEN** a user prints an archived daily unit checkoff
- **THEN** the printed output SHALL include unit, operational date, shift, crew, checked by, started time, submitted time, completion duration, all checks, issues/comments, and signature section

### Requirement: Past records expose archived and status note snapshot fields
Past Checkoff Records SHALL expose daily ledger archived state and status note when those values exist.

#### Scenario: Historical ledger has archived flag or status note
- **WHEN** a daily ledger row for an archived date includes `archived` or `status_note`
- **THEN** archive views and exports SHALL expose those snapshot values

### Requirement: Archive views use daily service snapshots for historical fleet state
Archive views SHALL use `daily_unit_ledgers` as the source of historical unit service and archived state when ledger rows exist for the date.

#### Scenario: Ledger exists for historical date
- **WHEN** daily ledger rows exist for an archived date
- **THEN** archive views SHALL show units, unit status, archived flag, and status note from those ledger rows
- **AND** units archived after that date SHALL still appear according to the historical ledger
