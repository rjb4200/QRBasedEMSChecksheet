## ADDED Requirements

### Requirement: Previous shift display includes crew-name target
The "Previous shift" section on unit dashboard pages SHALL include the crew-name lock target in the completed and total check counts when displaying archive data.

#### Scenario: Archive has counts without crew target
- **WHEN** a previous shift archive exists with completed and total compartment counts
- **THEN** the unit page display SHALL show completed + (crew locked ? 1 : 0) of total + 1
