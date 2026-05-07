## ADDED Requirements

### Requirement: Printable check sheets include compact WFD branding
Printable daily check sheets SHALL include compact Winchester Fire Department branding while preserving existing checkoff content.

#### Scenario: Printing current daily check sheets
- **WHEN** a user prints daily check sheets
- **THEN** the print header SHALL include the WFD logo and Winchester Fire Department name
- **AND** the printed title SHALL identify the output as an EMS equipment check sheet
- **AND** existing unit, operational date, shift, crew, timing, check, issue, comment, and signature content SHALL remain unchanged
- **AND** the report SHALL remain readable if branding images fail to load

### Requirement: Archived printouts use same compact WFD branding
Archived or historical printable check sheet outputs SHALL use the same compact WFD print branding as current check sheet print-offs.

#### Scenario: Printing archived daily record
- **WHEN** a user prints or exports an archived daily unit checkoff report
- **THEN** the output SHALL include the WFD logo and Winchester Fire Department name in a compact header
- **AND** historical information SHALL remain the focus of the output
- **AND** no archive behavior or summary logic SHALL change

### Requirement: City seal is secondary in printed reports
The City of Winchester seal SHALL be used only as an optional secondary formal mark in printed outputs.

#### Scenario: City seal is included
- **WHEN** the City of Winchester seal appears in printed check sheets or archive reports
- **THEN** it SHALL appear only as a small footer mark or faint watermark
- **AND** it SHALL NOT replace the WFD logo as the primary print logo
- **AND** it SHALL NOT reduce black-and-white readability
