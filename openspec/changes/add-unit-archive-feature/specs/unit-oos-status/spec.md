## ADDED Requirements

### Requirement: Admin can mark a unit as Out of Service
The system SHALL allow admin users to mark a unit as OOS (Out of Service).

#### Scenario: Admin marks unit as OOS
- **WHEN** an admin user clicks the "Mark OOS" button on a unit
- **THEN** the unit's `oos_at` timestamp SHALL be set to the current time
- **AND** the unit SHALL display with OOS visual styling

#### Scenario: Clear OOS status
- **WHEN** an admin user clicks the "Clear OOS" button on an OOS unit
- **THEN** the unit's `oos_at` timestamp SHALL be set to null
- **AND** the unit SHALL return to normal active styling

### Requirement: OOS units display with distinct visual style
The system SHALL display OOS units with an orange/yellow styling and an "OOS" badge.

#### Scenario: OOS unit page shows orange styling
- **WHEN** an admin views an OOS unit's detail page
- **THEN** the page SHALL have an orange/yellow background or border styling
- **AND** an "OOS" badge SHALL be displayed

### Requirement: OOS units visible in fleet panel
The system SHALL display OOS units in the fleet panel with their distinct styling.

#### Scenario: Fleet panel shows OOS units
- **WHEN** an admin views the fleet panel
- **THEN** OOS units SHALL be displayed with orange/yellow styling
- **AND** OOS units SHALL be counted in the fleet total