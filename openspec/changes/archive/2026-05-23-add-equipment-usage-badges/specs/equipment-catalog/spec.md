## MODIFIED Requirements

### Requirement: Equipment catalog rows show assignment usage
The equipment catalog SHALL show how many active assignments reference each equipment item via a count badge and display the specific unit and compartment/kit names on hover via a tooltip.

#### Scenario: Catalog row shows usage badge
- **WHEN** admin views the Equipment Catalog page
- **THEN** each row SHALL display a usage count badge
- **AND** hovering over the badge SHALL show unit and compartment/kit names
- **AND** items with zero usage SHALL be visually distinguishable with an "Unused" label

#### Scenario: Hover tooltip shows all usages
- **WHEN** admin hovers over the usage badge on a used item
- **THEN** a tooltip SHALL list all unit/compartment usages
