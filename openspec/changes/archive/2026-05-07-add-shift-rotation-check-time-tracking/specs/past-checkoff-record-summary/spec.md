## ADDED Requirements

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
