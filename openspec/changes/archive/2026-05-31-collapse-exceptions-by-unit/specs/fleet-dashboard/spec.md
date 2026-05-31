## MODIFIED Requirements

### Requirement: Fleet page displays submitted item exceptions by date
The admin Fleet page SHALL display submitted checkoff items that are missing or below their configured par count for the last 7 days by default, grouped by date and by unit within each date.

#### Scenario: Exceptions grouped by date and unit
- **WHEN** admin opens the Fleet page
- **THEN** the exceptions panel SHALL show daily date sections, each containing collapsible unit sections with exception counts

#### Scenario: Last three days expanded
- **WHEN** the exceptions panel renders
- **THEN** the most recent three date sections SHALL be expanded by default and older date sections SHALL be closed

#### Scenario: Exception rows are compact
- **WHEN** exception items are displayed within a unit section
- **THEN** each item SHALL render as a compact line showing item name, compartment name, and issue
- **AND** the panel SHALL NOT use a wide horizontal table
