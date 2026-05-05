## ADDED Requirements

### Requirement: Admin can manage shared kits
The system SHALL provide an admin Kits section for creating, viewing, editing, copying, and deleting reusable equipment kits.

#### Scenario: Open Kits page
- **WHEN** an admin clicks the Kits navigation link
- **THEN** the system SHALL open `/admin/kits`
- **AND** show existing kits with assignment information

#### Scenario: Create kit
- **WHEN** an admin creates a kit with a unique name
- **THEN** the system SHALL save the kit definition
- **AND** make it available for unit assignment

#### Scenario: Edit kit metadata
- **WHEN** an admin edits a kit name, description, sort order, active flag, or photo
- **THEN** the system SHALL save those changes on the shared kit definition

#### Scenario: Delete assigned kit
- **WHEN** an admin attempts to delete a kit assigned to one or more units
- **THEN** the system SHALL block deletion
- **AND** show which units use the kit

### Requirement: Kit items use the equipment catalog
The system SHALL build kit equipment lists from `equipment_catalog` items.

#### Scenario: Add equipment to kit
- **WHEN** an admin adds catalog equipment to a kit
- **THEN** the system SHALL create a kit item using the catalog input type and default par level

#### Scenario: Prevent duplicate kit item
- **WHEN** an admin adds equipment that already exists in the same kit
- **THEN** the system SHALL prevent duplicate kit item rows

#### Scenario: Modify kit item layout
- **WHEN** an admin removes, reorders, or changes a kit item par level
- **THEN** the system SHALL update the shared kit definition
- **AND** the change SHALL be visible everywhere the kit is assigned

### Requirement: Admin can copy compartments and kits
The system SHALL support copying existing layouts between compartments and kits without creating ongoing links.

#### Scenario: Create kit from compartment
- **WHEN** an admin creates a kit from a source compartment
- **THEN** the system SHALL copy the source compartment photo and equipment items into a new kit
- **AND** the new kit SHALL NOT remain linked to the source compartment

#### Scenario: Clone kit to compartment
- **WHEN** an admin clones a kit into a unit compartment
- **THEN** the system SHALL create a normal independent compartment with copied kit items
- **AND** later kit edits SHALL NOT affect the cloned compartment

### Requirement: Units can reference shared kits
The system SHALL assign kits to units by reference through a unit kit assignment record.

#### Scenario: Assign kit to unit
- **WHEN** an admin assigns a kit to a unit
- **THEN** the system SHALL create a `unit_kits` assignment
- **AND** SHALL NOT duplicate kit item rows onto the unit

#### Scenario: Remove kit assignment
- **WHEN** an admin removes a kit from a unit
- **THEN** the system SHALL delete only the assignment row
- **AND** SHALL NOT delete the kit, kit items, equipment catalog rows, or unrelated unit assignments

#### Scenario: Copy unit with assigned kits
- **WHEN** an admin creates a unit from an existing unit
- **THEN** normal compartments SHALL be copied as independent compartments
- **AND** assigned kits SHALL be copied as references to the same kits with assignment sort order preserved

### Requirement: Unit admin pages show assigned kits read-only
The system SHALL display assigned kits alongside compartments on unit admin pages while keeping kit contents editable only from the Kits section.

#### Scenario: View unit layout with kits
- **WHEN** an admin opens a unit detail page with assigned kits
- **THEN** compartments and assigned kits SHALL render in one combined visual sort order

#### Scenario: Expand assigned kit
- **WHEN** an admin expands an assigned kit card
- **THEN** the system SHALL show the kit's equipment list as read-only
- **AND** show a direct link to edit the kit on the Kits page

#### Scenario: Unit page does not edit kit items
- **WHEN** an admin views an assigned kit on the unit page
- **THEN** the system SHALL NOT show add-item, delete-item, reorder, or editable par-level controls for the kit

### Requirement: Assigned kits are crew checkoff targets
The system SHALL include unit kit assignments in the crew checkoff workflow like compartments.

#### Scenario: View unit checksheet
- **WHEN** a crew user opens a unit checksheet page
- **THEN** assigned kits SHALL appear in the target list with compartments
- **AND** assigned kits SHALL use the same status language as compartments

#### Scenario: Open assigned kit checkoff
- **WHEN** a crew user opens an assigned kit checkoff target
- **THEN** the system SHALL render the kit items using the same input controls as compartment items

#### Scenario: Submit assigned kit checkoff
- **WHEN** a crew user submits a kit checkoff
- **THEN** the system SHALL record completion for that unit kit assignment only
- **AND** SHALL NOT complete the same kit assigned to another unit

#### Scenario: Historical kit values survive layout changes
- **WHEN** a kit is edited after a historical kit checkoff was submitted
- **THEN** the historical check record SHALL remain valid using the submitted item values stored at checkoff time

### Requirement: Assigned kits have independent QR codes
The system SHALL generate QR codes for each unit kit assignment.

#### Scenario: Print unit QR codes
- **WHEN** an admin prints QR codes for a unit
- **THEN** the printout SHALL include QR codes for both compartments and assigned kits

#### Scenario: Scan assigned kit QR code
- **WHEN** a user scans a kit assignment QR code
- **THEN** the system SHALL open the checkoff page for that specific unit kit assignment
- **AND** SHALL NOT share checkoff state with another unit assignment of the same kit

### Requirement: Fleet, records, and reports include assigned kits
The system SHALL count and display assigned kit checks anywhere unit completion, records, printouts, or exceptions include compartment checks.

#### Scenario: Fleet completion totals
- **WHEN** fleet completion is calculated
- **THEN** assigned kits SHALL count toward each unit's total required checks
- **AND** completed kit checks SHALL count toward completed checks

#### Scenario: Daily checksheet print
- **WHEN** an admin prints daily checksheets
- **THEN** assigned kits SHALL appear with compartments in the printed unit check sheet

#### Scenario: Records and exports
- **WHEN** an admin views or exports historical records
- **THEN** kit check records SHALL be included with unit records

#### Scenario: Exception reporting
- **WHEN** the system reports missing or below-par items
- **THEN** kit items SHALL be included where applicable
