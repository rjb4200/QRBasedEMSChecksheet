## ADDED Requirements

### Requirement: Print view includes section comments alongside unit-level comments
The Records print view SHALL include historical section comments from compartment and kit checkoffs in the printed daily record, distinct from unit-level comments.

#### Scenario: Print view shows section comments
- **WHEN** an admin prints Records for a date with section comments
- **THEN** each unit's printed record SHALL show its section comments labeled by source name
- **AND** section comments SHALL appear in the same column as unit-level comments

#### Scenario: Print view preserves existing layout
- **WHEN** the print view renders with section comments
- **THEN** the existing landscape table layout, column structure, and formatting SHALL remain unchanged
