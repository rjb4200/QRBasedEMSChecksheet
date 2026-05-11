## Requirements

### Requirement: Save button shows in-progress feedback
The Save button in Kits and Equipment editing forms SHALL show immediate visual feedback when a save is initiated.

#### Scenario: User clicks Save
- **WHEN** a user clicks the Save button
- **THEN** the button text SHALL change to "Saving..."
- **AND** the button SHALL be disabled to prevent duplicate submissions

#### Scenario: Save completes
- **WHEN** the save request completes
- **THEN** the button SHALL return to "Save" text and become enabled again

### Requirement: Successful save shows confirmation
The system SHALL display a success confirmation message after a save completes successfully.

#### Scenario: Save succeeds
- **WHEN** a save completes without error
- **THEN** a success message SHALL appear near the Save button
- **AND** the message SHALL auto-dismiss after approximately 4 seconds

### Requirement: Failed save shows error
The system SHALL display an error message when a save fails.

#### Scenario: Save fails with error
- **WHEN** a save request fails
- **THEN** an error message SHALL appear near the Save button
- **AND** the message SHALL persist until the user takes another action

### Requirement: Feedback is accessible
Save feedback messages SHALL be accessible to screen readers.

#### Scenario: Success message is accessible
- **WHEN** a success message is displayed
- **THEN** it SHALL use `role="status"` with `aria-live="polite"`

#### Scenario: Error message is accessible
- **WHEN** an error message is displayed
- **THEN** it SHALL use `role="alert"`

### Requirement: Feedback is consistent across menus
Save feedback behavior SHALL be consistent between Kits and Equipment menus.

#### Scenario: Kits and Equipment use same behavior
- **WHEN** saving in Kits or Equipment
- **THEN** the same feedback patterns SHALL apply
- **AND** both SHALL use a shared implementation where practical