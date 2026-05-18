## Purpose
QR codes page renders print-ready label layouts for Spartan Industrial S004 3×3 and Avery 94237 3×2 label sheets.

## Requirements

### Requirement: QR label formats output for physical label sheets
The QR codes page SHALL provide print output formatted for the Spartan Industrial S004 3" × 3" label sheet and the Avery 94237 2" × 3" label sheet.

#### Scenario: Spartan S004 format is selected
- **WHEN** the user opens the QR codes page without a label-format query parameter
- **THEN** the page SHALL render the Spartan S004 3×3 label format
- **AND** print output SHALL target six 3" × 3" labels on a letter-size sheet

#### Scenario: Avery 94237 format is selected
- **WHEN** the user opens the QR codes page with `?format=3x2-rotated`
- **THEN** the page SHALL render the Avery 94237 label format
- **AND** print output SHALL target eight 3" × 2" labels on a letter-size sheet

### Requirement: Label print selection is capped by sheet capacity
The QR label print controls SHALL limit selected physical labels to the current sheet capacity, counting duplicate copies as physical labels.

#### Scenario: Spartan S004 reaches capacity
- **WHEN** six physical labels are selected in the Spartan S004 format
- **THEN** selecting another label SHALL be disabled or blocked
- **AND** enabling a duplicate copy that would exceed six physical labels SHALL be disabled or blocked

#### Scenario: Avery 94237 reaches capacity
- **WHEN** eight physical labels are selected in the Avery 94237 format
- **THEN** selecting another label SHALL be disabled or blocked
- **AND** enabling a duplicate copy that would exceed eight physical labels SHALL be disabled or blocked

### Requirement: Spartan S004 print layout uses fixed physical positions
The Spartan S004 print output SHALL use a letter-size page with zero page margin and absolute-positioned 3" × 3" label cells.

#### Scenario: Spartan S004 labels print
- **WHEN** the print output renders
- **THEN** labels SHALL align to two columns and three rows
- **AND** each label SHALL be sized to 3" × 3"
- **AND** the QR code SHALL be approximately 2.18" × 2.18"
- **AND** the unit name and target name SHALL fit inside the label
- **AND** visible code text and full URL text SHALL NOT appear on the printed label

### Requirement: Avery 94237 print layout uses fixed physical positions
The Avery 94237 print output SHALL use a letter-size page with zero page margin and absolute-positioned 3" × 2" label cells with rotated label content.

#### Scenario: Avery 94237 labels print
- **WHEN** the print output renders
- **THEN** labels SHALL align to two columns and four rows
- **AND** each label cell SHALL be sized to 3" × 2"
- **AND** each label's content SHALL be rotated 90 degrees
- **AND** the QR code SHALL be approximately 1.92" × 1.92"
- **AND** visible code text and full URL text SHALL NOT appear on the printed label
