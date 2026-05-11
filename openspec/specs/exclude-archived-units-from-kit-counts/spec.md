## Requirements

### Requirement: Kit counts exclude archived units
The Admin Kits page SHALL count only active (non-archived) units in kit attachment counts.

#### Scenario: Kit has active and archived units
- **WHEN** viewing kit attachment counts
- **THEN** only units where `deleted_at IS NULL` SHALL be included in the count

#### Scenario: Kit has only archived units
- **WHEN** all attached units are archived
- **THEN** the attachment count SHALL be 0

### Requirement: Attached unit lists hide archived units
The attached-unit name lists on the Kits page SHALL only display active units.

#### Scenario: Archived unit not listed
- **WHEN** viewing attached units for a kit
- **THEN** archived unit names SHALL NOT appear in the list

### Requirement: Historical relationships preserved
Archived unit-kit relationships SHALL remain in the database.

#### Scenario: Archived unit still linked in database
- **WHEN** a unit is archived
- **THEN** its `unit_kits` rows SHALL NOT be deleted