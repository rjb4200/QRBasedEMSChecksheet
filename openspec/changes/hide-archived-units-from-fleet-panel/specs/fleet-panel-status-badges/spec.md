## ADDED Requirements

### Requirement: Fleet Panel excludes archived units
The Fleet Panel SHALL display only non-archived active and non-archived out-of-service units.

#### Scenario: Unit is archived
- **WHEN** a unit's effective Fleet Panel service state is archived
- **THEN** the Fleet Panel SHALL NOT display a card for that unit

#### Scenario: Unit is active
- **WHEN** a unit's effective Fleet Panel service state is active and not archived
- **THEN** the Fleet Panel SHALL display a card for that unit

#### Scenario: Unit is out of service
- **WHEN** a unit's effective Fleet Panel service state is out of service and not archived
- **THEN** the Fleet Panel SHALL display a card for that unit

#### Scenario: Today ledger marks unit archived
- **WHEN** today's `daily_unit_ledgers` row marks a unit as archived
- **THEN** the Fleet Panel SHALL NOT display a card for that unit

#### Scenario: Today ledger is missing
- **WHEN** no current-day ledger row exists for a unit
- **THEN** the Fleet Panel SHALL use the current unit archived/status fields to decide whether the unit is visible
