## ADDED Requirements

### Requirement: Quantity rows stack on mobile
The system SHALL render quantity/count checkoff rows with a mobile-first stacked layout so item names and count controls do not compete for horizontal space.

#### Scenario: Crew views quantity item on narrow phone
- **WHEN** a crew member opens a checkoff form on a narrow mobile viewport
- **THEN** the quantity item's equipment name SHALL have the full row width available
- **AND** the quantity controls SHALL render below the equipment name and metadata
- **AND** the row SHALL NOT require horizontal scrolling

#### Scenario: Crew views quantity item on larger viewport
- **WHEN** a crew member opens a checkoff form on a tablet or desktop viewport with sufficient width
- **THEN** the quantity row MAY align the name and controls horizontally
- **AND** the controls SHALL remain readable and tappable

### Requirement: Long equipment names remain readable
The system SHALL allow long equipment names in checkoff rows to wrap naturally while preserving readable primary text size.

#### Scenario: Quantity item has long name with spaces
- **WHEN** a quantity item name is long enough to wrap on mobile
- **THEN** the name SHALL wrap across multiple lines
- **AND** the primary name text SHALL remain readable at normal mobile size

#### Scenario: Quantity item has long name with slashes or hyphens
- **WHEN** a quantity item name contains slashes, hyphens, abbreviations, or long segments
- **THEN** the name SHALL break or wrap without causing horizontal overflow

### Requirement: Non-quantity rows are not degraded
The system SHALL preserve checkbox and condition checkoff row behavior while improving quantity row layout.

#### Scenario: Crew views checkbox row
- **WHEN** a crew member views a checkbox item row
- **THEN** the checkbox control SHALL remain readable and tappable
- **AND** the row SHALL not be visually degraded by the quantity-specific layout change

#### Scenario: Crew views condition row
- **WHEN** a crew member views a condition item row
- **THEN** the condition controls SHALL remain readable and tappable
- **AND** the row SHALL not be visually degraded by the quantity-specific layout change

### Requirement: Checkoff data behavior is unchanged
The system SHALL preserve existing checkoff value, save, and submit behavior while changing quantity row layout.

#### Scenario: Crew adjusts quantity value
- **WHEN** a crew member uses the quantity minus or plus controls
- **THEN** the item value SHALL update using the existing behavior
- **AND** submitted checkoff data SHALL keep the existing item-keyed payload shape
