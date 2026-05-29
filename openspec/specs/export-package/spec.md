## ADDED Requirements

### Requirement: Admin generates a downloadable export package for a date range
The system SHALL generate a ZIP archive containing CSV exports, printable PDF check sheets, and a structured manifest for a selected historical date range.

#### Scenario: Export package includes simple and detailed CSVs
- **WHEN** an admin requests an export package for a date range
- **THEN** the ZIP archive SHALL contain a simple CSV with each visible unit-day record (date, unit, status, check counts, crew names, crew lock status, completion percentage, and archive ID when available)
- **AND** the ZIP archive SHALL contain a detailed CSV with per-compartment and per-item data for each day in the range

#### Scenario: Export package includes printable PDF check sheets
- **WHEN** an admin requests an export package for a date range
- **THEN** the ZIP archive SHALL contain one PDF file per day using the existing pdfkit check sheet renderer
- **AND** each PDF SHALL include WFD branding, a summary grid, and a table of all unit records for that day

#### Scenario: Export package includes exceptions CSV
- **WHEN** an admin requests an export package for a date range
- **THEN** the ZIP archive SHALL contain a CSV of all checkoff exceptions (discrepancies, missing items, below-par quantities, condition issues) for the date range

### Requirement: Export package includes a manifest index file
The export package SHALL include a `manifest.json` file at the root of the ZIP archive describing the export contents.

#### Scenario: Manifest records date range and counts
- **WHEN** an export package is generated
- **THEN** the manifest SHALL include the selected date range (from and to), the number of dates included, the total number of records, and the total number of exceptions

#### Scenario: Manifest records unit information
- **WHEN** an export package is generated
- **THEN** the manifest SHALL list each unit included with its ID, name, record count for that range, and associated archive identifiers when available

#### Scenario: Manifest records export metadata
- **WHEN** an export package is generated
- **THEN** the manifest SHALL include a unique export identifier (UUID), the ISO 8601 generation timestamp, and a listing of all files contained in the archive with their filenames

#### Scenario: Manifest records contents listing
- **WHEN** an export package is generated
- **THEN** the manifest SHALL contain a `contents` section enumerating all files in the archive grouped by type (csv, pdfs, manifest)

### Requirement: Export package is delivered as a streamed ZIP download
The system SHALL stream the export package as a downloadable ZIP file with an appropriate Content-Disposition header.

#### Scenario: ZIP download with correct filename
- **WHEN** an admin requests an export package for date range 2026-05-01 to 2026-05-15
- **THEN** the response SHALL include a Content-Disposition header with filename `checkoff-export-2026-05-01-to-2026-05-15.zip`
- **AND** the Content-Type SHALL be `application/zip`

#### Scenario: ZIP is not stored on the server
- **WHEN** an export package is generated and streamed to the client
- **THEN** no temporary ZIP files SHALL remain on the server filesystem after the response completes

### Requirement: Export package respects date range and unit filtering
The export package SHALL only include records within the specified date range and, when provided, filtered to a specific unit.

#### Scenario: Unit filter restricts CSVs
- **WHEN** an admin requests an export package with a specific unitId
- **THEN** the simple and detailed CSVs SHALL only include records for that unit
- **AND** PDF files SHALL still include all units for each day (matching existing pdfkit renderer behavior)

#### Scenario: No unit filter includes all units
- **WHEN** an admin requests an export package without a unitId
- **THEN** all CSVs and PDFs SHALL include all units with records in the date range

### Requirement: Export package generation does not modify any database records
The export package workflow SHALL be fully read-only and SHALL NOT delete, update, or modify any database records.

#### Scenario: No records altered after export
- **WHEN** an export package is generated for any date range
- **THEN** all database tables (compartment_checks, daily_unit_ledgers, shift_archives, daily_unit_crews, daily_unit_comments, daily_section_comments, daily_restock_items) SHALL remain unchanged
