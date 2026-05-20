## ADDED Requirements

### Requirement: Catalog rows use icon actions and are read-only by default
The Equipment Catalog admin page SHALL render catalog rows as read-only displays by default and SHALL use icon buttons for Edit, Save, Delete, and Cancel actions.

#### Scenario: Read-only row shows values as text
- **WHEN** the Equipment Catalog page loads
- **THEN** each row SHALL display name, category, input type, and par level as non-editable text
- **AND** Edit and Delete icon buttons SHALL be visible for each row

#### Scenario: Edit icon enables row editing
- **WHEN** an admin clicks the Edit icon on a row
- **THEN** the row fields SHALL become editable inputs
- **AND** Save and Cancel icons SHALL replace the Edit icon

### Requirement: Quantity field respects input type during editing
The quantity/par input SHALL be disabled for Checkbox and Condition input types when the row is in edit mode, and SHALL be enabled for quantity input types.

#### Scenario: Checkbox or Condition disables quantity field
- **WHEN** an admin edits a row whose input type is Checkbox or Condition
- **THEN** the quantity/par input SHALL be disabled

#### Scenario: Quantity type enables quantity field
- **WHEN** an admin edits a row whose input type is Quantity
- **THEN** the quantity/par input SHALL be editable

### Requirement: Usage badge is displayed on each catalog row
Each catalog row SHALL show a usage count badge indicating how many active assignments reference that item.

#### Scenario: Usage badge shown for every row
- **WHEN** the Equipment Catalog page loads
- **THEN** every catalog row SHALL include a usage badge
- **AND** items with zero usage SHALL be visually distinguishable from items with active usage
