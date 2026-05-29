## ADDED Requirements

### Requirement: Admin can access a Clear Records workflow from the Records page
The Records page SHALL provide a "Clear Records" workflow that allows admins to preview, export, confirm, and clear historical operational records for a selected date range.

#### Scenario: Clear Records interface appears on Records page
- **WHEN** an admin views the Records page
- **THEN** a "Clear Records" section SHALL be visible alongside the existing export buttons
- **AND** SHALL include date range inputs for selecting which records to preview and potentially clear

#### Scenario: Row count preview displayed before any action
- **WHEN** an admin selects a date range and clicks "Preview"
- **THEN** per-table row counts for the operational tables SHALL be displayed
- **AND** the counts SHALL update when the date range changes

#### Scenario: Existing exports remain available
- **WHEN** the Clear Records workflow is added
- **THEN** all existing export options (Simple CSV, Detailed CSV, Export Package, Print Daily Record) SHALL continue to function unchanged
