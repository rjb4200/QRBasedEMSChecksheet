## ADDED Requirements

### Requirement: Admin can create subcategories
The system SHALL allow admin users to create subcategories within a compartment.

#### Scenario: Create new subcategory
- **WHEN** an admin enters a subcategory name and saves it to a compartment
- **THEN** the subcategory SHALL be created and associated with that compartment

#### Scenario: Multiple subcategories per compartment
- **WHEN** an admin creates multiple subcategories in one compartment
- **THEN** all subcategories SHALL exist and be accessible for item assignment

### Requirement: Items assigned to subcategories
The system SHALL allow items to be assigned to a subcategory within a compartment.

#### Scenario: Assign item to subcategory
- **WHEN** an admin selects a subcategory for an equipment item
- **THEN** the item SHALL be associated with that subcategory

#### Scenario: Item without subcategory
- **WHEN** an item has no subcategory assigned
- **THEN** the item SHALL appear in a default "Uncategorized" section

### Requirement: Subcategories display on checkoff page
The system SHALL display subcategories on the checkoff page with visual styling to group associated items.

#### Scenario: Checkoff shows grouped items
- **WHEN** a crew member views a compartment checkoff page with subcategories
- **THEN** items SHALL be displayed under their respective subcategory headers
- **AND** each subcategory SHALL have visual styling (background, border, or divider)

#### Scenario: Uncategorized items displayed separately
- **WHEN** items exist without a subcategory assignment
- **THEN** those items SHALL appear in an "Uncategorized" or default section

### Requirement: Subcategories can be reordered
The system SHALL allow admin to reorder subcategories within a compartment.

#### Scenario: Reorder subcategories
- **WHEN** an admin changes the order of subcategories
- **THEN** the subcategories SHALL appear in the new order on checkoff, records, and printouts

### Requirement: Items can be moved between subcategories
The system SHALL allow admin to move items from one subcategory to another or to uncategorized.

#### Scenario: Move item to different subcategory
- **WHEN** an admin moves an item from one subcategory to another
- **THEN** the item SHALL appear under the new subcategory on checkoff and all outputs

#### Scenario: Move item to uncategorized
- **WHEN** an admin removes a subcategory assignment from an item
- **THEN** the item SHALL appear in the default uncategorized section