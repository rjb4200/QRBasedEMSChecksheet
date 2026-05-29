## Requirements

### Requirement: Print view includes section comments
The Records print view SHALL include historical section comments from compartment and kit checkoffs for the selected date and unit.

#### Scenario: Section comments appear in print
- **WHEN** a unit has section comments for the selected print date
- **THEN** the printed record SHALL show each section comment labeled by source compartment or kit name

#### Scenario: No section comments in print
- **WHEN** a unit has no section comments for the selected print date
- **THEN** the printed record SHALL NOT show section comment content for that unit

#### Scenario: Unit-level comments remain separate
- **WHEN** both unit-level and section comments exist for a unit
- **THEN** section comments SHALL be visually distinct from the unit-level comment in the printed record
