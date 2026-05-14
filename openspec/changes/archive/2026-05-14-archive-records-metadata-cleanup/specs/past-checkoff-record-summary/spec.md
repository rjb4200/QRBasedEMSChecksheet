## MODIFIED Requirements

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

### Requirement: Past records expose archived and status note snapshot fields
Past Checkoff Records SHALL expose daily ledger archived state and status note when those values exist, and archive detail pages SHALL omit empty status-note snapshot fields.

#### Scenario: Historical ledger has archived flag or status note
- **WHEN** a daily ledger row for an archived date includes `archived` or a nonblank `status_note`
- **THEN** archive views and exports SHALL expose those snapshot values

#### Scenario: Historical ledger has no status note
- **WHEN** a daily ledger row has no meaningful status note
- **THEN** archive detail pages SHALL omit the status note field rather than displaying a placeholder such as "No status note"

### Requirement: Records expose saved daily unit comments
Past Checkoff Records SHALL expose saved Daily Unit Comments for the matching unit and date when comments exist, and SHALL omit the comments section when no nonblank comment exists.

#### Scenario: Historical comment exists
- **WHEN** a unit has a saved nonblank Daily Unit Comment for a historical date
- **THEN** records views SHALL display the comment for that unit/day
- **AND** the comment SHALL remain visible even if the unit later changes service status

#### Scenario: Historical comment missing or blank
- **WHEN** no saved nonblank comment exists for a unit/day
- **THEN** records views SHALL NOT render an empty comment section
