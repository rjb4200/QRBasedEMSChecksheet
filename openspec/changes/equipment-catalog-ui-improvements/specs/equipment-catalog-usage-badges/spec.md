## ADDED Requirements

### Requirement: Each catalog row shows a usage count badge
The Equipment Catalog SHALL display a usage badge on each row showing how many active unit compartment and kit assignments reference that catalog item.

#### Scenario: Used item shows count
- **WHEN** a catalog item is referenced by one or more active unit compartments or kits
- **THEN** the usage badge SHALL show the number of active assignments

#### Scenario: Unused item shows zero
- **WHEN** a catalog item has zero active assignments
- **THEN** the usage badge SHALL indicate the item is unused
- **AND** the badge SHALL make unused items visually distinguishable

#### Scenario: Usage count is display-only
- **WHEN** an admin views the usage badge on a catalog row
- **THEN** the badge SHALL be informational only
- **AND** it SHALL NOT trigger any automatic deletion or detach behavior

### Requirement: Usage count excludes deleted or inactive references
The usage count SHALL only include references from units that are not soft-deleted and compartments/kits that are still active.

#### Scenario: Deleted unit references excluded
- **WHEN** a unit is soft-deleted
- **THEN** its compartment items SHALL NOT count toward the usage badge for the referenced catalog items

#### Scenario: Active unit references included
- **WHEN** a unit is active (deleted_at IS NULL)
- **THEN** its compartment items SHALL count toward the usage badge
