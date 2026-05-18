## Purpose
The daily email PDF attachment is generated using the same archive daily record data as the archive print page, ensuring consistency between the archive print view and the daily email report.

## Requirements

### Requirement: Daily email PDF uses archive printout data
The system SHALL generate the daily email PDF attachment using the same archive daily record data as the archive print page at `/admin/archives/print`.

#### Scenario: PDF data matches archive print page
- **WHEN** the daily email PDF is generated for a report date
- **THEN** the PDF SHALL include the same units, unit statuses, check states, exceptions, crew names, and comments as the archive print page for that date

### Requirement: PDF uses landscape table layout matching print page
The system SHALL render the daily email PDF in landscape letter format with a table layout showing unit service status, check status, sections completed/total, exceptions, comments, and crew names.

#### Scenario: PDF table contains all columns
- **WHEN** the daily email PDF is generated
- **THEN** the PDF SHALL include a table with columns for unit name, service status, check status, sections, exceptions, comments, and crew
- **AND** the table SHALL use landscape letter page size

### Requirement: PDF includes WFD branding
The system SHALL include Winchester Fire Department branding in the daily email PDF matching the archive print page.

#### Scenario: PDF has WFD branding
- **WHEN** the daily email PDF is generated
- **THEN** the PDF header SHALL include the WFD logo and Winchester Fire Department name
- **AND** the PDF SHALL remain readable if branding images fail to load

### Requirement: PDF filename uses archive naming convention
The system SHALL name the daily email PDF attachment `daily-check-archive-YYYY-MM-DD.pdf`.

#### Scenario: PDF filename is generated
- **WHEN** the daily email PDF is generated for a report date
- **THEN** the attachment filename SHALL be `daily-check-archive-{date}.pdf`

### Requirement: PDF generation shares data with archive print page
The system SHALL use the same shared data builder for the archive print page and the daily email PDF generator.

#### Scenario: Print page and email PDF use common data
- **WHEN** both the archive print page and daily email PDF are generated for the same date
- **THEN** both SHALL use the same record data from `getDailyUnitRecords`

### Requirement: PDF generation failure prevents email send
The system SHALL not send a daily report email if PDF generation fails.

#### Scenario: PDF generation fails
- **WHEN** the daily report job cannot generate the archive-style PDF
- **THEN** the system SHALL not send the email
- **AND** the system SHALL record the failure in `daily_email_report_runs`

### Requirement: Existing cron and recipient behavior unchanged
The daily email report cron route, recipient selection, and Resend setup SHALL remain unchanged.

#### Scenario: Daily email sends with new PDF
- **WHEN** the daily email cron route executes successfully
- **THEN** the email SHALL use the same cron schedule, authorization, recipient list, and Resend configuration as before
