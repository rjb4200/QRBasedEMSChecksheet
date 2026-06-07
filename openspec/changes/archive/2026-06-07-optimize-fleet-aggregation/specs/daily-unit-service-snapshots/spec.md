## MODIFIED Requirements

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
