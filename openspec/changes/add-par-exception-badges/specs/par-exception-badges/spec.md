## ADDED Requirements

### Requirement: Yellow badge for above par items
The system SHALL display a yellow badge on compartment items where the current count exceeds the par value.

#### Scenario: Item above par shows yellow badge
- **WHEN** a compartment item has a count greater than its par value
- **THEN** a yellow badge SHALL be displayed on that item's line
- **AND** the badge SHALL show the par value for reference

#### Scenario: Badge displays correctly for +2 over par
- **WHEN** an item has par of 5 and current count is 7
- **THEN** a yellow badge SHALL display showing the above par indicator and "PAR:5"

### Requirement: Red badge for below par or missing items
The system SHALL display a red badge on compartment items where the current count is less than the par value or is zero.

#### Scenario: Item below par shows red badge
- **WHEN** a compartment item has a count less than its par value
- **THEN** a red badge SHALL be displayed on that item's line
- **AND** the badge SHALL show the par value for reference

#### Scenario: Missing item (count = 0) shows red badge
- **WHEN** a compartment item has a count of 0
- **THEN** a red badge SHALL be displayed indicating missing/below par

#### Scenario: Badge displays correctly for -2 under par
- **WHEN** an item has par of 5 and current count is 3
- **THEN** a red badge SHALL display showing the below par indicator and "PAR:5"

### Requirement: No badge for items at par
The system SHALL NOT display any badge on compartment items where the current count equals the par value.

#### Scenario: Item at par has no badge
- **WHEN** a compartment item has a count equal to its par value
- **THEN** no badge SHALL be displayed on that item's line

### Requirement: Badge shows par value reference
The system SHALL include the par value in the badge display for quick reference.

#### Scenario: Badge includes par value
- **WHEN** a badge is displayed for any exception item
- **THEN** the badge SHALL display the par value alongside the exception indicator