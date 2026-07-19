## Purpose
The daily readiness ledger records provide a date-focused view of unit readiness, showing check status, crew information, comments, and exceptions for each unit on a selected operational date.

## Requirements

### Requirement: Records page is selected-date first
The Records page SHALL present a selected operational date as the primary filter and SHALL render that date's daily readiness ledger as the primary content.

#### Scenario: User opens Records without a date
- **WHEN** a supervisor opens the Records page without a selected date
- **THEN** the system SHALL select the current operational date by default
- **AND** the page SHALL show the daily readiness ledger for that date

#### Scenario: User selects a historical date
- **WHEN** a supervisor selects a historical date
- **THEN** the Records page SHALL show unit readiness records for only that selected date

### Requirement: Records list all relevant units for the selected date
The Records page SHALL list every unit that was active or out of service for the selected date when daily ledger rows exist for that date.

#### Scenario: Ledger exists for selected date
- **WHEN** daily unit ledger rows exist for the selected date
- **THEN** the Records page SHALL render one unit row for each ledger row for that date
- **AND** units SHALL appear even when they were not checked or were not required

#### Scenario: Unit later changes service status
- **WHEN** a unit's current service status differs from the selected date's ledger status
- **THEN** the Records page SHALL display the selected date's ledger status
- **AND** the current service status SHALL NOT determine whether the unit appears

### Requirement: Records show readiness state for each unit
The Records page SHALL classify each unit row as checked, incomplete, not started, or not required for the selected date.

#### Scenario: Unit is checked
- **WHEN** a required unit has date-specific completion evidence above the complete threshold
- **THEN** the unit row SHALL show a checked readiness state

#### Scenario: Unit is incomplete
- **WHEN** a required unit has date-specific activity but does not meet the complete threshold
- **THEN** the unit row SHALL show an incomplete readiness state

#### Scenario: Unit is not started
- **WHEN** a required unit has no date-specific checkoff, crew lock, archive, or activity evidence
- **THEN** the unit row SHALL show a not started readiness state

#### Scenario: Unit is not required
- **WHEN** a unit was out of service, archived for that date, or otherwise not required for daily checks
- **THEN** the unit row SHALL show a not required readiness state

### Requirement: Records include daily crew names and comments
The Records page SHALL display saved crew names and saved Daily Unit Comments for the matching unit, selected date, and shift period when they exist.

#### Scenario: Crew and comment exist
- **WHEN** a unit has saved crew names and a nonblank Daily Unit Comment for the selected date
- **THEN** the unit row SHALL display the crew names and comment

#### Scenario: Crew or comment missing
- **WHEN** a unit has no saved crew names or no nonblank Daily Unit Comment for the selected date
- **THEN** the unit row SHALL show the missing value as not recorded or omit the empty comment content

### Requirement: Records include exceptions for each unit
The Records page SHALL display date-specific exceptions for each unit in the selected date's daily readiness ledger.

#### Scenario: Unit has exceptions
- **WHEN** a unit has failed, missing, or exception check records for the selected date
- **THEN** the unit row SHALL expose those exceptions in the Records page

#### Scenario: Unit has no exceptions
- **WHEN** a unit has no date-specific exception records
- **THEN** the unit row SHALL show that no exceptions were recorded without creating placeholder exception details

### Requirement: Records expose daily ledger totals by readiness state
The Records page SHALL summarize the selected date by readiness state counts rather than only showing completed in-service units over total in-service units.

#### Scenario: Selected date has mixed readiness states
- **WHEN** the selected date includes checked, incomplete, not started, and not required units
- **THEN** the Records page SHALL show counts for each readiness state
- **AND** the page SHALL still make the total number of ledger units visible

### Requirement: Readiness summary appears with selected-date unit records
The Records page SHALL display the selected operational date, followed by the readiness-state summary, followed by the selected date's unit record cards.

#### Scenario: Admin views selected-date records
- **WHEN** an admin opens the Records page for a selected operational date
- **THEN** the selected date SHALL appear above the readiness summary
- **AND** the readiness summary SHALL appear above the unit record cards

#### Scenario: Admin filters records to one unit
- **WHEN** an admin applies a unit filter for the selected operational date
- **THEN** the readiness summary and unit record cards SHALL both reflect that selected unit and date

### Requirement: Records handle missing ledger coverage explicitly
The Records page SHALL distinguish a complete ledger-backed daily record from a best-effort reconstructed record.

#### Scenario: No ledger exists for selected date
- **WHEN** no daily unit ledger rows exist for the selected date
- **THEN** the Records page SHALL build a best-effort record only from date-specific historical data
- **AND** the page SHALL indicate that full daily ledger coverage is unavailable for that date

### Requirement: Records identify authoritative completion status
The Records page SHALL identify whether the selected date's completion result is live, finalized, or reconstructed and SHALL expose action-progress and fully complete-unit counts from the daily completion summary.

#### Scenario: Selected date has a finalized summary
- **WHEN** an administrator views a date with a finalized daily completion summary
- **THEN** the Records page SHALL display finalized action-progress and fully complete-unit counts

#### Scenario: Selected date has reconstructed history
- **WHEN** an administrator views a date whose summary was reconstructed from pre-cutover raw records
- **THEN** the Records page SHALL label the completion result as reconstructed

### Requirement: Check status timestamp shows time only
The system SHALL display only the time portion of the submission timestamp under the Check Status column for checked units, omitting the date which is already present in the page header.

#### Scenario: Checked unit with submission time
- **WHEN** a unit is in checked status and has a submission timestamp
- **THEN** the Check Status display SHALL show only the time (e.g., "2:30:00 PM") without the date

#### Scenario: Checked unit without submission time
- **WHEN** a unit is in checked status but has no submission timestamp
- **THEN** the Check Status display SHALL show "Not recorded"
