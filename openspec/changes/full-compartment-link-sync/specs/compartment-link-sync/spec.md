## ADDED Requirements

### Requirement: Link name matching ignores whitespace
The system SHALL match linked compartments using trimmed link_name, ignoring leading and trailing spaces.

#### Scenario: Matching with spaces
- **WHEN** two compartments have link_name "O2 Bag " and " O2 Bag"
- **THEN** they SHALL be considered linked (same trimmed name)

#### Scenario: No match with different names
- **WHEN** two compartments have link_name "O2 Bag" and "First Aid"
- **THEN** they SHALL NOT be linked

### Requirement: Equipment item changes sync to linked compartments
The system SHALL sync equipment item changes to all compartments with matching link_name.

#### Scenario: Adding item syncs
- **WHEN** an admin adds an equipment item to a linked compartment
- **THEN** the same item SHALL be added to all other compartments with matching link_name

#### Scenario: Removing item syncs
- **WHEN** an admin removes an equipment item from a linked compartment
- **THEN** the same item SHALL be removed from all other compartments with matching link_name

#### Scenario: Par level change syncs
- **WHEN** an admin changes the par value of an item in a linked compartment
- **THEN** the par value SHALL be updated in all other compartments with matching link_name

### Requirement: Equipment ordering syncs to linked compartments
The system SHALL sync equipment ordering changes to all compartments with matching link_name.

#### Scenario: Reorder items syncs
- **WHEN** an admin reorders equipment items in a linked compartment
- **THEN** the same order SHALL be applied to all other compartments with matching link_name

### Requirement: Subcategory changes sync to linked compartments
The system SHALL sync subcategory changes to all compartments with matching link_name.

#### Scenario: Adding subcategory syncs
- **WHEN** an admin adds a subcategory to a linked compartment
- **THEN** the same subcategory SHALL be added to all other compartments with matching link_name

#### Scenario: Removing subcategory syncs
- **WHEN** an admin removes a subcategory from a linked compartment
- **THEN** the same subcategory SHALL be removed from all other compartments with matching link_name

#### Scenario: Subcategory reordering syncs
- **WHEN** an admin reorders subcategories in a linked compartment
- **THEN** the same order SHALL be applied to all other compartments with matching link_name

### Requirement: Checkoff status is NOT synced
The system SHALL NOT sync daily checkoff status between linked compartments.

#### Scenario: Checkoff status independent
- **WHEN** Unit A's linked compartment is checked off but Unit B's is not
- **THEN** Unit B's checkoff status SHALL remain unchecked
- **AND** the two units SHALL have independent checkoff completion status