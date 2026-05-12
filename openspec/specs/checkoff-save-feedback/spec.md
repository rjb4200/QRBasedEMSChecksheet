## Requirements

### Requirement: Submit button shows saving state
The Submit button in compartment and kit checkoff forms SHALL show immediate visual feedback when a save is initiated.

#### Scenario: User taps Submit
- **WHEN** a crew member taps the Submit button
- **THEN** the button text SHALL change to "Saving..."
- **AND** the button SHALL be disabled to prevent duplicate submissions

#### Scenario: Save completes
- **WHEN** the save request completes
- **THEN** the button SHALL return to "Submit" text and become enabled again