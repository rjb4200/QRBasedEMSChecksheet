## Requirements

### Requirement: Fleet Panel includes a collapsed Recent Comments section
The Fleet Panel SHALL include a compact Recent Comments section between the daily checksheet print bar and the Exceptions section, showing a preview of the three most recent comments before expansion.

#### Scenario: Section is compact by default
- **WHEN** the Fleet Panel loads
- **THEN** the Recent Comments section SHALL be compact by default
- **AND** it SHALL display up to the three most recent comments

### Requirement: Comments lazy-load when section is expanded
The Recent Comments section SHALL fetch and display section comments from the last 10 rolling days when expanded by the user.

#### Scenario: Section expands and loads comments
- **WHEN** the user expands the Recent Comments section
- **THEN** the system SHALL fetch section comments from the last 10 days
- **AND** display a loading indicator while fetching

### Requirement: Comments display with unit, source, date, and text
Each comment row SHALL display the unit name, source compartment or kit name, relative date/time, comment text, and a crew/provider name tag when crew names are available for the matching unit, shift date, and shift period, ordered newest first.

#### Scenario: Comment rows render with crew tags
- **WHEN** comments are loaded and matching crew names exist
- **THEN** each matching comment SHALL show the unit name, source name, date/time, comment text, and crew/provider name tag
- **AND** comments SHALL be ordered newest first

#### Scenario: Comment row has no matching crew names
- **WHEN** a comment is loaded and no matching crew names exist
- **THEN** the comment SHALL still show the unit name, source name, date/time, and comment text
- **AND** the comment SHALL NOT show an empty crew tag

### Requirement: Empty state when no comments exist
The Recent Comments section SHALL display an empty state when no section comments exist for the active display mode.

#### Scenario: No compact preview comments
- **WHEN** the Fleet Panel loads and no comments are available for compact preview
- **THEN** the section SHALL display a compact empty state

#### Scenario: No expanded recent comments
- **WHEN** the section is expanded and no comments exist in the last 10 days
- **THEN** the section SHALL display "No comments in the last 10 days."

### Requirement: Results limited to 50
The Recent Comments section SHALL limit expanded results to 50 most recent comments.

#### Scenario: Limited expanded results
- **WHEN** the section is expanded
- **THEN** at most 50 comments SHALL be displayed
