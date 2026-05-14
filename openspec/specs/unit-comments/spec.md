## Requirements

### Requirement: Crew can add comments to daily checkoff
The system SHALL allow crews to add text comments to their daily unit checkoff. Comments MUST be stored with the daily unit record and included in the daily ledger snapshot.

#### Scenario: Crew adds comments during checkoff
- **WHEN** a crew member enters text in the comments field on the unit checkoff page
- **THEN** the comments SHALL be saved to the daily_units table
- **AND** the comments SHALL appear in subsequent viewing of that day's checkoff

#### Scenario: Crew leaves comments blank
- **WHEN** a crew member does not enter any text in the comments field
- **THEN** no comments data SHALL be stored for that day's checkoff

### Requirement: Comments display conditionally on unit page
The system SHALL display saved unit comments separately from Section Comments and the Restocking List when comments have been entered, and the unit page SHALL NOT reserve layout space for removed previous-shift summary sections.

#### Scenario: Display when comments exist
- **WHEN** a user views a unit page that has comments stored
- **THEN** the comments section SHALL be displayed
- **AND** the comments text SHALL be visible

#### Scenario: Hide when no comments exist
- **WHEN** a user views a unit page that has no comments stored
- **THEN** the page layout SHALL NOT show an empty saved-comments display section

#### Scenario: Previous-shift summaries are removed
- **WHEN** a user views the unit checkoff page
- **THEN** the page SHALL NOT display an "Exceptions for past check" section
- **AND** the page SHALL NOT display a "Previous shift" section
- **AND** Daily Unit Comments, Section Comments, and Restocking List content SHALL remain available according to their own visibility rules

### Requirement: Comments appear in records view
The system SHALL display comments in the supervisor records view when comments exist for the selected date range.

#### Scenario: Records view shows comments
- **WHEN** a supervisor views the records page for a date with units that have comments
- **THEN** the comments SHALL be visible in the unit details within the records view

#### Scenario: Records view hides empty comments
- **WHEN** a supervisor views the records page for a date with units that have no comments
- **THEN** no empty comments sections SHALL be displayed

### Requirement: Comments included in print output
The system SHALL include comments in the check sheet print output only when comments have been entered.

#### Scenario: Print includes comments when present
- **WHEN** a user generates a printout for a unit that has comments
- **THEN** the comments SHALL appear in the printed document

#### Scenario: Print excludes comments when blank
- **WHEN** a user generates a printout for a unit that has no comments
- **THEN** no comments section SHALL appear in the printed document

### Requirement: Unit page displays section comments alongside unit comment
The unit dashboard page SHALL display a merged Section Comments block when section comments exist, appearing alongside but separate from the existing unit-level comment field.

#### Scenario: Both unit and section comments exist
- **WHEN** a unit has both a unit-level comment and section comments for the current shift
- **THEN** the unit page SHALL display both sections separately
- **AND** section comments SHALL NOT be appended into the unit-level comment textarea

#### Scenario: Only section comments exist
- **WHEN** a unit has section comments but no unit-level comment for the current shift
- **THEN** the unit page SHALL display the Section Comments block
- **AND** the unit-level comment section SHALL be hidden or show its empty state
