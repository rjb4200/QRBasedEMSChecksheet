## ADDED Requirements

### Requirement: Admin can reorder items via drag-and-drop
The system SHALL allow admin users to reorder equipment items within a compartment using drag-and-drop.

#### Scenario: Drag item to new position
- **WHEN** an admin drags an equipment item to a new position within the same compartment
- **THEN** the item SHALL appear in the new position
- **AND** other items SHALL shift to accommodate the change

### Requirement: Admin can reorder items via arrow buttons
The system SHALL allow admin users to reorder equipment items using up/down arrow buttons.

#### Scenario: Move item up
- **WHEN** an admin clicks the up arrow on an equipment item
- **THEN** the item SHALL move one position higher in the list
- **AND** the previous item SHALL move down one position

#### Scenario: Move item down
- **WHEN** an admin clicks the down arrow on an equipment item
- **THEN** the item SHALL move one position lower in the list
- **AND** the next item SHALL move up one position

### Requirement: New order persisted to database
The system SHALL save the reordered item positions to the database.

#### Scenario: Order saved after reorder
- **WHEN** an admin completes a reorder action
- **THEN** the new position values SHALL be saved to the database
- **AND** the order SHALL persist across page refreshes

### Requirement: Items displayed in new order across all views
The system SHALL display equipment items in the new order on checkoff pages, records, and printouts.

#### Scenario: Checkoff page shows new order
- **WHEN** a crew member views the compartment checkoff page
- **THEN** the equipment items SHALL appear in the reordered sequence

#### Scenario: Records show new order
- **WHEN** a supervisor views the records page
- **THEN** the equipment items SHALL appear in the reordered sequence

#### Scenario: Printout shows new order
- **WHEN** a check sheet is printed
- **THEN** the equipment items SHALL appear in the reordered sequence