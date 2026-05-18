## Purpose
Define daily unit ledger status snapshot behavior including capturing unit status at ledger creation, fallback to live status when ledger status is missing, backfill of unknown statuses, and shift-reset archive inclusion of the crew-name lock target.

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

### Requirement: Shift-reset archive includes crew-name target
The shift reset process SHALL include the crew-name lock target in archive `total_compartments`, `completed_compartments`, and `completion_percentage` for each in-service unit.

#### Scenario: Unit has locked crew name
- **WHEN** shift reset archives a unit with a locked crew name
- **THEN** the archive `completed_compartments` SHALL include the crew-name target
- **AND** the archive `total_compartments` SHALL be compartments plus kits plus one
- **AND** the archive `completion_percentage` SHALL reflect the crew-name contribution

#### Scenario: Unit has no crew name
- **WHEN** shift reset archives a unit without a locked crew name
- **THEN** the archive `completed_compartments` SHALL NOT include the crew-name target
- **AND** the archive `total_compartments` SHALL still be compartments plus kits plus one