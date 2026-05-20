## Requirements

### Requirement: Archived units excluded from print
The system SHALL exclude archived units from daily checksheet print output.

#### Scenario: Archived unit not in print
- **WHEN** an archived unit exists in the system
- **THEN** that unit SHALL NOT appear in the daily checksheet printout

### Requirement: OOS units excluded from print
The system SHALL exclude OOS (Out of Service) units from daily checksheet print output.

#### Scenario: OOS unit not in print
- **WHEN** an OOS unit exists in the system
- **THEN** that unit SHALL NOT appear in the daily checksheet printout

### Requirement: Active units included in print
The system SHALL include only active units (not archived, not OOS) in daily checksheet print output.

#### Scenario: Active unit appears in print
- **WHEN** a unit is active and in service
- **THEN** that unit SHALL appear in the daily checksheet printout
