## ADDED Requirements

### Requirement: Kit action forms remain visually separated
The system SHALL render the admin unit kit action forms without overlapping controls or ambiguous submit buttons.

#### Scenario: Admin views kit action forms on desktop
- **WHEN** an admin opens a unit detail page on a desktop-width viewport
- **THEN** the Assign Kit controls SHALL remain inside the Assign Kit form area
- **AND** the Create compartment from kit controls SHALL remain inside the Clone form area
- **AND** controls from one form SHALL NOT overlap or cover controls from the other form

#### Scenario: Admin views kit action forms on smaller screens
- **WHEN** an admin opens a unit detail page on a tablet or mobile-width viewport
- **THEN** the kit action forms SHALL stack or wrap cleanly
- **AND** all inputs, selects, and buttons SHALL remain readable and tappable

### Requirement: Existing kit actions are preserved
The system SHALL preserve existing kit assignment and clone-to-compartment behavior while fixing the layout.

#### Scenario: Assign shared kit to unit
- **WHEN** an admin selects a kit and submits the Assign Kit form
- **THEN** the form SHALL submit using the existing assign-kit action and field names

#### Scenario: Create compartment from kit
- **WHEN** an admin selects a kit and submits the Clone form
- **THEN** the form SHALL submit using the existing clone-kit-to-compartment action and field names
