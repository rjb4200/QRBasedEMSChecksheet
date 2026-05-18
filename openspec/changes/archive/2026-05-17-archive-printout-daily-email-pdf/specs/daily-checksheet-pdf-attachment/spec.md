## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: n8n-oriented PDF assumptions are removed
**Reason**: n8n assumptions were already removed in the prior spec; this requirement is absorbed into the current PDF generation flow.

**Migration**: No migration needed; the app already generates PDFs directly.
