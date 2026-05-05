## ADDED Requirements

### Requirement: Admin can manage compartment item groups
The system SHALL allow admins to create, rename, delete, reorder, and assign equipment items to visual groups within a unit compartment.

#### Scenario: Create compartment group
- **WHEN** an admin creates a group inside a compartment with a name unique to that compartment
- **THEN** the system SHALL save the group for that compartment
- **AND** make it available for item assignment in that compartment

#### Scenario: Rename compartment group
- **WHEN** an admin renames a compartment group
- **THEN** the system SHALL update only the group's display name
- **AND** existing item assignments and check history SHALL remain valid

#### Scenario: Delete compartment group
- **WHEN** an admin deletes a compartment group
- **THEN** the system SHALL delete the group
- **AND** items assigned to that group SHALL become ungrouped
- **AND** no equipment item rows SHALL be deleted

#### Scenario: Assign compartment item to group
- **WHEN** an admin assigns a compartment item to a group or changes its group
- **THEN** the item SHALL render under that group in the compartment
- **AND** its checkoff input identity SHALL remain unchanged

### Requirement: Admin can manage kit item groups
The system SHALL allow admins to create, rename, delete, reorder, and assign equipment items to visual groups within a shared kit.

#### Scenario: Create kit group
- **WHEN** an admin creates a group inside a kit with a name unique to that kit
- **THEN** the system SHALL save the group for that kit
- **AND** make it available for kit item assignment

#### Scenario: Delete kit group
- **WHEN** an admin deletes a kit group
- **THEN** the system SHALL delete the group
- **AND** kit items assigned to that group SHALL become ungrouped
- **AND** no kit item rows SHALL be deleted

#### Scenario: Assign kit item to group
- **WHEN** an admin assigns a kit item to a group or changes its group
- **THEN** the item SHALL render under that group everywhere the kit is displayed
- **AND** the kit item identity SHALL remain unchanged

### Requirement: Grouped items render as collapsible sections
The system SHALL render grouped compartment and kit items as collapsible sections while preserving existing item controls and checkoff behavior.

#### Scenario: Crew opens grouped compartment checkoff
- **WHEN** a crew user opens a compartment checkoff that contains item groups
- **THEN** groups SHALL render with native collapsible sections
- **AND** all groups SHALL default open
- **AND** existing input controls SHALL render inside the correct group

#### Scenario: Crew opens grouped kit checkoff
- **WHEN** a crew user opens an assigned kit checkoff that contains item groups
- **THEN** groups SHALL render with native collapsible sections
- **AND** all groups SHALL default open
- **AND** existing input controls SHALL render inside the correct group

#### Scenario: Render ungrouped items
- **WHEN** items do not belong to a group
- **THEN** the system SHALL render them after grouped items
- **AND** checkoff behavior SHALL remain unchanged

#### Scenario: Render empty groups in crew UI
- **WHEN** a group has no items
- **THEN** the crew checkoff UI SHALL not require the user to interact with that empty group

### Requirement: Groups are presentation-only
The system SHALL treat item groups as visual organization only.

#### Scenario: Submit grouped checkoff
- **WHEN** a user submits a checkoff containing grouped items
- **THEN** the submitted item data SHALL use the existing item-keyed payload shape
- **AND** no group completion state SHALL be recorded

#### Scenario: Generate QR codes
- **WHEN** QR codes are generated for units, compartments, or kit assignments
- **THEN** groups SHALL NOT receive QR codes
- **AND** existing compartment and kit assignment QR behavior SHALL remain unchanged

#### Scenario: Calculate completion totals
- **WHEN** fleet, unit, archive, or reporting completion totals are calculated
- **THEN** groups SHALL NOT count as additional checkoff targets
- **AND** existing compartment and kit target counts SHALL remain unchanged

### Requirement: Group ordering is deterministic
The system SHALL render item groups and items in a deterministic order.

#### Scenario: Render sorted groups
- **WHEN** a compartment or kit contains item groups
- **THEN** groups SHALL render by group sort order
- **AND** items inside each group SHALL render by item sort order
- **AND** ungrouped items SHALL render after grouped items by item sort order

#### Scenario: Sorting collision
- **WHEN** multiple groups have the same sort order
- **THEN** the system SHALL use stable fallback ordering such as creation time or ID

### Requirement: Group relationships survive layout copy workflows
The system SHALL preserve item group relationships when copying layouts between compartments, units, and kits.

#### Scenario: Copy compartment to compartment
- **WHEN** an admin copies or imports a compartment layout into another compartment
- **THEN** the system SHALL copy groups into the destination compartment
- **AND** copied items SHALL reference the corresponding destination groups

#### Scenario: Create kit from compartment
- **WHEN** an admin creates a kit from a compartment
- **THEN** the system SHALL copy compartment groups into kit groups
- **AND** copied kit items SHALL reference the corresponding kit groups

#### Scenario: Clone kit to compartment
- **WHEN** an admin clones a kit into a unit compartment
- **THEN** the system SHALL copy kit groups into compartment groups
- **AND** copied compartment items SHALL reference the corresponding compartment groups

#### Scenario: Copy unit with compartments and kits
- **WHEN** an admin creates a unit from an existing unit
- **THEN** copied compartments SHALL include copied groups and remapped item group references
- **AND** assigned kits SHALL remain references to the same kits
