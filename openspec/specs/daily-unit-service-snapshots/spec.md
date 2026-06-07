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

### Requirement: Daily ledgers cover all date-relevant units for Records
The system SHALL save daily unit ledger rows for every unit that was active or out of service for the operational date so Records can render the complete historical readiness ledger. The bulk ledger refresh function (`refreshDailyUnitLedgers`) SHALL NOT be called as a side-effect of reading fleet status; it SHALL only be invoked by explicit external triggers (status changes, archival, shift reset, or scheduled maintenance).

#### Scenario: Shift reset closes an operational date
- **WHEN** shift reset creates daily ledger rows for the operational date being closed
- **THEN** it SHALL include every non-deleted unit that was active or out of service for that date
- **AND** each row SHALL preserve the unit name, service status, target count, archived state, and status note for that date

#### Scenario: Unit is out of service for the operational date
- **WHEN** a unit is out of service during the operational date
- **THEN** the daily ledger SHALL include the unit so Records can display it as not required rather than missing

#### Scenario: Fleet status read does not trigger ledger refresh
- **WHEN** the fleet panel calls `getFleetStatus` to retrieve current unit statuses
- **THEN** the system SHALL NOT call `refreshDailyUnitLedgers`
- **AND** the fleet panel SHALL use existing ledger rows if available or fall back to live unit data

#### Scenario: Fleet panel falls back when no ledger rows exist
- **WHEN** `getFleetStatus` finds no ledger rows for the current shift
- **THEN** the fleet panel SHALL use raw unit rows from the `units` table as the data source
- **AND** the fleet panel SHALL render all visible units with their live status, compartment counts, and kit assignments

### Requirement: Daily ledgers support readiness classification
Daily unit ledger rows SHALL provide enough snapshot data for Records to determine whether a unit was required or not required for the date before applying checkoff completion data.

#### Scenario: Ledger row marks unit not required
- **WHEN** a ledger row identifies a unit as out of service or archived for the date
- **THEN** Records SHALL be able to classify that unit as not required without relying on current unit state

#### Scenario: Ledger row marks unit required
- **WHEN** a ledger row identifies a unit as active and required for the date
- **THEN** Records SHALL be able to classify the unit as checked, incomplete, or not started using date-specific checkoff evidence

### Requirement: Daily ledger snapshots remain date-scoped
Daily unit ledger data used by Records SHALL remain scoped to the operational date and shift period of the historical record.

#### Scenario: Same unit has later state changes
- **WHEN** a unit changes service status after a ledger row is saved
- **THEN** the saved ledger row SHALL continue to represent the unit's status for its original operational date and shift period
