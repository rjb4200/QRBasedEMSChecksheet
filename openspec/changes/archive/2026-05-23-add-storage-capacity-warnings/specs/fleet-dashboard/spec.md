## ADDED Requirements

### Requirement: Fleet Panel displays storage capacity warning when thresholds are exceeded
The admin Fleet Panel SHALL display a storage capacity warning banner above the fleet matrix when database usage exceeds the configured thresholds.

#### Scenario: Fleet Panel shows warning at 90%
- **WHEN** database usage is at or above 90% of the storage limit
- **THEN** a warning banner SHALL appear at the top of the Fleet Panel

#### Scenario: Fleet Panel shows critical warning at 95%
- **WHEN** database usage is at or above 95% of the storage limit
- **THEN** a visually distinct critical banner SHALL appear at the top of the Fleet Panel

#### Scenario: Fleet Panel normal operation
- **WHEN** database usage is below 90%
- **THEN** no storage banner SHALL be displayed on the Fleet Panel
