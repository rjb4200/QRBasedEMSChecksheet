## ADDED Requirements

### Requirement: OOS units display with dimmed styling
The system SHALL apply a dimmed visual style to OOS unit cards on the fleet matrix to indicate they will not receive checkoffs.

#### Scenario: OOS unit shows dimmed styling
- **WHEN** a unit has `status = out_of_service`
- **THEN** the unit card on the fleet matrix SHALL display with reduced opacity/dimmed appearance

### Requirement: Non-OOS units retain normal styling
The system SHALL NOT apply dimmed styling to active (non-OOS) unit cards.

#### Scenario: Active unit shows normal styling
- **WHEN** a unit has `status = in_service`
- **THEN** the unit card SHALL display with normal styling and full opacity

### Requirement: OOS visual style communicates expectation
The dimmed styling combined with the OOS badge SHALL make it clear that OOS units are not expected to receive checkoffs.

#### Scenario: OOS unit clearly communicated as not for checkoff
- **WHEN** viewing the fleet matrix with OOS units present
- **THEN** the OOS units SHALL be visually distinct from active units
- **AND** the combination of dimmed styling and OOS badge SHALL immediately communicate these units are out of service

### Requirement: OOS badge shows "Out of Service" not "Archived"
The fleet matrix SHALL show "Out of Service" on the status badge for units that are OOS but not deleted. The "Archived" label SHALL only appear for units whose `deleted_at` column is set.

#### Scenario: OOS unit badge says "Out of Service"
- **WHEN** a unit has `status = out_of_service` and `deleted_at IS NULL`
- **THEN** the badge on the fleet card SHALL read "Out of Service"

#### Scenario: Archived unit is excluded from fleet panel
- **WHEN** a unit has `deleted_at IS NOT NULL`
- **THEN** that unit SHALL NOT appear on the fleet matrix

### Requirement: OOS metadata is persisted on units
The system SHALL store current OOS timestamp and admin attribution directly on the `units` table using `oos_at` and `oos_by_name` columns.

#### Scenario: Unit set OOS records metadata
- **WHEN** an admin sets a unit status to `out_of_service`
- **THEN** `oos_at` SHALL be set to the current timestamp
- **AND** `oos_by_name` SHALL be set to the admin actor name

#### Scenario: Unit returns to service clears metadata
- **WHEN** an admin sets a unit status to `in_service`
- **THEN** `oos_at` SHALL be set to null
- **AND** `oos_by_name` SHALL be set to null
