## ADDED Requirements

### Requirement: System Log page shows database usage
The System Log page SHALL display current database storage usage as a compact read-only card between the page title and the filter form.

#### Scenario: Usage card visible
- **WHEN** an admin opens the System Log page
- **THEN** a database usage card SHALL appear showing percentage used and MB used/limit on one line
- **AND** a "Last checked" timestamp SHALL appear with date and time

#### Scenario: Color changes by severity
- **WHEN** database usage changes across threshold boundaries
- **THEN** the usage text color SHALL update to reflect the current severity level
- **AND** normal range SHALL use standard text color
- **AND** critical range SHALL use a distinct warning color

#### Scenario: Display is read-only
- **WHEN** the usage card is rendered
- **THEN** no export, delete, clear, or rotation controls SHALL be present
