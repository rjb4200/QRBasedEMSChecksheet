## ADDED Requirements

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
