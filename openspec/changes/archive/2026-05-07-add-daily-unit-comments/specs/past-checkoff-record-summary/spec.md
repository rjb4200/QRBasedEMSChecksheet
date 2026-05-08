## ADDED Requirements

### Requirement: Records expose saved daily unit comments
Past Checkoff Records SHALL expose saved Daily Unit Comments for the matching unit and date when comments exist.

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
