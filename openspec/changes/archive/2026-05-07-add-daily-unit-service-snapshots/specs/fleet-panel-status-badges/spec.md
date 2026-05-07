## ADDED Requirements

### Requirement: Fleet Panel prefers today's service snapshot
The Fleet Panel SHALL use today's `daily_unit_ledgers` service snapshot when available.

#### Scenario: Today ledger rows exist
- **WHEN** one or more `daily_unit_ledgers` rows exist for the current operational date
- **THEN** the Fleet Panel SHALL use ledger unit status, archived flag, and status note for unit service display

#### Scenario: Today ledger rows missing
- **WHEN** no `daily_unit_ledgers` rows exist for the current operational date
- **THEN** the Fleet Panel SHALL continue using current `units.status` as fallback

### Requirement: Out-of-service snapshot units are visible but not treated as missing checks
The Fleet Panel SHALL display out-of-service snapshot units as out of service rather than as missing checkoff work.

#### Scenario: Ledger marks unit out of service
- **WHEN** today's ledger row has `unit_status = out_of_service`
- **THEN** the Fleet Panel SHALL show the unit as out of service
- **AND** the unit SHALL NOT be treated the same as an incomplete in-service unit
