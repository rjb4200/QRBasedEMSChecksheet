## Requirements

### Requirement: Daily ledgers store service snapshot metadata
The system SHALL store daily unit service snapshot metadata in `daily_unit_ledgers`.

#### Scenario: Ledger row is stored
- **WHEN** a daily unit ledger row is created or updated
- **THEN** it SHALL include unit id, unit name, unit status, target count, archived flag, and optional status note

### Requirement: Unit status changes update today's ledger
The system SHALL create or update today's daily unit ledger row when a unit service status changes.

#### Scenario: Unit is placed out of service
- **WHEN** an admin changes a unit to `out_of_service`
- **THEN** the system SHALL update `units.status`
- **AND** the system SHALL upsert today's `daily_unit_ledgers` row with `unit_status = out_of_service`
- **AND** the row MAY include a short `status_note`

#### Scenario: Unit is returned to service
- **WHEN** an admin changes a unit to `in_service`
- **THEN** the system SHALL update `units.status`
- **AND** the system SHALL upsert today's `daily_unit_ledgers` row with `unit_status = in_service`
- **AND** the row SHALL clear or replace `status_note`

### Requirement: Unit archival updates today's ledger
The system SHALL capture same-day archived state in the daily unit ledger when a unit is archived.

#### Scenario: Unit is soft archived
- **WHEN** an admin archives a unit by setting `deleted_at`
- **THEN** the system SHALL keep the unit row
- **AND** the system SHALL upsert today's `daily_unit_ledgers` row with `archived = true`
- **AND** the row SHALL identify the unit as out of service for that day

### Requirement: Daily snapshots remain minimal
The system SHALL NOT introduce advanced reporting, maintenance workflows, alerts, or separate status timeline tables as part of daily service snapshots.

#### Scenario: Snapshot is recorded
- **WHEN** unit service state is snapshotted
- **THEN** the stored data SHALL be limited to the daily ledger fields needed for fleet and archive behavior
