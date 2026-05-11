## ADDED Requirements

### Requirement: Print all formats output for label sheet
The Print / Save as PDF function on the QR codes page SHALL produce output formatted for the Spartan Industrial S004 label sheet (6 labels per sheet, 3" × 3" each).

#### Scenario: Full-sheet print uses 2-column grid
- **WHEN** user clicks Print / Save as PDF
- **THEN** the print output SHALL use a 2-column × 3-row grid matching the S004 label layout

#### Scenario: Each label is exactly 3in × 3in
- **WHEN** the print output renders
- **THEN** each label SHALL be sized to exactly 3" × 3" to align with the label sheet

### Requirement: QR code sized for reliable scanning
The printed QR code on each label SHALL be large enough for reliable scanning through a plastic badge holder or lamination.

#### Scenario: QR code is ~2.25in
- **WHEN** the label prints
- **THEN** the QR code image SHALL be approximately 2.25" × 2.25"

### Requirement: Label text is compact
Each label SHALL display unit name and compartment/kit name in a compact font size to fit within the 3" × 3" label.

#### Scenario: Text uses small font
- **WHEN** the label prints
- **THEN** the unit name SHALL use approximately 12px font
- **AND** the compartment/kit name SHALL use approximately 12px font

### Requirement: Redundant text removed from print
The print output SHALL omit information that is encoded in the QR itself.

#### Scenario: Code text removed
- **WHEN** printing labels
- **THEN** the "Code:" label text SHALL NOT appear
- **AND** the full URL SHALL NOT appear

### Requirement: Individual print is unchanged
The Print This QR button for individual labels SHALL produce the same output as before this change.

#### Scenario: Single label print unaffected
- **WHEN** user clicks Print This QR for an individual label
- **THEN** the print output SHALL use the existing individual print format with the original layout, font sizes, and content
