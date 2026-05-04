## ADDED Requirements

### Requirement: Linked Compartment Badge Display
The admin UI SHALL display a badge showing the count of linked compartments next to each linked compartment's link name.

#### Scenario: Badge shows count of linked compartments
- **WHEN** a compartment has a linked_compartment_name set
- **THEN** a badge SHALL appear next to the link name displaying the number of compartments that share that same link name

### Requirement: Single Link Shows One
When a compartment is linked but no other compartments share that link name, the badge SHALL display "1".

#### Scenario: Single link displays one
- **WHEN** a compartment has a link name that is unique (no other compartments share it)
- **THEN** the badge SHALL display "1"

### Requirement: Multiple Links Shows Total Count
When multiple compartments share the same link name, the badge SHALL display the total count.

#### Scenario: Multiple linked compartments
- **WHEN** five compartments across different units share the same link name "engine"
- **THEN** the badge SHALL display "5" on each of those compartments

### Requirement: Badge Styled Consistently
The badge SHALL use the admin UI red primary color scheme.

#### Scenario: Badge styling matches admin theme
- **WHEN** the badge is rendered
- **THEN** it SHALL have a red background with white text
- **AND** it SHALL be pill-shaped with rounded corners

### Requirement: Badge Appears in All Link Name Locations
The badge SHALL appear wherever the link name is displayed in the admin interface.

#### Scenario: Badge in all locations
- **WHEN** viewing a unit's compartments in the edit page
- **AND** viewing compartment cards or lists
- **THEN** the badge SHALL be visible next to the link name in all these locations

### Requirement: Count Excludes Archived/OOS Units
The badge count SHALL only include compartments from active (non-archived, non-OOS) units.

#### Scenario: Archived units excluded from count
- **WHEN** calculating the link count for a compartment
- **THEN** compartments from archived or OOS units SHALL NOT be included in the count