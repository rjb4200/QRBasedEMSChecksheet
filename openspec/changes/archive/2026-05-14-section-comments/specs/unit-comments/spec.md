## ADDED Requirements

### Requirement: Unit page displays section comments alongside unit comment
The unit dashboard page SHALL display a merged Section Comments block when section comments exist, appearing alongside but separate from the existing unit-level comment field.

#### Scenario: Both unit and section comments exist
- **WHEN** a unit has both a unit-level comment and section comments for the current shift
- **THEN** the unit page SHALL display both sections separately
- **AND** section comments SHALL NOT be appended into the unit-level comment textarea

#### Scenario: Only section comments exist
- **WHEN** a unit has section comments but no unit-level comment for the current shift
- **THEN** the unit page SHALL display the Section Comments block
- **AND** the unit-level comment section SHALL be hidden or show its empty state
