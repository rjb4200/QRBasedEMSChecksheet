## ADDED Requirements

### Requirement: OOS units display with dimmed styling
The system SHALL apply a dimmed visual style to OOS unit cards on the fleet matrix to indicate they will not receive checkoffs.

#### Scenario: OOS unit shows dimmed styling
- **WHEN** a unit has `status = out_of_service`
- **THEN** the unit card on the fleet matrix SHALL display with reduced opacity/dimmed appearance

### Requirement: Non-OOS units retain normal styling
The system SHALL NOT apply dimmed styling to active (non-OOS) unit cards.

#### Scenario: Active unit shows normal styling
- **WHEN** a unit has `status = in_service`
- **THEN** the unit card SHALL display with normal styling and full opacity

### Requirement: OOS visual style communicates expectation
The dimmed styling combined with the OOS badge SHALL make it clear that OOS units are not expected to receive checkoffs.

#### Scenario: OOS unit clearly communicated as not for checkoff
- **WHEN** viewing the fleet matrix with OOS units present
- **THEN** the OOS units SHALL be visually distinct from active units
- **AND** the combination of dimmed styling and OOS badge SHALL immediately communicate these units are out of service

### Requirement: OOS units show current OOS metadata
The fleet matrix SHALL display when an OOS unit was set out of service and which admin set it OOS.

#### Scenario: OOS unit shows timestamp and admin
- **WHEN** a unit has `status = out_of_service`
- **AND** OOS metadata is present on the unit
- **THEN** the unit card SHALL show the OOS timestamp
- **AND** the unit card SHALL show the admin attribution for who set the unit OOS

#### Scenario: Unit returns to service
- **WHEN** a unit status changes from `out_of_service` to `in_service`
- **THEN** the unit SHALL no longer display OOS timestamp or admin attribution on the fleet matrix
