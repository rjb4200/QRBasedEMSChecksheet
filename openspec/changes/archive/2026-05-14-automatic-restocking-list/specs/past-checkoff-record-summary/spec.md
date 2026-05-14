## ADDED Requirements

### Requirement: Historical records expose Restocking Lists
Past Checkoff Records SHALL expose a reproducible Restocking List for a unit and date when archived or historical check data contains exceptions.

#### Scenario: Historical record has exceptions
- **WHEN** a historical unit/day record has saved check data with quantity, checkbox, or condition exceptions
- **THEN** records views SHALL display a Restocking List derived from that historical check data
- **AND** the list SHALL preserve source section context for compartments and assigned kits

#### Scenario: Historical record has no exceptions
- **WHEN** a historical unit/day record has no exception data
- **THEN** records views SHALL NOT render an empty Restocking List section

### Requirement: Report outputs include Restocking Lists when present
Printed checksheets, CSV/PDF report outputs, and daily PDF/email reports SHALL include Restocking Lists when unit exceptions exist and SHALL hide them when no exceptions exist.

#### Scenario: Printing or emailing records with exceptions
- **WHEN** a printed checksheet, PDF export, or daily email report includes a unit with exceptions
- **THEN** the output SHALL include a Restocking List for that unit

#### Scenario: Printing or emailing records without exceptions
- **WHEN** a printed checksheet, PDF export, or daily email report includes a unit with no exceptions
- **THEN** the output SHALL omit the Restocking List section for that unit
