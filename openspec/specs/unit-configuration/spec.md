## Purpose

Unit configuration covers admin workflows for creating, editing, ordering, and retiring units and their unit-specific checkoff targets.

## Requirements

### Requirement: Admin can create a new unit from scratch
The admin interface SHALL allow creating a new unit with no pre-filled compartments or items.

#### Scenario: Create unit from scratch
- **WHEN** admin selects "Create Unit" and chooses "From Scratch"
- **THEN** an empty unit is created with no compartments

### Requirement: Admin can create a new unit from an existing unit
The admin interface SHALL allow creating a new unit by copying an existing unit's compartments and items.

#### Scenario: Create unit from existing unit
- **WHEN** admin selects "Create Unit" and chooses an existing unit as the source
- **THEN** a new unit is created with all compartments and items copied from the source unit

### Requirement: Admin can add compartments to a unit
The unit builder SHALL allow adding new compartments with a name, grid position, and optional photo.

#### Scenario: Add compartment to unit
- **WHEN** admin adds a compartment to a unit
- **THEN** the compartment appears in the unit's compartment list

### Requirement: Admin can remove compartments from a unit
The unit builder SHALL allow removing existing compartments from a unit.

#### Scenario: Remove compartment from unit
- **WHEN** admin deletes a compartment from a unit
- **THEN** the compartment and all its items are removed from the unit

### Requirement: Admin can assign items to compartments from equipment catalog
The unit builder SHALL allow adding items to a compartment by selecting from the equipment catalog or creating new items.

#### Scenario: Add item from catalog
- **WHEN** admin adds an item to a compartment and selects from the equipment catalog
- **THEN** the item is added with its catalog-defined par level and input type

#### Scenario: Remove individual compartment item
- **WHEN** admin deletes an individual item from a compartment in the unit builder
- **THEN** only that item is removed and the compartment remains on the unit

#### Scenario: Add new item to catalog while building unit
- **WHEN** admin adds an item that doesn't exist in the catalog
- **THEN** a new equipment catalog entry is created and added to the compartment

### Requirement: Admin can edit item par levels per compartment
The unit builder SHALL allow overriding the par level for each item in each compartment.

#### Scenario: Override par level
- **WHEN** admin changes the par level for an item in a compartment
- **THEN** the new par level is saved for that specific compartment-item combination

### Requirement: Admin can import a single compartment
The unit builder SHALL allow importing one compartment from an existing unit into the current unit.

#### Scenario: Import compartment
- **WHEN** admin selects a source compartment to import
- **THEN** the current unit receives a new independent compartment with the source compartment's items, par levels, input types, and photo

### Requirement: Admin can upload compartment photos
The unit builder SHALL allow uploading photos for each compartment.

#### Scenario: Upload compartment photo
- **WHEN** admin uploads a photo for a compartment
- **THEN** the photo is stored and displayed on the compartment checkoff form

### Requirement: Admin can set unit In-Service status
The unit builder SHALL allow setting a unit's operational status to "In-Service" or "Out-of-Service."

#### Scenario: Set unit status
- **WHEN** admin toggles a unit's status
- **THEN** the unit is marked as in-service or out-of-service accordingly

### Requirement: Unit configurations are independent after creation
Once a unit is created (from another unit or scratch), changes to the source unit SHALL NOT affect the copied unit.

#### Scenario: Source unit change doesn't affect copied unit
- **WHEN** admin modifies a source unit after another unit was created from it
- **THEN** the copied unit's compartments and items remain unchanged

### Requirement: Deleting a unit preserves historical records
The unit builder SHALL soft-delete units from current workflows instead of hard-deleting rows that historical records depend on.

#### Scenario: Delete hides unit from current workflows
- **WHEN** admin deletes a unit
- **THEN** the unit is hidden from current fleet, crew checkoff, QR, alert, analytics, and unit builder lists

#### Scenario: Delete does not remove history
- **WHEN** admin deletes a unit that has past daily records
- **THEN** the unit's historical ledgers, archives, crew names, and printable historical check sheets remain available for dates when the unit was present

### Requirement: Admin units list uses consistent icon actions
The admin units list page SHALL use pencil and trash icons for Edit and Delete actions, matching the icon set used on the equipment catalog page.

#### Scenario: Edit action uses pencil icon
- **WHEN** the admin units list page renders a unit row
- **THEN** the Edit action SHALL be a pencil icon button with an accessible label

#### Scenario: Delete action uses trash icon
- **WHEN** the admin units list page renders a unit row
- **THEN** the Delete action SHALL be a trash icon button with an accessible label

### Requirement: OOS toggle is leftmost in unit action row
The admin units list page SHALL position the OOS status toggle as the leftmost action button so that its variable text width does not shift other action buttons.

#### Scenario: OOS toggle is the first action
- **WHEN** the admin units list page renders a unit row
- **THEN** the OOS toggle button SHALL appear before the Edit, QR Codes, and Delete actions

