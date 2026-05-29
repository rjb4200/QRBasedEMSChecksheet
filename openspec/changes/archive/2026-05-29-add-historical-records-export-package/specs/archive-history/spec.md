## ADDED Requirements

### Requirement: Admin can select a date range and trigger an export package from the Records page
The Records page SHALL provide a date range selector and an "Export Package" button that triggers generation of a downloadable ZIP archive for the selected range.

#### Scenario: Export Package button appears on Records page
- **WHEN** an admin views the Records page
- **THEN** an "Export Package" button SHALL be visible alongside the existing "Simple CSV" and "Detailed CSV" export buttons

#### Scenario: Date range selection for export package
- **WHEN** an admin selects a "from" and "to" date for the export package
- **THEN** the export package SHALL include all records with operational dates between and including the selected from and to dates

#### Scenario: Existing exports remain unchanged
- **WHEN** the export package feature is added
- **THEN** the "Simple CSV" and "Detailed CSV" links SHALL continue to function using the existing single-date filter
- **AND** the "Print Daily Record" button SHALL continue to function using the existing single-date filter
- **AND** the `/admin/exceptions/export` route SHALL remain unchanged

#### Scenario: Export package respects unit filter
- **WHEN** an admin selects a specific unit in the Records page filter and triggers an export package
- **THEN** the export package SHALL use the selected unitId as a filter for the generated CSVs
