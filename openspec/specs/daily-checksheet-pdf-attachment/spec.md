## ADDED Requirements

### Requirement: Daily report includes checksheet PDF attachment
The system SHALL attach a PDF containing all unit check sheets for the report date to the daily email report.

#### Scenario: Report email with attachment
- **WHEN** the daily report email sends successfully
- **THEN** the email SHALL include a PDF attachment named `daily-checksheets-{date}.pdf`

### Requirement: PDF uses existing checksheet document data
The PDF attachment SHALL use the same daily checksheet document data rules as the existing printable checksheet page.

#### Scenario: Generate PDF for report date
- **WHEN** the system generates the daily checksheet PDF for a date
- **THEN** the PDF SHALL include all units included by the existing daily checksheet document logic for that date

### Requirement: PDF preserves three-column print layout
The PDF attachment SHALL preserve the existing printable checksheet layout, including one unit per page and three-column compartment/item layout.

#### Scenario: PDF layout generation
- **WHEN** the daily checksheet PDF is generated
- **THEN** each unit SHALL render as a separate print page
- **AND** compartments/items SHALL use the three-column printable layout
- **AND** exceptions SHALL be visually emphasized

### Requirement: PDF generation failure prevents partial report send
The system SHALL not send a daily report email if required PDF generation fails.

#### Scenario: PDF generation fails
- **WHEN** the daily report job cannot generate the required PDF attachment
- **THEN** the system SHALL not send the email
- **AND** the system SHALL log or record the failure

### Requirement: n8n-oriented PDF assumptions are removed
The PDF attachment generation SHALL be owned by the app's daily report flow rather than an n8n workflow.

#### Scenario: Daily report PDF generation path
- **WHEN** the daily report needs a checksheet PDF
- **THEN** the app SHALL generate or retrieve the PDF without requiring n8n
