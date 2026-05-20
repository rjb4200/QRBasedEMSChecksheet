## ADDED Requirements

### Requirement: Compartments support optional QR location reminder text
The system SHALL allow each unit compartment to store optional QR/NFC physical-location reminder text.

#### Scenario: Compartment reminder is saved
- **WHEN** an admin enters QR location reminder text for a unit compartment
- **THEN** the system SHALL store that text on the compartment

#### Scenario: Empty compartment reminder is saved
- **WHEN** an admin clears the QR location reminder text for a unit compartment
- **THEN** the system SHALL store no reminder for that compartment

### Requirement: Assigned kits support optional QR location reminder text
The system SHALL allow each unit-assigned kit to store optional QR/NFC physical-location reminder text on the unit-kit assignment.

#### Scenario: Assigned kit reminder is saved
- **WHEN** an admin enters QR location reminder text for an assigned kit on a unit
- **THEN** the system SHALL store that text on the unit-kit assignment

#### Scenario: Same kit has different reminders on different units
- **WHEN** the same shared kit is assigned to multiple units
- **THEN** each unit assignment SHALL be able to store a different QR location reminder

### Requirement: Admins can edit QR location reminders from unit edit page
The admin unit edit page SHALL provide optional QR Location Reminder fields for compartments and assigned kits.

#### Scenario: Admin edits compartment reminder
- **WHEN** an admin views a compartment on Admin -> Units -> Edit Unit
- **THEN** an optional QR Location Reminder field SHALL be available for that compartment

#### Scenario: Admin edits assigned kit reminder
- **WHEN** an admin views an assigned kit on Admin -> Units -> Edit Unit
- **THEN** an optional QR Location Reminder field SHALL be available for that assigned kit

### Requirement: Unit dashboard shows compact location icon with tooltip
The unit dashboard SHALL show a small map-pin icon inline with the status text for targets that have QR location reminder text. The icon SHALL display the reminder text as a hover tooltip and SHALL NOT take additional vertical space.

#### Scenario: Reminder exists for target
- **WHEN** a compartment or assigned kit has QR location reminder text
- **THEN** the unit dashboard SHALL show a small map-pin icon on the right side of the status text for that target
- **AND** no additional text label SHALL be shown

#### Scenario: Icon hover shows reminder
- **WHEN** a user hovers over the map-pin icon
- **THEN** the system SHALL display the QR location reminder text as a tooltip

#### Scenario: Reminder is empty
- **WHEN** a compartment or assigned kit has no QR location reminder text
- **THEN** the unit dashboard SHALL NOT show the map-pin icon for that target

### Requirement: Admin save button provides visual feedback
The admin unit edit page QR Location save button SHALL provide visual feedback when clicked.

#### Scenario: Save button shows pending state
- **WHEN** an admin clicks the Save button for a QR Location field
- **THEN** the button SHALL show a pending state (e.g. "Saving...") until the save completes

### Requirement: QR location reminders preserve existing workflows
QR location reminders SHALL NOT change checkoff behavior, completion logic, records/archive behavior, or QR/NFC routing.

#### Scenario: User opens checkoff target with reminder
- **WHEN** a user opens a compartment or kit checkoff target that has reminder text
- **THEN** the checkoff page SHALL load using the existing workflow

#### Scenario: User completes checkoff target with reminder
- **WHEN** a user submits a checkoff for a target that has reminder text
- **THEN** completion and records/archive behavior SHALL remain unchanged
