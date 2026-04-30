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
- **THEN** the current unit receives a new compartment with the source compartment's items, par levels, input types, photo, and link group

### Requirement: Admin can link compartments for shared item values
The unit builder SHALL allow assigning the same link group to multiple compartments on a unit so item changes apply to all linked compartments.

#### Scenario: Add item to linked compartments
- **WHEN** admin adds a catalog item to a compartment with a link group
- **THEN** the item is added to every compartment in that unit with the same link group using the catalog input type and default par level

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
