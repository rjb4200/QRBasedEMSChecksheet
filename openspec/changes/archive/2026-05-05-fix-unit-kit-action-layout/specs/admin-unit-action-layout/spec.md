## ADDED Requirements

### Requirement: Kit action forms remain visually separated
The system SHALL render the admin unit kit action forms without overlapping controls or ambiguous submit buttons.

#### Scenario: Admin views kit action forms
- **WHEN** an admin opens a unit detail page
- **THEN** the kit action forms SHALL be rendered as vertically stacked cards
- **AND** the Assign Kit form SHALL display in its own container
- **AND** the Create compartment from kit form SHALL display in its own container below the Assign Kit form
- **AND** controls from one form SHALL NOT overlap or cover controls from the other form

### Requirement: Existing kit actions are preserved
The system SHALL preserve existing kit assignment and clone-to-compartment behavior while fixing the layout.

#### Scenario: Assign shared kit to unit
- **WHEN** an admin selects a kit and submits the Assign Kit form
- **THEN** the form SHALL submit using the existing assign-kit action and field names

#### Scenario: Create compartment from kit
- **WHEN** an admin selects a kit and submits the Clone form
- **THEN** the form SHALL submit using the existing clone-kit-to-compartment action and field names
