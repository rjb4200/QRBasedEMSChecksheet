# Functional Specifications: Fleet Quick Access

## Requirement: State-Aware Navigation Button
The system SHALL display a "View Checkoff" button on every unit card, regardless of status[cite: 4].

### Scenario: High Visibility, Low Contrast
- **WHEN** a unit is "In Progress"
- **THEN** the button SHALL be displayed with a solid, neutral fill to indicate activity.
- **WHEN** a unit is "Completed" or "Not Started"
- **THEN** the button SHALL be displayed as an outlined/ghost button to reduce visual clutter.

### Scenario: Navigation Accuracy
- **WHEN** the "View Checkoff" button is clicked
- **THEN** the system SHALL navigate to `/units/{unitId}` using client-side routing[cite: 1, 4].
- **AND** the page SHALL load the specific data for that unit ID[cite: 4].

### Scenario: Physical Accessibility
- **GIVEN** a mobile or desktop viewport
- **THEN** the button SHALL have a minimum tap target of 44px[cite: 1].
- **AND** the button SHALL display text ("View Checkoff") rather than an icon only.