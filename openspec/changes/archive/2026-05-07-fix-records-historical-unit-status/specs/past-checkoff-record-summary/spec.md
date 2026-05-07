## ADDED Requirements

### Requirement: Fallback excludes units without historical records
The system SHALL NOT include units in historical summaries solely because they are currently in service.

#### Scenario: Ledger missing, current units have check data
- **WHEN** no daily unit ledger rows exist for a date
- **AND** current in-service units have compartment_check rows for that date
- **THEN** the daily summary SHALL include only those units that have check or archive rows for that specific date
- **AND** the daily summary SHALL NOT include units that have no historical data for that date

### Requirement: Use unknown status when historical status unavailable
The system SHALL mark unit status as "unknown" when historical status cannot be determined.

#### Scenario: Unit has checks but no ledger or archive
- **WHEN** a unit has compartment_check rows for a date but no ledger or archive rows
- **THEN** the unit status SHALL be marked as "unknown"
- **AND** the unit SHALL NOT count toward in-service totals

### Requirement: Only date-specific records build fallback summaries
The system SHALL build fallback summaries only from records that exist for the specific date.

#### Scenario: Building fallback for missing-ledger date
- **WHEN** no daily_unit_ledgers exist for a date
- **THEN** the system SHALL collect units from compartment_checks, shift_archives, and daily_unit_crews for ONLY that date
- **AND** the system SHALL NOT iterate over all current units