## ADDED Requirements

### Requirement: Equipment catalog shows named usage badges
The Equipment Catalog SHALL display named usage badges on each row showing which units and compartments/kits reference that catalog item.

#### Scenario: Item used in a compartment
- **WHEN** a catalog item is assigned to a unit compartment
- **THEN** the catalog row SHALL show a badge with the format `{unitName} / {compartmentName}`

#### Scenario: Item used in a kit
- **WHEN** a catalog item is assigned to a shared kit
- **THEN** the catalog row SHALL show a badge with the kit name and the units that use that kit

#### Scenario: Item used in many places
- **WHEN** a catalog item is assigned to more than 3 unit compartments or kits
- **THEN** the catalog row SHALL show the first few badges plus a `+N more` indicator

#### Scenario: Unused item
- **WHEN** a catalog item has no assignments
- **THEN** the catalog row SHALL show an `Unused` badge visually distinct from used items