### Requirement: QR Codes action on units page uses an icon
The admin units list page SHALL use a QR code icon for the QR Codes action, matching the icon pattern used for Edit and Delete.

#### Scenario: QR Codes action is an icon
- **WHEN** the admin units list page renders a unit row
- **THEN** the QR Codes action SHALL be a QR code icon link with an accessible label

### Requirement: Action button color reflects unit service status
The admin units list page SHALL use red accent styling for the Set OOS button on in-service units and muted slate styling for the QR Code, Edit, and Delete buttons in all unit states.

#### Scenario: In-service Set OOS button has red accent
- **WHEN** a unit row has `status = in_service`
- **THEN** the Set OOS button SHALL use red background with white text

#### Scenario: QR Code button uses slate in all states
- **WHEN** the admin units list page renders a unit row
- **THEN** the QR Code icon button SHALL use muted slate styling regardless of unit status

#### Scenario: OOS unit buttons use slate styling
- **WHEN** a unit row has `status = out_of_service`
- **THEN** the Set OOS button SHALL use muted slate styling

### Requirement: Destructive actions require a global toggle
The admin units list page SHALL require an admin to enable a destructive actions toggle before any delete icon appears on unit rows. The toggle SHALL be positioned inside a shared white panel below the "Units" red label, with the label text on the left and the switch on the right.

#### Scenario: Toggle is off by default
- **WHEN** the admin units list page loads
- **THEN** the destructive actions toggle SHALL be off with right-aligned label text and switch
- **AND** no delete icons SHALL appear on any unit row

#### Scenario: Admin enables destructive actions
- **WHEN** the admin enables the destructive actions toggle
- **THEN** delete icons SHALL appear on all unit rows

#### Scenario: Admin disables destructive actions
- **WHEN** the admin disables the toggle after enabling it
- **THEN** delete icons SHALL disappear from all unit rows

### Requirement: Unit delete requires two-step per-row confirmation
The admin units list page SHALL require a two-step confirmation before submitting a unit delete form: clicking the delete icon reveals a confirm and cancel action, and only the confirm action submits the form.

#### Scenario: Admin clicks delete icon
- **WHEN** the admin clicks a unit's delete icon
- **THEN** the icon SHALL be replaced by a red "Delete?" button and a cancel button

#### Scenario: Admin confirms delete
- **WHEN** the admin clicks the "Delete?" confirmation button
- **THEN** the delete form SHALL be submitted

#### Scenario: Admin cancels delete
- **WHEN** the admin clicks the cancel button after revealing the delete confirmation
- **THEN** the confirmation buttons SHALL be hidden and the delete icon SHALL reappear

### Requirement: Create unit form is positioned below the unit list
The admin units list page SHALL display the Create unit form below the unit list with a section subheading and description text.

#### Scenario: Create form position and labeling
- **WHEN** the admin units list page renders
- **THEN** the Create unit form SHALL appear after the unit list
- **AND** the form SHALL be preceded by a section subheading and description

### Requirement: Admin units page uses shared panel and red section labels
The admin units list page SHALL use "Unit Management" as the page heading and display the unit list inside a shared white rounded panel with the "Units" red label and destructive toggle positioned at the top of that panel. Each unit row SHALL use the same `border-slate-200` card border as Fleet Panel cards. The "Create a New Unit" section heading SHALL use red text styling.

#### Scenario: Page renders with proper layout
- **WHEN** the admin units list page renders
- **THEN** the page heading SHALL display "Unit Management"
- **AND** the unit list SHALL appear inside a shared panel without an outer border
- **AND** each unit row SHALL have a `border-slate-200` border matching Fleet Panel cards
- **AND** the "Units" red label and destructive toggle SHALL be positioned at the top of the panel
- **AND** the "Create a New Unit" heading SHALL use red text

### Requirement: Admin can alphabetize unit checkoff targets
The unit builder SHALL provide a one-click action that rewrites the mixed ordering of a unit's compartments and assigned kits by visible target name using existing persisted `sort_order` fields.

#### Scenario: Alphabetize mixed compartments and kits
- **WHEN** an admin runs the alphabetize action for a unit
- **THEN** the system SHALL sort that unit's compartments and assigned kits together by visible name in case-insensitive A-Z order
- **AND** assigned kits SHALL NOT be grouped separately from compartments
- **AND** the system SHALL persist the resulting order to `unit_compartments.sort_order` and `unit_kits.sort_order`
- **AND** unit checkoff and admin unit builder displays SHALL continue to use the persisted sort order

#### Scenario: Preserve target internals while alphabetizing
- **WHEN** an admin runs the alphabetize action for a unit
- **THEN** the system SHALL NOT change equipment item ordering inside compartments
- **AND** the system SHALL NOT change kit item ordering inside assigned kits
- **AND** the system SHALL NOT change QR location notes, section comments, checkoff statuses, or restocking item data
