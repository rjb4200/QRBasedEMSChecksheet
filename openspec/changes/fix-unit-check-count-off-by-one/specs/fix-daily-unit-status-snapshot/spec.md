## ADDED Requirements

### Requirement: Shift-reset archive includes crew-name target
The shift reset process SHALL include the crew-name lock target in archive `total_compartments`, `completed_compartments`, and `completion_percentage` for each in-service unit.

#### Scenario: Unit has locked crew name
- **WHEN** shift reset archives a unit with a locked crew name
- **THEN** the archive `completed_compartments` SHALL include the crew-name target
- **AND** the archive `total_compartments` SHALL be compartments plus kits plus one
- **AND** the archive `completion_percentage` SHALL reflect the crew-name contribution

#### Scenario: Unit has no crew name
- **WHEN** shift reset archives a unit without a locked crew name
- **THEN** the archive `completed_compartments` SHALL NOT include the crew-name target
- **AND** the archive `total_compartments` SHALL still be compartments plus kits plus one
