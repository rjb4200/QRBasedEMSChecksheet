## ADDED Requirements

### Requirement: Admin can import unit layout
The system SHALL allow admin users to import a truck layout from a JSON file.

#### Scenario: Import valid layout file
- **WHEN** an admin selects a valid layout JSON file and imports it
- **THEN** the compartments and items from the file SHALL be created/updated in the system
- **AND** the import SHALL include all compartments, items, par levels, subcategories, and ordering

#### Scenario: Import adds new compartments
- **WHEN** importing a layout with compartments not existing in the target unit
- **THEN** those new compartments SHALL be created in the unit

#### Scenario: Import updates existing compartments
- **WHEN** importing a layout with compartments that already exist in the target unit
- **THEN** those compartments SHALL be updated with the imported configuration
- **AND** items SHALL be updated by matching names

#### Scenario: Import creates items
- **WHEN** importing a layout with items not existing in a compartment
- **THEN** those new items SHALL be created with correct par values and positions

#### Scenario: Import validates file structure
- **WHEN** an admin imports a file with invalid structure
- **THEN** an error message SHALL be displayed
- **AND** no data SHALL be imported

#### Scenario: Import does not affect checkoff data
- **WHEN** importing a layout to a unit that has existing checkoff data
- **THEN** the daily_unit_items (checkoff status) SHALL NOT be affected
- **AND** only compartment configuration (compartment_items) SHALL be imported