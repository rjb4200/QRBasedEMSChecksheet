## Requirements

### Requirement: Ledger captures unit status at creation
Daily unit ledger rows SHALL include the unit's current `units.status` value when created.

#### Scenario: Ledger row created
- **WHEN** a new daily_unit_ledgers row is created
- **THEN** `unit_status` SHALL be populated from `units.status`

### Requirement: Records page falls back to live status
The Records page SHALL fall back to `units.status` when the ledger's `unit_status` is blank or null.

#### Scenario: Ledger status is missing
- **WHEN** a ledger row has null or blank unit_status
- **THEN** the Records page SHALL display the live `units.status` instead of "unknown"

### Requirement: Existing unknown statuses backfilled
Existing ledger rows with null, blank, or "unknown" unit_status SHALL be repaired where possible.

#### Scenario: Backfill repairs unknown status
- **WHEN** a backfill migration runs
- **THEN** ledger rows with missing status SHALL be populated from their unit's current status