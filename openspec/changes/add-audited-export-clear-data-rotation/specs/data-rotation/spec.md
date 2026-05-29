## ADDED Requirements

### Requirement: Admin previews row counts before clearing records
The system SHALL display per-table row counts for historical operational records within a selected date range before any export or clear action.

#### Scenario: Preview counts for a date range
- **WHEN** an admin selects a date range and requests a clear preview
- **THEN** the system SHALL display the number of rows in each operational table for that date range

#### Scenario: Preview shows zero when range has no records
- **WHEN** an admin selects a date range with no historical records
- **THEN** the system SHALL display zero counts for all operational tables

### Requirement: Export must succeed before clearing is allowed
The system SHALL require a successful ZIP export (Phase 2 export package) before presenting the clear confirmation step.

#### Scenario: Export succeeds, clear gate opens
- **WHEN** an admin triggers the export for a date range
- **AND** the ZIP is generated successfully with the expected files
- **THEN** the system SHALL present the slide-to-confirm gate for clearing

#### Scenario: Export fails, clearing is blocked
- **WHEN** an admin triggers the export for a date range
- **AND** the ZIP generation fails or produces an empty archive
- **THEN** the system SHALL display an error and SHALL NOT present the clear confirmation gate

### Requirement: Slide-to-confirm gate before clearing
The system SHALL require the admin to complete a slide-to-confirm interaction before any records are cleared.

#### Scenario: Admin slides to confirm
- **WHEN** the slide-to-confirm gate is presented after a successful export
- **AND** the admin slides the control fully to the confirmed position
- **THEN** the "Clear Records" button SHALL become enabled

#### Scenario: Admin releases slider before completion
- **WHEN** the admin begins sliding the confirm control
- **AND** releases the slider before reaching the confirmed position
- **THEN** the slider SHALL snap back to the unconfirmed position
- **AND** the "Clear Records" button SHALL remain disabled

### Requirement: Clearing is transactional and all-or-nothing
The system SHALL clear historical operational records using a database transaction that either completes fully or rolls back entirely.

#### Scenario: All tables cleared successfully
- **WHEN** the admin confirms clearing for a date range
- **THEN** the system SHALL delete rows from compartment_checks, shift_archives, daily_unit_ledgers, daily_unit_crews, daily_unit_comments, daily_section_comments, daily_restock_items, and daily_email_report_runs within the date range
- **AND** SHALL NOT leave a partial state where some tables are cleared and others are not

#### Scenario: Clear operation fails mid-way
- **WHEN** a delete operation encounters an error
- **THEN** the system SHALL roll back all deletes from the transaction
- **AND** no records SHALL be cleared from any table

### Requirement: Configuration data is never cleared
The system SHALL NOT delete rows from any configuration table regardless of date range or filter selection.

#### Scenario: Configuration tables excluded from clearing
- **WHEN** the admin triggers a clear operation
- **THEN** the following tables SHALL remain untouched: units, unit_compartments, unit_compartment_items, unit_compartment_item_groups, equipment_catalog, kits, kit_items, kit_item_groups, unit_kits, templates, template_compartments, template_compartment_items, qr_targets, shift_calendar, users, user_roles, admin_users

### Requirement: Today's shift records are never eligible for clearing
The system SHALL exclude records belonging to the current operational shift date from any clear operation, regardless of the selected date range.

#### Scenario: Selected range includes today
- **WHEN** an admin selects a date range where the "to" date equals or exceeds today's shift date
- **THEN** the system SHALL reject the range and inform the admin that today's shift records cannot be cleared

#### Scenario: Selected range ends yesterday or earlier
- **WHEN** an admin selects a date range where the "to" date is strictly before today's shift date
- **THEN** the system SHALL allow the clear operation to proceed

### Requirement: Maximum date range of 60 days
The system SHALL reject clear operations with a date range exceeding 60 days.

#### Scenario: Range exceeds 60 days
- **WHEN** an admin selects a from-to range spanning more than 60 days
- **THEN** the system SHALL display an error and SHALL NOT proceed with export or clearing

#### Scenario: Range is 60 days or fewer
- **WHEN** an admin selects a from-to range of 60 days or fewer
- **THEN** the system SHALL allow the operation to proceed

### Requirement: Every rotation action is audited
The system SHALL log every successful and failed clear operation to the system_logs table.

#### Scenario: Successful clear is logged
- **WHEN** a clear operation completes successfully
- **THEN** a system_logs entry SHALL be created with action "rotate_records", area "data_rotation", result "success", and metadata containing the export ID, date range, unit filter, and per-table cleared counts

#### Scenario: Failed clear is logged
- **WHEN** a clear operation fails at any stage
- **THEN** a system_logs entry SHALL be created with action "rotate_records", area "data_rotation", result "failure", and message describing the error

### Requirement: Unit filter scopes the clear operation
The system SHALL support an optional unit filter that scopes the clear operation to records for a specific unit.

#### Scenario: Clear with unit filter
- **WHEN** an admin selects a unit filter and triggers a clear operation
- **THEN** only records associated with that unit_id SHALL be cleared within the date range

#### Scenario: Clear without unit filter
- **WHEN** an admin does not select a unit filter and triggers a clear operation
- **THEN** records for all units SHALL be cleared within the date range
