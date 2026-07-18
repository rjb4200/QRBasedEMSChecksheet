## ADDED Requirements

### Requirement: Fleet Matrix retains natural unit order
The Fleet Matrix SHALL display visible units in a stable, natural ascending order by unit name after combining current-shift ledger data with live unit data. Partial daily-ledger coverage SHALL NOT move a unit ahead of another unit solely because it has a ledger row.

#### Scenario: Status change creates a partial ledger
- **WHEN** EC4 has a current-shift daily ledger after its service status changes and EC1-EC3 and EC5-EC7 are supplied from live unit data
- **THEN** the Fleet Matrix displays EC1, EC2, EC3, EC4, EC5, EC6, and EC7 in that order

#### Scenario: Natural numeric names are ordered numerically
- **WHEN** the Fleet Matrix contains units named EC2 and EC10
- **THEN** EC2 appears before EC10

### Requirement: Fleet Matrix refreshes after a service-status change
The system SHALL invalidate cached Fleet Matrix status after a unit service-status change completes successfully.

#### Scenario: Unit returns to service
- **WHEN** an administrator changes a unit from out of service to in service
- **THEN** the next Fleet Matrix render reflects the unit's current service status without waiting for the prior cache lifetime to expire
