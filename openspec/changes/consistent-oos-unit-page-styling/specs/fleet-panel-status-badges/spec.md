## ADDED Requirements

### Requirement: Unit page uses muted slate OOS styling consistent with Fleet Panel
The individual unit page SHALL display an out-of-service banner using muted slate styling consistent with the Fleet Panel OOS card treatment instead of a red danger banner.

#### Scenario: OOS unit page displays slate banner
- **WHEN** a unit has `status = out_of_service`
- **THEN** the unit page SHALL display an OOS banner using slate/muted tones
- **AND** the banner SHALL NOT use red/danger styling

#### Scenario: OOS details are available
- **WHEN** `oos_at` and/or `oos_by` fields are available for an OOS unit
- **THEN** the OOS banner SHALL display the timestamp and by-name information

#### Scenario: OOS details are not available
- **WHEN** `oos_at` and `oos_by` are null for an OOS unit
- **THEN** the OOS banner SHALL still display a generic "Out of Service" indicator

#### Scenario: In-service unit displays no banner
- **WHEN** a unit has `status = in_service`
- **THEN** the unit page SHALL NOT display any OOS banner

### Requirement: Unit page query includes OOS detail fields
The unit page database query SHALL include `oos_at` and `oos_by` fields from the `units` table when loading a unit.

#### Scenario: Unit page loads an OOS unit
- **WHEN** the unit page queries a unit that is out of service
- **THEN** the query result SHALL include `oos_at` and `oos_by` values
