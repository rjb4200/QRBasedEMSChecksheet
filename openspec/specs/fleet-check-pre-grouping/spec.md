## Requirements

### Requirement: Compartment checks are pre-grouped by unit
The fleet status aggregation SHALL build a `Map<string, UnitCheckGroup>` in a single pass over `compartment_checks` rows, where each group contains all checks for that unit pre-split by status, replacing the per-unit O(M) filter scans with O(1) Map lookups.

#### Scenario: Checks grouped for multiple units
- **WHEN** compartment check rows exist for units A, B, and C
- **THEN** the check map SHALL contain one entry per unit that has check rows
- **AND** each entry SHALL include arrays for all checks, completed checks, and in-progress checks for that unit

#### Scenario: Unit has no check rows
- **WHEN** a visible unit has no compartment check rows for the current shift
- **THEN** the check map SHALL return empty arrays for that unit
- **AND** the unit SHALL be classified as not started

#### Scenario: Single pass over check rows
- **WHEN** the check group map is built
- **THEN** the `checkRows` array SHALL be iterated exactly once
- **AND** each check SHALL be inserted into exactly one unit group

### Requirement: Per-unit aggregation uses group lookups
The per-unit aggregation loop SHALL read pre-grouped check data from the check map rather than filtering the full `checkRows` array.

#### Scenario: Unit aggregation reads from group
- **WHEN** computing status for a unit
- **THEN** the system SHALL retrieve the unit's check group from the map via `map.get(unit.id)`
- **AND** the system SHALL NOT call `checkRows.filter()` to find checks by unit_id

#### Scenario: Completed and in-progress counts use pre-split arrays
- **WHEN** computing completed and in-progress counts for a unit
- **THEN** the system SHALL use `group.completed.length` and `group.inProgress.length` from the pre-built group
- **AND** the system SHALL NOT filter the unit's checks by status in the per-unit loop

### Requirement: Pre-grouping pattern matches existing archive-records approach
The check grouping implementation SHALL use the same Map-based grouping pattern already established in `src/lib/archive-records.ts` at line 272, adapted for the fleet panel's simpler key (unit_id only, since the shift is fixed to the current day).

#### Scenario: Pattern consistency with archive-records
- **WHEN** both fleet.ts and archive-records.ts group checks
- **THEN** both SHALL use a `Map` built by iterating the check array once
- **AND** the fleet grouping SHALL use `unit_id` as the key instead of the compound `unit_id:shift_date:shift_period` key used by archive-records
