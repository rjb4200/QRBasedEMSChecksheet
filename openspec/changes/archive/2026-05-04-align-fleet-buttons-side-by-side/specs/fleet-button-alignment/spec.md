## ADDED Requirements

### Requirement: Buttons align horizontally on wide screens
When space permits, the "View Checkoff" and "Manage Unit" buttons SHALL display side by side horizontally.

#### Scenario: Horizontal layout on wide screens
- **WHEN** the fleet matrix card has sufficient width (typically desktop view)
- **THEN** the buttons SHALL display in a horizontal row with gap spacing

#### Scenario: Vertical layout on narrow screens
- **WHEN** the fleet matrix card has insufficient width (typically mobile view)
- **THEN** the buttons SHALL wrap to stacked vertical layout

#### Scenario: Button spacing
- **WHEN** buttons are displayed horizontally
- **THEN** there SHALL be reasonable gap between buttons (e.g., 8px-16px)
- **AND** buttons SHALL remain aligned at the start (flex-start)