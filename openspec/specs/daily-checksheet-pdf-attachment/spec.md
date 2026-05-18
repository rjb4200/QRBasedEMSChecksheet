## Purpose
The daily report email includes an archive-style daily ledger PDF attachment generated from the same archive daily record data as the archive print page.

## Requirements

### Requirement: Daily report includes checksheet PDF attachment
The system SHALL attach an archive-style daily ledger PDF for the report date to the daily email report.

#### Scenario: Report email with attachment
- **WHEN** the daily report email sends successfully
- **THEN** the email SHALL include a PDF attachment named `daily-check-archive-{date}.pdf`

### Requirement: PDF uses existing checksheet document data
The PDF attachment SHALL use the same archive daily record data as the archive print page at `/admin/archives/print`.

#### Scenario: Generate PDF for report date
- **WHEN** the system generates the daily archive PDF for a date
- **THEN** the PDF SHALL include all units, statuses, check states, exceptions, crew names, and comments from the archive daily record data for that date

### Requirement: PDF preserves three-column print layout
The PDF attachment SHALL use a landscape letter table layout matching the archive print page content rather than per-unit three-column compartment layouts.

#### Scenario: PDF layout generation
- **WHEN** the daily archive PDF is generated
- **THEN** the PDF SHALL render as a landscape table with columns for unit service, check status, sections, exceptions, comments, and crew
- **AND** the PDF SHALL include WFD branding in the header

### Requirement: PDF generation failure prevents partial report send
The system SHALL not send a daily report email if required PDF generation fails.

#### Scenario: PDF generation fails
- **WHEN** the daily report job cannot generate the required PDF attachment
- **THEN** the system SHALL not send the email
- **AND** the system SHALL log or record the failure
