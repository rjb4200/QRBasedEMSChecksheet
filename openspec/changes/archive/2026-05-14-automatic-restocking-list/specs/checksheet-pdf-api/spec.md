## ADDED Requirements

### Requirement: Checksheet PDFs include Restocking Lists
The checksheet PDF output SHALL include a Restocking List for each included unit when that unit has exceptions.

#### Scenario: PDF unit has exceptions
- **WHEN** a checksheet PDF includes a unit with quantity, checkbox, or condition exceptions
- **THEN** that unit's PDF section SHALL include a Restocking List grouped by source section

#### Scenario: PDF unit has no exceptions
- **WHEN** a checksheet PDF includes a unit with no exceptions
- **THEN** that unit's PDF section SHALL omit the Restocking List section

### Requirement: Daily email PDF includes Restocking Lists
The daily email report PDF SHALL include Restocking Lists for units with exceptions using the same source grouping and deficiency text as checksheet PDFs.

#### Scenario: Daily email PDF has unit exceptions
- **WHEN** the daily report email PDF is generated for a date with unit exceptions
- **THEN** the PDF SHALL include Restocking List sections for affected units
