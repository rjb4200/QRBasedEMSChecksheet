## ADDED Requirements

### Requirement: Delete controls require risk acknowledgement
The system SHALL require an admin to acknowledge the risk of permanent deletion before enabling actionable controls in the DELETE Records section.

#### Scenario: Delete section loads locked
- **WHEN** an admin views the DELETE Records section
- **THEN** the DELETE date inputs and Preview Records action SHALL be disabled
- **AND** the actionable DELETE controls SHALL appear visually greyed out

#### Scenario: Admin acknowledges deletion risk
- **WHEN** the admin enables the acknowledgement toggle indicating they understand deleted records cannot be recovered
- **THEN** the DELETE date inputs and Preview Records action SHALL become enabled
- **AND** the actionable DELETE controls SHALL no longer appear greyed out

#### Scenario: Admin disables acknowledgement
- **WHEN** the admin disables the acknowledgement toggle after unlocking the DELETE controls
- **THEN** the DELETE date inputs and Preview Records action SHALL become disabled again

### Requirement: Deletion warning remains visible while controls are locked
The system SHALL keep the DELETE Records warning and risk acknowledgement control readable and interactive even while the actionable DELETE controls are locked.

#### Scenario: Locked delete section is displayed
- **WHEN** the DELETE Records section is locked
- **THEN** the danger warning text SHALL remain fully visible
- **AND** the acknowledgement toggle SHALL remain interactive

### Requirement: Existing delete confirmation flow remains unchanged after acknowledgement
The system SHALL preserve the existing preview, export-before-delete, and slide-to-confirm workflow after the DELETE controls are unlocked.

#### Scenario: Admin unlocks delete controls
- **WHEN** the admin acknowledges the risk and previews a selected range
- **THEN** the system SHALL continue to require successful export before presenting the slide-to-confirm delete gate

#### Scenario: Admin reloads the page
- **WHEN** the Records page is reloaded after the DELETE controls were unlocked
- **THEN** the DELETE controls SHALL return to the locked state
