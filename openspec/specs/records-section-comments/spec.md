## Requirements

### Requirement: Records page displays section comments
The Records page SHALL display compartment and kit section comments for the selected date and unit.

#### Scenario: Section comments appear under the matching unit
- **WHEN** a compartment or kit has a section comment for the selected Records date
- **THEN** the comment SHALL appear under that unit record
- **AND** the comment SHALL be labeled with the source compartment or kit name

#### Scenario: No section comments exist
- **WHEN** no section comments exist for the selected date and unit
- **THEN** the Records page SHALL NOT show a section comments block for that unit

#### Scenario: Unit-level comments remain separate
- **WHEN** both unit-level comments and section comments exist for a unit
- **THEN** unit-level comments SHALL be displayed separately from section comments
