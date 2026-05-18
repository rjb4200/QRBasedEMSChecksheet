## MODIFIED Requirements

### Requirement: Comments display conditionally on unit page
The system SHALL display saved unit comments separately from Section Comments and the Restocking List when comments have been entered, and the unit page SHALL NOT reserve layout space for removed previous-shift summary sections. A deferred previous-exceptions panel MAY appear after initial render as an asynchronous background check.

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
- **AND** the page SHALL NOT block initial render on historical archive queries
- **AND** Daily Unit Comments, Section Comments, and Restocking List content SHALL remain available according to their own visibility rules
- **AND** a deferred previous-exceptions panel MAY load asynchronously after initial render without blocking the page
