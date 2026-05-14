## ADDED Requirements

### Requirement: Compartment checkoff pages include optional comment field
The system SHALL include an optional comment textarea on compartment checkoff pages. The comment SHALL be saved to `daily_section_comments` and SHALL NOT affect checkoff completion status.

#### Scenario: User submits compartment with comment
- **WHEN** a crew member submits a compartment checkoff with a nonblank comment
- **THEN** the comment SHALL be saved with source_type `compartment` and the compartment's ID and name

#### Scenario: User submits compartment without comment
- **WHEN** a crew member submits a compartment checkoff with a blank comment
- **THEN** no section comment row SHALL be created for that compartment

#### Scenario: User resubmits compartment with changed comment
- **WHEN** a crew member resubmits a compartment checkoff with a different comment
- **THEN** the existing section comment SHALL be updated rather than duplicated

### Requirement: Kit checkoff pages include optional comment field
The system SHALL include an optional comment textarea on assigned-kit checkoff pages. The comment SHALL be saved to `daily_section_comments` and SHALL NOT affect checkoff completion status.

#### Scenario: User submits kit with comment
- **WHEN** a crew member submits a kit checkoff with a nonblank comment
- **THEN** the comment SHALL be saved with source_type `kit` and the unit-kit assignment ID and kit name

#### Scenario: User clears existing comment on resubmit
- **WHEN** a crew member submits a kit checkoff with a blank comment and a previous comment existed
- **THEN** the existing section comment SHALL be removed

### Requirement: Section comments stored with source metadata
The system SHALL store each section comment in `daily_section_comments` with unit ID, shift date, shift period, source type, source ID, source name, and comment text. Rows SHALL be unique per unit/date/period/type/source.

#### Scenario: Comment is persisted
- **WHEN** a section comment is saved
- **THEN** the row SHALL include `unit_id`, `shift_date`, `shift_period`, `source_type`, `source_id`, `source_name`, and `comment`

### Requirement: Unit page displays merged section comments
The system SHALL display all section comments for a unit, date, and shift period on the unit dashboard page, each labeled with its source section name.

#### Scenario: Multiple section comments exist
- **WHEN** a unit has section comments from different compartments and kits for the current shift
- **THEN** the unit page SHALL show a "Section Comments" block with each comment labeled by source name

#### Scenario: No section comments exist
- **WHEN** a unit has no section comments for the current shift
- **THEN** the unit page SHALL NOT display the Section Comments block

### Requirement: Section comments do not affect checkoff completion
The system SHALL NOT include section comments in completion percentage calculations or require a comment to submit a checkoff.

#### Scenario: Submission without comment
- **WHEN** a crew member submits a checkoff without entering a comment
- **THEN** the submission SHALL succeed and completion SHALL be calculated normally
