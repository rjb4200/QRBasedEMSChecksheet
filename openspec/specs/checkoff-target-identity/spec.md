## Requirements

### Requirement: Checkoff rows use normalized target identity
The `compartment_checks` table SHALL store normalized target identity fields for every row: `target_type` identifying whether the target is a compartment or kit, and `target_id` identifying the specific target.

#### Scenario: Compartment row identity
- **WHEN** a check row targets a compartment
- **THEN** `target_type` SHALL be `compartment`
- **AND** `target_id` SHALL equal `compartment_id`
- **AND** `unit_kit_id` SHALL be null

#### Scenario: Kit row identity
- **WHEN** a check row targets a kit assignment
- **THEN** `target_type` SHALL be `kit`
- **AND** `target_id` SHALL equal `unit_kit_id`
- **AND** `compartment_id` SHALL be null

#### Scenario: Legacy target columns preserved
- **WHEN** a new check row is written during the compatibility window
- **THEN** the system SHALL populate both normalized identity fields and the existing legacy target column for that target type

### Requirement: Checkoff target identity is unique per shift
The database SHALL enforce exactly one `compartment_checks` row per `(unit_id, target_type, target_id, shift_date, shift_period)`.

#### Scenario: Duplicate normalized target prevented
- **WHEN** two writes target the same unit, target type, target id, shift date, and shift period
- **THEN** the database SHALL allow only one logical check row for that target

#### Scenario: Compartment and kit ids do not collide
- **WHEN** a compartment and a kit assignment have the same UUID value
- **THEN** they SHALL remain distinct check targets because `target_type` differs

### Requirement: Existing check rows are backfilled before unique enforcement
Existing `compartment_checks` rows SHALL be backfilled with normalized target identity before the normalized unique constraint or index is added.

#### Scenario: Backfill compartment rows
- **WHEN** an existing row has `compartment_id` and no `unit_kit_id`
- **THEN** the migration SHALL set `target_type` to `compartment`
- **AND** `target_id` SHALL be set to the row's `compartment_id`

#### Scenario: Backfill kit rows
- **WHEN** an existing row has `unit_kit_id` and no `compartment_id`
- **THEN** the migration SHALL set `target_type` to `kit`
- **AND** `target_id` SHALL be set to the row's `unit_kit_id`

### Requirement: Duplicate groups are detected before constraint creation
The migration process SHALL detect duplicate normalized target groups before creating the normalized unique constraint or index.

#### Scenario: No duplicates found
- **WHEN** duplicate detection returns no groups for `(unit_id, target_type, target_id, shift_date, shift_period)`
- **THEN** the migration MAY create the normalized unique constraint or index

#### Scenario: Duplicates found
- **WHEN** duplicate detection returns one or more duplicate groups
- **THEN** implementation SHALL pause unique constraint creation until duplicate rows are cleaned or merged deterministically

### Requirement: Migration preserves rollback compatibility
The first release of normalized target identity SHALL preserve existing `compartment_id` and `unit_kit_id` columns and SHALL NOT drop legacy partial unique indexes.

#### Scenario: App rollback after migration
- **WHEN** the application is rolled back to a version that reads legacy target columns
- **THEN** check rows SHALL still contain `compartment_id` or `unit_kit_id` values required by the legacy code

#### Scenario: Future cleanup deferred
- **WHEN** normalized target identity is implemented
- **THEN** removal of legacy target columns or legacy indexes SHALL be deferred to a separate future change
