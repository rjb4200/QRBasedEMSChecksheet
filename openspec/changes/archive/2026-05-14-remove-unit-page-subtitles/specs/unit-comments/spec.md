## MODIFIED Requirements

### Requirement: Unit page displays section comments alongside unit comment
The unit dashboard page SHALL display a merged Section Comments block when section comments exist, appearing alongside but separate from the existing unit-level comment field. The block SHALL use a single "Section Comments" label with no supporting subtitle.

#### Scenario: Both unit and section comments exist
- **WHEN** a unit has both a unit-level comment and section comments for the current shift
- **THEN** the unit page SHALL display both sections separately
- **AND** section comments SHALL NOT be appended into the unit-level comment textarea
- **AND** the Section Comments block SHALL NOT display a "Compartment & Kit Notes" subtitle

#### Scenario: Only section comments exist
- **WHEN** a unit has section comments but no unit-level comment for the current shift
- **THEN** the unit page SHALL display the Section Comments block
- **AND** the unit-level comment section SHALL be hidden or show its empty state

### Requirement: Daily unit comment editor appears on unit checksheets
Each unit checksheet SHALL include one optional Daily Unit Comments editor. The editor SHALL use a single "Daily Unit Comments" label with no supporting subtitle or helper paragraph.

#### Scenario: User views unit checksheet
- **WHEN** a user views a unit checksheet
- **THEN** the page SHALL show a `Daily Unit Comments` section after compartments and kits
- **AND** the section SHALL include a multiline text area and save action
- **AND** the section SHALL NOT display a "Unit Comments" subtitle or an "Optional notes..." helper paragraph
