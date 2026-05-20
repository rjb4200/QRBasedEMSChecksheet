## ADDED Requirements

### Requirement: Existing units serve as layout templates
The system SHALL use existing units as copy sources for new unit creation instead of maintaining a separate template management section.

#### Scenario: Create unit from existing unit
- **WHEN** admin creates a new unit and selects an existing unit as the source
- **THEN** the new unit is created with copied compartments, equipment assignments, par levels, input types, grid positions, and compartment photos

### Requirement: Unit copies are independent
Copied units SHALL remain independent after creation.

#### Scenario: Source unit changes after copy
- **WHEN** admin modifies the source unit after another unit was copied from it
- **THEN** the copied unit retains its own compartment and item configuration

### Requirement: Separate template section is not exposed
The admin interface SHALL not expose a separate Templates section for normal configuration work.

#### Scenario: Admin configures reusable layout
- **WHEN** admin wants to create a reusable starting layout
- **THEN** admin configures a real unit and uses that unit as the source for future copies

### Requirement: Duplicate unit-copy operations are idempotent
Creating or updating a unit from an existing unit SHALL avoid duplicate-name failures by updating existing matching records where appropriate.

#### Scenario: Admin reuses an existing unit name
- **WHEN** admin creates a unit with a name that already exists
- **THEN** the existing unit record is reused and updated instead of failing with a duplicate key error
