## Requirements

### Requirement: Detect condition items with non-OK status as exceptions
The system SHALL detect condition-type checkoff items where the status is not "OK" and include them in the Exceptions report.

#### Scenario: Condition item marked OK
- **GIVEN** a completed checkoff includes a condition item
- **WHEN** the condition status equals "OK"
- **THEN** no exception SHALL be generated for that item

#### Scenario: Condition item marked FAILED
- **GIVEN** a completed checkoff includes a condition item
- **WHEN** the condition status does not equal "OK" (e.g., "FAILED", "MISSING", "REPLACE")
- **THEN** an exception SHALL be generated with:
  - Issue: "Condition issue"
  - Expected: "OK"
  - Actual: the actual status value

### Requirement: Condition exceptions appear in Admin Dashboard
The system SHALL display condition item exceptions in the Admin Dashboard Exceptions panel.

#### Scenario: View exceptions with condition issues
- **WHEN** an admin views the Exceptions panel
- **THEN** condition item exceptions SHALL be displayed in the table
- **AND** show the actual status value in the Value column