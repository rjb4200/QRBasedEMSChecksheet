## ADDED Requirements

### Requirement: Equipment catalog shows usage count badge with hover details
The Equipment Catalog SHALL display a usage count badge on each row. Hovering over the badge SHALL show a tooltip listing the specific units and compartments/kits where that catalog item is used.

#### Scenario: Item used shows count and hover details
- **WHEN** a catalog item is assigned to one or more unit compartments or kits
- **THEN** the catalog row SHALL show a usage count badge
- **AND** hovering over the badge SHALL list each `{unitName} / {targetName}` on separate lines

#### Scenario: Unused item
- **WHEN** a catalog item has no assignments
- **THEN** the catalog row SHALL show an `Unused` badge visually distinct from used items
- **AND** the badge SHALL have no hover tooltip
