## ADDED Requirements

### Requirement: Equipment catalog stores item definitions
The system SHALL maintain a catalog of equipment items with name, default par level, input type, and category.

#### Scenario: View equipment catalog
- **WHEN** admin opens the equipment catalog
- **THEN** equipment items are displayed with their properties

### Requirement: Equipment catalog supports data import
The system SHALL allow bulk importing of equipment items from external sources.

#### Scenario: Import equipment data
- **WHEN** admin imports equipment items from an external dataset
- **THEN** items are added to the catalog with their defined properties

### Requirement: Equipment items have input type classification
Each equipment item SHALL be classified as one of three input types: quantity (stepper), checkbox (done/not-done), or condition (status selector).

#### Scenario: Item classified as quantity
- **WHEN** admin creates an item with input type "quantity"
- **THEN** the item uses a stepper input in checkoff forms

#### Scenario: Item classified as checkbox
- **WHEN** admin creates an item with input type "checkbox"
- **THEN** the item uses a checkbox input in checkoff forms

#### Scenario: Item classified as condition
- **WHEN** admin creates an item with input type "condition"
- **THEN** the item uses a status selector input in checkoff forms

### Requirement: Equipment items are categorized
Each equipment item SHALL be assigned to a category (e.g., Medical, PPE, Tools, Fluids, Supplies).

#### Scenario: Filter catalog by category
- **WHEN** admin filters the equipment catalog by "Medical"
- **THEN** only items in the Medical category are displayed

### Requirement: Admin can create new equipment items
The admin interface SHALL allow creating new equipment items with name, default par level, input type, and category.

#### Scenario: Create new equipment item
- **WHEN** admin creates a new equipment item
- **THEN** the item is added to the catalog and available for assignment to compartments

#### Scenario: Duplicate equipment name is reused
- **WHEN** admin creates equipment with a name that already exists
- **THEN** the existing catalog item is updated instead of failing with a duplicate-name error

### Requirement: Admin can edit existing equipment items
The admin interface SHALL allow editing name, default par level, input type, and category for existing equipment items.

#### Scenario: Edit equipment item
- **WHEN** admin edits an equipment item's properties
- **THEN** the changes are saved and reflected in future compartment assignments

#### Scenario: Edit requires explicit row activation
- **WHEN** the Equipment Catalog page loads
- **THEN** existing catalog rows SHALL be read-only until the admin clicks Edit for a row

#### Scenario: Non-quantity input disables par editing
- **WHEN** an admin edits an item whose input type is Checkbox or Condition
- **THEN** the default par level field SHALL be disabled and visually greyed out

### Requirement: Admin can delete equipment items
The admin interface SHALL allow deleting equipment items that are not in use by any active unit.

#### Scenario: Delete unused equipment item
- **WHEN** admin deletes an equipment item not assigned to any compartment
- **THEN** the item is removed from the catalog

#### Scenario: Cannot delete item in use
- **WHEN** admin attempts to delete an equipment item assigned to an active compartment
- **THEN** an error prevents deletion and indicates where the item is used

### Requirement: Equipment catalog supports search
The equipment catalog SHALL provide search functionality to find items by name.

#### Scenario: Search for equipment item
- **WHEN** admin types "gloves" in the search field
- **THEN** all items with "gloves" in their name are displayed

### Requirement: Equipment catalog rows show assignment usage
The equipment catalog SHALL show how many active assignments reference each equipment item.

#### Scenario: Catalog row shows usage badge
- **WHEN** admin views the Equipment Catalog page
- **THEN** each row SHALL display a usage badge indicating whether the item is unused or how many active assignments use it
