## ADDED Requirements

### Requirement: Admin can archive a unit
The system SHALL allow admin users to archive a unit, marking it as sold or stored.

#### Scenario: Admin archives a unit
- **WHEN** an admin user clicks the "Archive" button on a unit
- **THEN** the unit's `archived_at` timestamp SHALL be set to the current time
- **AND** the unit SHALL be hidden from the fleet panel

#### Scenario: Archived unit not in fleet panel
- **WHEN** an admin user views the fleet panel
- **THEN** archived units SHALL NOT be displayed in the fleet matrix
- **AND** archived units SHALL NOT be counted in the fleet total

### Requirement: Archived units excluded from daily prints
The system SHALL exclude archived units from daily checksheet print output.

#### Scenario: Print excludes archived units
- **WHEN** an admin generates a daily checksheet print
- **THEN** archived units SHALL NOT appear in the printed document

### Requirement: Archived units excluded from new record counts
The system SHALL not count archived units in new record calculations.

#### Scenario: Record count excludes archived
- **WHEN** viewing the records page for a new date
- **THEN** archived units SHALL NOT be included in the unit count

### Requirement: Archived units show in historical records
The system SHALL display archived units in historical records for dates when they were active.

#### Scenario: Historical records include archived units
- **WHEN** viewing records for a past date when a unit was active before being archived
- **THEN** that unit SHALL appear in the historical ledger for that date

#### Scenario: Archived units not in new records
- **WHEN** viewing records for a date after the unit was archived
- **THEN** that unit SHALL NOT appear in the ledger

### Requirement: Archived units display with visual styling
The system SHALL display archived units with greyed-out styling and an "ARCHIVED" badge on the unit page.

#### Scenario: Archived unit page shows grey styling
- **WHEN** an admin views an archived unit's detail page
- **THEN** the page SHALL have a grey background or border styling
- **AND** an "ARCHIVED" badge SHALL be displayed

### Requirement: Admin can unarchive a unit
The system SHALL allow admin users to unarchive a unit, restoring it to active status while preserving its compartment layout.

#### Scenario: Admin unarchives a unit
- **WHEN** an admin user clicks the "Unarchive" button on an archived unit
- **THEN** the unit's `archived_at` timestamp SHALL be set to null
- **AND** the unit SHALL reappear in the fleet panel
- **AND** all compartment configurations SHALL be preserved