## ADDED Requirements

### Requirement: Daily Checkoff target cards are status-only
The system SHALL render compartment and kit cards on the crew Daily Checkoff unit dashboard as non-clickable status indicators.

#### Scenario: Crew views unit dashboard targets
- **WHEN** a crew member views a unit's Daily Checkoff dashboard
- **THEN** compartment and kit cards SHALL display each target's name and current status
- **AND** the cards SHALL NOT navigate to compartment or kit checkoff forms when clicked or tapped

#### Scenario: Target status remains visible
- **WHEN** a compartment or kit has a Not Started, In Progress, or Completed status
- **THEN** the dashboard SHALL continue to show that status on the target card

### Requirement: Scan remains the intended checkoff entry point
The system SHALL keep QR scanning as the visible Daily Checkoff navigation path for opening compartment and kit checkoff forms.

#### Scenario: Crew needs to open a target checkoff
- **WHEN** a crew member is on the Daily Checkoff unit dashboard
- **THEN** the page SHALL provide a Scan action that navigates to the QR scanner
- **AND** the dashboard SHALL NOT provide direct compartment or kit checkoff links

#### Scenario: Direct checkoff URL is used
- **WHEN** a compartment or kit checkoff URL is opened directly from a QR code, bookmark, browser history, or manually entered URL
- **THEN** the existing checkoff page SHALL remain reachable
- **AND** the system SHALL NOT require additional scan-session validation
