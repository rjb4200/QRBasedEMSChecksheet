## Purpose
Define the Past Checkoff Records view behavior including daily summary counts, historical unit inclusion via ledger records, shift reset ledger writing, fallback behavior when ledgers are missing, archive metadata exposure, print/export branding, and completion count display including crew-name targets.

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
Past Checkoff Records SHALL include operational date and assigned shift, and SHALL expose checked-by user, start time, archive/submission time, and completion duration only when that metadata exists.

#### Scenario: Archive metadata exists
- **WHEN** a unit archive has shift and timing metadata
- **THEN** Past Checkoff Records SHALL expose that metadata for page display, CSV export, and print consumers

#### Scenario: Legacy archive metadata is missing
- **WHEN** a unit archive lacks optional timing or checked-by metadata
- **THEN** Past Checkoff Records SHALL still render the record
- **AND** archive detail pages SHALL omit missing optional metadata fields rather than displaying placeholder values such as "Not recorded"

#### Scenario: Archive creation timestamp is shown on detail page
- **WHEN** an archive detail page displays the timestamp representing archive creation
- **THEN** the timestamp SHALL be labeled "Archived At"

### Requirement: Printable daily check sheets include shift and timing header fields
Printable archived check sheets SHALL include Winchester Fire Department header information and shift-aware timing fields.

#### Scenario: Printing archived daily record
- **WHEN** a user prints an archived daily unit checkoff
- **THEN** the printed output SHALL include unit, operational date, shift, crew, checked by, started time, submitted time, completion duration, all checks, issues/comments, and signature section

### Requirement: Past records expose archived and status note snapshot fields
Past Checkoff Records SHALL expose daily ledger archived state and status note when those values exist, and archive detail pages SHALL omit empty status-note snapshot fields.

#### Scenario: Historical ledger has archived flag or status note
- **WHEN** a daily ledger row for an archived date includes `archived` or a nonblank `status_note`
- **THEN** archive views and exports SHALL expose those snapshot values

#### Scenario: Historical ledger has no status note
- **WHEN** a daily ledger row has no meaningful status note
- **THEN** archive detail pages SHALL omit the status note field rather than displaying a placeholder such as "No status note"

### Requirement: Archive views use daily service snapshots for historical fleet state
Archive views SHALL use `daily_unit_ledgers` as the source of historical unit service and archived state when ledger rows exist for the date.

#### Scenario: Ledger exists for historical date
- **WHEN** daily ledger rows exist for an archived date
- **THEN** archive views SHALL show units, unit status, archived flag, and status note from those ledger rows
- **AND** units archived after that date SHALL still appear according to the historical ledger

### Requirement: Printable check sheets include compact WFD branding
Printable daily check sheets SHALL include compact Winchester Fire Department branding while preserving existing checkoff content.

#### Scenario: Printing current daily check sheets
- **WHEN** a user prints daily check sheets
- **THEN** the print header SHALL include the WFD logo and Winchester Fire Department name
- **AND** the printed title SHALL identify the output as an EMS equipment check sheet
- **AND** existing unit, operational date, shift, crew, timing, check, issue, comment, and signature content SHALL remain unchanged
- **AND** the report SHALL remain readable if branding images fail to load

### Requirement: Archived printouts use same compact WFD branding
Archived or historical printable check sheet outputs SHALL use the same compact WFD print branding as current check sheet print-offs.

#### Scenario: Printing archived daily record
- **WHEN** a user prints or exports an archived daily unit checkoff report
- **THEN** the output SHALL include the WFD logo and Winchester Fire Department name in a compact header
- **AND** historical information SHALL remain the focus of the output
- **AND** no archive behavior or summary logic SHALL change

### Requirement: City seal is secondary in printed reports
The City of Winchester seal SHALL be used only as an optional secondary formal mark in printed outputs.

#### Scenario: City seal is included
- **WHEN** the City of Winchester seal appears in printed check sheets or archive reports
- **THEN** it SHALL appear only as a small footer mark or faint watermark
- **AND** it SHALL NOT replace the WFD logo as the primary print logo
- **AND** it SHALL NOT reduce black-and-white readability

### Requirement: Records expose saved daily unit comments
Past Checkoff Records SHALL expose saved Daily Unit Comments for the matching unit and date when comments exist, and SHALL omit the comments section when no nonblank comment exists.

#### Scenario: Historical comment exists
- **WHEN** a unit has a saved nonblank Daily Unit Comment for a historical date
- **THEN** records views SHALL display the comment for that unit/day
- **AND** the comment SHALL remain visible even if the unit later changes service status

#### Scenario: Historical comment missing or blank
- **WHEN** no saved nonblank comment exists for a unit/day
- **THEN** records views SHALL NOT render an empty comment section

### Requirement: Exports and report outputs include saved daily unit comments
CSV exports, printed checksheets, and daily PDF/email reports SHALL include saved Daily Unit Comments when present and hide blanks.

#### Scenario: Exporting records with comments
- **WHEN** a CSV export includes a unit/day with a saved nonblank Daily Unit Comment
- **THEN** the export SHALL include the comment in a `Comment` or `Comments` column

#### Scenario: Printing or emailing check sheets with comments
- **WHEN** printed checksheets or daily PDF/email reports include a unit with a saved nonblank Daily Unit Comment
- **THEN** the output SHALL render a `Unit Comments` or `Comments` section with the saved text

#### Scenario: Printing or exporting without comments
- **WHEN** a unit has no saved nonblank Daily Unit Comment
- **THEN** printed checksheets, CSV exports, and daily PDF/email reports SHALL omit the comment content rather than rendering an empty section

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

### Requirement: Historical records expose Restocking Lists
Past Checkoff Records SHALL expose a reproducible Restocking List for a unit and date when archived or historical check data contains exceptions.

#### Scenario: Historical record has exceptions
- **WHEN** a historical unit/day record has saved check data with quantity, checkbox, or condition exceptions
- **THEN** records views SHALL display a Restocking List derived from that historical check data
- **AND** the list SHALL preserve source section context for compartments and assigned kits

#### Scenario: Historical record has no exceptions
- **WHEN** a historical unit/day record has no exception data
- **THEN** records views SHALL NOT render an empty Restocking List section

### Requirement: Report outputs include Restocking Lists when present
Printed checksheets, CSV/PDF report outputs, and daily PDF/email reports SHALL include Restocking Lists when unit exceptions exist and SHALL hide them when no exceptions exist.

#### Scenario: Printing or emailing records with exceptions
- **WHEN** a printed checksheet, PDF export, or daily email report includes a unit with exceptions
- **THEN** the output SHALL include a Restocking List for that unit

#### Scenario: Printing or emailing records without exceptions
- **WHEN** a printed checksheet, PDF export, or daily email report includes a unit with no exceptions
- **THEN** the output SHALL omit the Restocking List section for that unit

### Requirement: Previous shift display includes crew-name target
The "Previous shift" section on unit dashboard pages SHALL include the crew-name lock target in the completed and total check counts when displaying archive data.

#### Scenario: Archive has counts without crew target
- **WHEN** a previous shift archive exists with completed and total compartment counts
- **THEN** the unit page display SHALL show completed + (crew locked ? 1 : 0) of total + 1
