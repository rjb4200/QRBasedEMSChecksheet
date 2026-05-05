## MODIFIED Requirements

### Requirement: Kit items use the equipment catalog
The system SHALL build kit equipment lists from `equipment_catalog` items and MAY organize those kit items into visual item groups.

#### Scenario: Add equipment to kit
- **WHEN** an admin adds catalog equipment to a kit
- **THEN** the system SHALL create a kit item using the catalog input type and default par level
- **AND** SHALL allow the item to be assigned to a kit item group or left ungrouped

#### Scenario: Prevent duplicate kit item
- **WHEN** an admin adds equipment that already exists in the same kit
- **THEN** the system SHALL prevent duplicate kit item rows

#### Scenario: Modify kit item layout
- **WHEN** an admin removes, reorders, changes a kit item par level, or changes a kit item group
- **THEN** the system SHALL update the shared kit definition
- **AND** the change SHALL be visible everywhere the kit is assigned

### Requirement: Admin can copy compartments and kits
The system SHALL support copying existing layouts between compartments and kits without creating ongoing links, including visual item groups where present.

#### Scenario: Create kit from compartment
- **WHEN** an admin creates a kit from a source compartment
- **THEN** the system SHALL copy the source compartment photo, item groups, and equipment items into a new kit
- **AND** copied kit items SHALL reference the corresponding copied kit groups
- **AND** the new kit SHALL NOT remain linked to the source compartment

#### Scenario: Clone kit to compartment
- **WHEN** an admin clones a kit into a unit compartment
- **THEN** the system SHALL create a normal independent compartment with copied kit groups and copied kit items
- **AND** copied compartment items SHALL reference the corresponding copied compartment groups
- **AND** later kit edits SHALL NOT affect the cloned compartment
