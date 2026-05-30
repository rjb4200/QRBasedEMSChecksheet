## MODIFIED Requirements

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
