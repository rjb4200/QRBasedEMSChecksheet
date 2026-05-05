## Requirements

### Requirement: Operational data reset preserves access
The system SHALL support resetting operational layout and check data while preserving user and admin access data.

#### Scenario: Reset operational data
- **WHEN** the EC4 baseline reset is applied
- **THEN** existing units, compartments, compartment items, checks, archives, ledgers, crews, kits, kit items, kit assignments, equipment catalog rows, templates, template compartments, and template items SHALL be deleted
- **AND** users, user roles, and admin users SHALL remain intact

### Requirement: EC4 baseline unit is seeded
The system SHALL create a single in-service EC4 unit from the provided equipment checklist.

#### Scenario: Seed EC4 unit
- **WHEN** the EC4 baseline seed completes
- **THEN** the database SHALL contain an in-service unit named `EC4`
- **AND** EC4 SHALL contain compartments from the provided checklist in checklist order

### Requirement: EC4 equipment assignments are seeded
The system SHALL seed EC4 equipment assignments using the equipment catalog and compartment item rows.

#### Scenario: Seed compartment equipment
- **WHEN** EC4 compartments are created
- **THEN** each checklist item SHALL be represented as equipment catalog data assigned to the relevant EC4 compartment
- **AND** counted items SHALL have par levels where practical
- **AND** nested checklist headings SHALL be stored as subcategories where practical

### Requirement: Seed operation is atomic
The system SHALL apply the reset and seed as one atomic operation.

#### Scenario: Seed failure
- **WHEN** any reset or seed statement fails
- **THEN** the database SHALL reject the transaction
- **AND** avoid leaving a partially seeded EC4 layout
