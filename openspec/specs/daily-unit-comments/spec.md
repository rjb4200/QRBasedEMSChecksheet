## Requirements

### Requirement: Daily unit comments are saved per unit and shift
The system SHALL save optional Daily Unit Comments by unit, shift date, and shift period.

#### Scenario: Comment is saved for current daily checksheet
- **WHEN** a user saves a nonblank comment from a unit checksheet
- **THEN** the system SHALL store the comment for that unit, current operational date, and shift period
- **AND** the comment SHALL NOT become a permanent unit note

#### Scenario: Unit status changes later
- **WHEN** a unit later goes out of service, returns to service, or is archived
- **THEN** previously saved daily comments SHALL remain associated with the historical unit/date record

### Requirement: Daily unit comment editor appears on unit checksheets
Each unit checksheet SHALL include one optional Daily Unit Comments editor.

#### Scenario: User views unit checksheet
- **WHEN** a user views a unit checksheet
- **THEN** the page SHALL show a `Daily Unit Comments` section after compartments and kits
- **AND** the section SHALL include helper text explaining that only saved comments appear on records and printed checksheets
- **AND** the section SHALL include a multiline text area and save action

### Requirement: Blank comments are not persisted or displayed
The system SHALL trim comments before saving and hide blank comments everywhere except the editable checksheet field.

#### Scenario: Whitespace-only comment is saved
- **WHEN** a user saves a comment that is empty or contains only whitespace
- **THEN** the system SHALL clear the saved daily unit comment for that unit and shift
- **AND** the comment SHALL NOT appear in Fleet Panel, records, printed checksheets, CSV exports, or daily PDF/email reports

#### Scenario: Existing comment is cleared
- **WHEN** a user clears a previously saved comment
- **THEN** the system SHALL remove or blank the saved comment so downstream surfaces treat it as absent

### Requirement: Daily unit comments support bounded multiline text
The system SHALL support multiline Daily Unit Comments within a reasonable length limit.

#### Scenario: Multiline comment is saved
- **WHEN** a user saves a multiline comment within the configured length limit
- **THEN** line breaks SHALL be preserved for records and print/report display

#### Scenario: Comment exceeds length limit
- **WHEN** a user tries to save a comment longer than the configured limit
- **THEN** the system SHALL reject or truncate the comment consistently before persistence
- **AND** the limit SHALL be no greater than 2,000 characters

### Requirement: Unit checksheets display Restocking List below Unit Comments
Unit checksheets SHALL display a Restocking List below the Daily Unit Comments section when current unit exceptions exist.

#### Scenario: Unit checksheet has exceptions
- **WHEN** a user views a unit checksheet with one or more current exceptions
- **THEN** the page SHALL show a `Restocking List` section below `Daily Unit Comments`
- **AND** the section SHALL list deficiencies grouped by compartment or assigned kit source name

#### Scenario: Unit checksheet has no exceptions
- **WHEN** a user views a unit checksheet with no current exceptions
- **THEN** the page SHALL NOT display a Restocking List section

#### Scenario: Unit comments are empty but exceptions exist
- **WHEN** the unit has no saved Daily Unit Comments but has current exceptions
- **THEN** the Restocking List SHALL still display below the comment editor area
