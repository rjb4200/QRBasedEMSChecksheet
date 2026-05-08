## ADDED Requirements

### Requirement: Fleet Panel comment badge reflects saved daily unit comments
The Fleet Panel SHALL show a compact comment badge only for units with saved nonblank comments for the current shift.

#### Scenario: Current shift comment exists
- **WHEN** a unit has a saved nonblank Daily Unit Comment for the current operational date and shift period
- **THEN** the Fleet Panel SHALL show a compact comment badge or icon for that unit
- **AND** the badge SHALL NOT be a large action button

#### Scenario: Current shift comment missing or blank
- **WHEN** a unit has no saved Daily Unit Comment or the saved value is blank after trimming
- **THEN** the Fleet Panel SHALL NOT show a comment badge for that unit
