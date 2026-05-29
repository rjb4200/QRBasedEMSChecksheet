## ADDED Requirements

### Requirement: Fleet Panel includes Recent Comments section between print bar and Exceptions
The Fleet Panel SHALL include a collapsed, lazy-loading Recent Comments section positioned after the daily checksheet print bar and before the Exceptions section.

#### Scenario: Fleet Panel layout includes Recent Comments
- **WHEN** the Fleet Panel renders
- **THEN** the Recent Comments section SHALL appear between the print bar and the Exceptions section
- **AND** it SHALL be collapsed by default

#### Scenario: Fleet Panel load speed unaffected
- **WHEN** the Fleet Panel initially loads
- **THEN** no comment data SHALL be fetched from the server
- **AND** the Fleet Panel render performance SHALL not be affected by the Recent Comments feature
