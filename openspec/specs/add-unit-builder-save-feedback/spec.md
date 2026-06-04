## Requirements

### Requirement: Unit builder save group button shows spinner feedback
The unit builder page SHALL show a loading spinner on the "Save group" button while the save action is being processed.

#### Scenario: Group save shows spinner
- **WHEN** an admin clicks "Save group" in the unit builder
- **THEN** the save icon SHALL be replaced by a spinning loader until the save completes

#### Scenario: Group save returns to icon after completion
- **WHEN** the save completes
- **THEN** the save icon SHALL reappear
