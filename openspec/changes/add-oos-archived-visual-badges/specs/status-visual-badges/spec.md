## ADDED Requirements

### Requirement: OOS badge on fleet panel
The system SHALL display an "OOS" badge with orange styling on fleet panel unit cards for units marked as Out of Service.

#### Scenario: OOS unit shows orange badge on fleet
- **WHEN** a unit has oos_at timestamp set (is OOS)
- **THEN** an orange "OOS" badge SHALL be displayed on the unit's fleet panel card

### Requirement: Archived badge on fleet panel
The system SHALL display an "ARCHIVED" badge with grey styling on fleet panel unit cards for archived units.

#### Scenario: Archived unit shows grey badge on fleet
- **WHEN** a unit has archived_at timestamp set (is archived)
- **THEN** a grey "ARCHIVED" badge SHALL be displayed on the unit's fleet panel card

### Requirement: OOS badge on unit detail page
The system SHALL display an "OOS" badge on the unit detail page for OOS units.

#### Scenario: OOS unit shows badge on detail page
- **WHEN** viewing the detail page of an OOS unit
- **THEN** an orange "OOS" badge SHALL be displayed near the unit name

### Requirement: Archived badge on unit detail page
The system SHALL display an "ARCHIVED" badge on the unit detail page for archived units.

#### Scenario: Archived unit shows badge on detail page
- **WHEN** viewing the detail page of an archived unit
- **THEN** a grey "ARCHIVED" badge SHALL be displayed near the unit name

### Requirement: Active units show no status badge
The system SHALL NOT display any status badge on fleet panel or unit pages for active units (neither OOS nor archived).

#### Scenario: Active unit has no badge
- **WHEN** a unit has both archived_at and oos_at as null (active)
- **THEN** no status badge SHALL be displayed on the fleet panel card or unit detail page