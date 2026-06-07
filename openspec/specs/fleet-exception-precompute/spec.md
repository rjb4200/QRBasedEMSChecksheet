## Requirements

### Requirement: Exception counts pre-computed during check grouping
The fleet status aggregation SHALL compute exception counts for each completed check during the O(M) check-grouping pass, accumulating per-unit totals that are read directly in the per-unit loop without a separate reduce operation.

#### Scenario: Exception count accumulated during grouping
- **WHEN** building the check group map and a completed check is encountered
- **THEN** the system SHALL call `countTargetExceptions` once for that check
- **AND** the result SHALL be added to the unit group's running `exceptionCount`

#### Scenario: Exception count read directly in per-unit loop
- **WHEN** the per-unit aggregation loop assembles a FleetUnit
- **THEN** the `exceptionCount` field SHALL be read from the pre-built unit check group
- **AND** the system SHALL NOT iterate over completed checks or call `countTargetExceptions` in the per-unit loop

#### Scenario: Completed check with no exceptions
- **WHEN** a completed check has item_data where all items meet or exceed expectations
- **THEN** `countTargetExceptions` SHALL return 0
- **AND** the unit's accumulated `exceptionCount` SHALL NOT increase

#### Scenario: Completed check with exceptions
- **WHEN** a completed check has item_data with missing, below-par, or condition-issue items
- **THEN** `countTargetExceptions` SHALL return the count of exception items
- **AND** the unit's accumulated `exceptionCount` SHALL increase by that count

### Requirement: Exception pre-computation uses the same item lookup maps
The exception pre-computation SHALL use the already-built `compartmentItemMap`, `kitItemMap`, and `unitKitMap` to resolve expected items, identical to the current behavior.

#### Scenario: Compartment check exception lookup
- **WHEN** a completed check targets a compartment
- **THEN** expected items SHALL be resolved from `compartmentItemMap` using `check.compartment_id`

#### Scenario: Kit check exception lookup
- **WHEN** a completed check targets a kit
- **THEN** expected items SHALL be resolved from `kitItemMap` using the kit_id obtained from `unitKitMap` via `check.unit_kit_id`

### Requirement: Exception counts match current behavior
The pre-computed exception counts SHALL produce identical per-unit totals to the existing per-unit `completedChecks.reduce()` approach for every unit, every check, and every item.

#### Scenario: Exception count parity
- **WHEN** the same fleet data is aggregated using both the old reduce approach and the new pre-compute approach
- **THEN** every unit's `exceptionCount` SHALL be identical between the two approaches
