## Requirements

### Requirement: Daily email report includes section comments
The daily email report SHALL include compartment and kit section comments for the report date, grouped by unit.

#### Scenario: Section comments appear in email
- **WHEN** section comments exist for the report date
- **THEN** the daily email SHALL show section comments grouped by unit
- **AND** each comment SHALL be labeled with its source compartment or kit name

#### Scenario: No section comments in email
- **WHEN** no section comments exist for the report date
- **THEN** the daily email SHALL NOT include a section comments block

#### Scenario: Comments grouped by unit
- **WHEN** multiple units have section comments for the report date
- **THEN** the email SHALL group comments under each unit name
