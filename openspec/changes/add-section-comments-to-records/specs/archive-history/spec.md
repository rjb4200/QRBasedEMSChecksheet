## ADDED Requirements

### Requirement: Records page displays section comments alongside unit-level comments
The admin Records page SHALL display historical section comments from compartment and kit checkoffs for the selected date and unit, alongside unit-level comments.

#### Scenario: Section comments shown on Records
- **WHEN** an admin opens the Records page for a date with section comments
- **THEN** each unit record SHALL show its section comments labeled by source name
- **AND** section comments SHALL appear separately from unit-level comments

#### Scenario: Section comments respect date and unit filtering
- **WHEN** an admin changes the Records date or unit filter
- **THEN** section comments SHALL update to reflect only the selected date and unit
