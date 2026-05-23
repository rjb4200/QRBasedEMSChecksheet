## Requirements

### Requirement: Row fields are read-only by default
Equipment catalog row fields SHALL be read-only on initial page load and after each save or cancel.

#### Scenario: Default row is read-only
- **WHEN** the Equipment Catalog page loads
- **THEN** each catalog row SHALL display its values as non-editable text
- **AND** an Edit icon SHALL be visible for each row

#### Scenario: Row becomes editable after clicking Edit
- **WHEN** an admin clicks the Edit icon on a catalog row
- **THEN** that row's fields SHALL become editable inputs
- **AND** the Edit icon SHALL be replaced by Save and Cancel icons

#### Scenario: Save returns row to read-only
- **WHEN** an admin clicks Save after editing a row
- **THEN** the edited values SHALL be persisted
- **AND** the row SHALL return to read-only display mode

#### Scenario: Cancel discards changes
- **WHEN** an admin clicks Cancel while editing a row
- **THEN** unsaved changes SHALL be discarded
- **AND** the row SHALL return to read-only display mode with the previously saved values

### Requirement: Actions use icon buttons with accessible labels
Filter, Edit, Save, Delete, and Cancel actions SHALL use icon buttons with accessible labels.

#### Scenario: Icon buttons have labels
- **WHEN** an admin views the Equipment Catalog page
- **THEN** each icon button SHALL include an `aria-label` or `title` attribute describing its action

### Requirement: Quantity field is disabled for non-count input types
The quantity/par field SHALL be disabled and visually greyed out when the item input type is Checkbox or Condition.

#### Scenario: Checkbox item disables quantity
- **WHEN** a catalog row has `input_type = checkbox` and is in edit mode
- **THEN** the quantity/par field SHALL be disabled

#### Scenario: Condition item disables quantity
- **WHEN** a catalog row has `input_type = condition` and is in edit mode
- **THEN** the quantity/par field SHALL be disabled

#### Scenario: Quantity item keeps quantity editable
- **WHEN** a catalog row has `input_type = quantity` and is in edit mode
- **THEN** the quantity/par field SHALL be editable

#### Scenario: Input type change updates quantity field state
- **WHEN** an admin changes the input type from quantity to checkbox during editing
- **THEN** the quantity/par field SHALL become disabled immediately

### Requirement: Delete behavior is preserved
Existing delete confirmation and safety behavior SHALL remain unchanged.

#### Scenario: Delete with confirmation
- **WHEN** an admin clicks the Delete icon on a catalog row
- **THEN** the existing delete confirmation flow SHALL execute
- **AND** items assigned to active compartments SHALL be protected from deletion
