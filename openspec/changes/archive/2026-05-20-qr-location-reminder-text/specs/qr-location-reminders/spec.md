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

### Requirement: Unit dashboard shows compact location icon that expands on tap
The unit dashboard SHALL show a small map-pin icon on its own line below the status text, right-aligned, for targets that have QR location reminder text. Tapping or clicking the icon SHALL expand the reminder text below the icon without shifting the compartment name or status text above.

#### Scenario: Reminder exists for target
- **WHEN** a compartment or assigned kit has QR location reminder text
- **THEN** the unit dashboard SHALL show a small map-pin icon right-aligned below the status text for that target
- **AND** no additional text label SHALL be shown

#### Scenario: Icon tap expands reminder on mobile
- **WHEN** a user taps the map-pin icon on a touch device
- **THEN** the system SHALL expand the reminder text below the icon
- **AND** the compartment name and status text above SHALL not move

#### Scenario: Reminder is empty
- **WHEN** a compartment or assigned kit has no QR location reminder text
- **THEN** the unit dashboard SHALL NOT show the map-pin icon for that target

### Requirement: Admin save button provides visual icon feedback
The admin unit edit page QR Location save button SHALL show a disk icon and provide visual feedback when clicked.

#### Scenario: Save button shows pending state
- **WHEN** an admin clicks the Save button for a QR Location field
- **THEN** the button SHALL replace the disk icon with a spinning loader until the save completes

### Requirement: QR location reminders preserve existing workflows
QR location reminders SHALL NOT change checkoff behavior, completion logic, records/archive behavior, or QR/NFC routing.

#### Scenario: User opens checkoff target with reminder
- **WHEN** a user opens a compartment or kit checkoff target that has reminder text
- **THEN** the checkoff page SHALL load using the existing workflow

#### Scenario: User completes checkoff target with reminder
- **WHEN** a user submits a checkoff for a target that has reminder text
- **THEN** completion and records/archive behavior SHALL remain unchanged
