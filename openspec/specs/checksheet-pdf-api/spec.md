## Requirements

### Requirement: Print API Returns Today's Checksheet
The API endpoint `/api/checksheets/print` SHALL return a PDF of today's completed checksheet when called without parameters.

#### Scenario: Default request returns today's checksheet
- **WHEN** a GET request is made to `/api/checksheets/print`
- **THEN** the response SHALL be a PDF of today's checksheet with all completed units

### Requirement: Print API Supports Date Parameter
The API endpoint SHALL accept a `date` query parameter in ISO 8601 format (YYYY-MM-DD) to return a specific day's checksheet.

#### Scenario: Date parameter returns historical checksheet
- **WHEN** a GET request is made to `/api/checksheets/print?date=2026-05-01`
- **THEN** the response SHALL be a PDF of the checksheet for May 1, 2026

### Requirement: Print API Supports Unit Filtering
The API endpoint SHALL accept a `unitIds` query parameter as a comma-separated list of unit IDs to filter which units are included.

#### Scenario: Unit IDs filter included units
- **WHEN** a GET request is made to `/api/checksheets/print?unitIds=1,2,3`
- **THEN** the response SHALL be a PDF containing only units with IDs 1, 2, and 3

### Requirement: PDF Response Headers
The API SHALL return proper HTTP headers for PDF consumption by n8n.

#### Scenario: Correct content type and disposition
- **WHEN** a successful request is made
- **THEN** the response SHALL have `Content-Type: application/pdf`
- **AND** the response SHALL have `Content-Disposition: inline; filename="checksheet-YYYY-MM-DD.pdf"`

### Requirement: API Handles Empty Results
The API SHALL return an appropriate response when no checkoff data exists for the requested date.

#### Scenario: No data for date returns empty or error
- **WHEN** a GET request is made for a date with no checkoffs
- **THEN** the response SHALL either return a PDF with "No checkoffs found" message or return an appropriate error

### Requirement: Combined Parameters Work Together
The API SHALL accept multiple query parameters simultaneously.

#### Scenario: Date and unitIds combined
- **WHEN** a GET request is made to `/api/checksheets/print?date=2026-05-01&unitIds=1,2`
- **THEN** the response SHALL be a PDF of unit 1 and 2's checkoffs for May 1, 2026