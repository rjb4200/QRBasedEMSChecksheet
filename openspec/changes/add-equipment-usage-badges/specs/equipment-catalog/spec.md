## MODIFIED Requirements

### Requirement: Equipment catalog rows show assignment usage
The equipment catalog SHALL show how many active assignments reference each equipment item and display named usage badges indicating the specific units and compartments/kits where each item is assigned.

#### Scenario: Catalog row shows usage badge
- **WHEN** admin views the Equipment Catalog page
- **THEN** each row SHALL display usage badges showing unit and compartment/kit names
- **AND** items with zero usage SHALL be visually distinguishable from items with active usage

#### Scenario: Multiple usages handled compactly
- **WHEN** an item is used in more than 3 places
- **THEN** the catalog row SHALL show the first 3 badge names plus a count of remaining usages
