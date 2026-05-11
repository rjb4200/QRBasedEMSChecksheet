## ADDED Requirements

### Requirement: Print button opens PDF and triggers print dialog
The monthly check banner SHALL include a Print button that opens the monthly check form PDF and triggers the browser's print dialog.

#### Scenario: Crew clicks Print
- **WHEN** a crew member clicks the Print button in the banner
- **THEN** the PDF SHALL open in a new window
- **AND** the browser print dialog SHALL open automatically

### Requirement: Download link for manual saving
The monthly check banner SHALL include a Download link for the monthly check form PDF.

#### Scenario: Crew clicks Download
- **WHEN** a crew member clicks the Download link in the banner
- **THEN** the PDF SHALL open for viewing or download in the browser

### Requirement: PDF served same-origin via API proxy
An API route SHALL proxy the monthly check PDF from its external host to the app's origin.

#### Scenario: API route returns PDF
- **WHEN** a request is made to `/api/monthly-check-form`
- **THEN** the response SHALL be a PDF with `Content-Type: application/pdf`
