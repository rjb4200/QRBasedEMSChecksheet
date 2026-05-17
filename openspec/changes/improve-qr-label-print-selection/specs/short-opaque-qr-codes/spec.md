## ADDED Requirements

### Requirement: Admin can select QR labels for printing
The admin QR label page SHALL display all available compartment and assigned-kit labels with controls that determine whether each label is included in print output.

#### Scenario: QR label page loads
- **WHEN** an admin opens the QR label page for a unit
- **THEN** all available QR labels SHALL be visible
- **AND** every label SHALL default to selected for printing
- **AND** each label SHALL show a print-label selection control

#### Scenario: Admin deselects one label
- **WHEN** an admin turns off the print-label control for a label
- **THEN** that label SHALL remain visible on the page
- **AND** that label SHALL be excluded from print output

### Requirement: Admin can select or deselect all QR labels
The admin QR label page SHALL provide page-level controls to select all labels and deselect all labels.

#### Scenario: Admin selects all labels
- **WHEN** an admin activates Select All
- **THEN** every available label SHALL become selected for printing

#### Scenario: Admin deselects all labels
- **WHEN** an admin activates Deselect All
- **THEN** every available label SHALL become deselected for printing

### Requirement: Admin can print selected QR labels
The admin QR label page SHALL provide a Print Selected action that prints only labels currently selected for printing.

#### Scenario: Admin prints selected labels
- **WHEN** an admin activates Print Selected
- **THEN** print output SHALL include selected labels
- **AND** print output SHALL exclude unselected labels

#### Scenario: Admin prints with no selected labels
- **WHEN** an admin activates Print Selected while no labels are selected
- **THEN** the system SHALL show a clear "No labels selected." message
- **AND** the system SHALL NOT open an empty print dialog

### Requirement: Admin can print duplicate physical QR label copies
Each QR label SHALL provide a second-copy control that optionally prints one additional physical copy using the same QR target and encoded URL.

#### Scenario: Selected label without second copy
- **WHEN** a label is selected
- **AND** its second-copy control is off
- **THEN** print output SHALL include one physical copy for that label

#### Scenario: Selected label with second copy
- **WHEN** a label is selected
- **AND** its second-copy control is on
- **THEN** print output SHALL include two physical copies for that label
- **AND** both physical copies SHALL encode the same URL
- **AND** both physical copies SHALL reference the same QR target

#### Scenario: Deselected label with second copy enabled
- **WHEN** a label is deselected
- **AND** its second-copy control is on
- **THEN** print output SHALL include zero physical copies for that label

### Requirement: Duplicate copies do not create QR targets
Printing a second physical copy SHALL NOT create a new QR target, QR code record, or database mapping.

#### Scenario: Admin enables second copy
- **WHEN** an admin enables second copy for a label
- **THEN** the existing QR code image and encoded URL SHALL be reused
- **AND** no new QR target SHALL be created for the duplicate physical label

### Requirement: Selected QR labels paginate as physical labels
The 3x2 QR label print output SHALL paginate the rendered physical label list, including duplicate copies, at 10 labels per letter-size page.

#### Scenario: Duplicate copies fill a sheet
- **WHEN** 8 labels are selected
- **AND** 2 selected labels have second copy enabled
- **THEN** print output SHALL contain 10 physical labels
- **AND** those physical labels SHALL fit on one 3x2 label sheet

#### Scenario: More than 10 physical labels print
- **WHEN** the selected labels and duplicate copies produce more than 10 physical labels
- **THEN** print output SHALL start a new sheet after every 10 physical labels
- **AND** labels SHALL NOT overlap page breaks

## MODIFIED Requirements

### Requirement: Rotated label uses 2x2 QR with identifying text
Each 3x2 rotated label SHALL display a QR code filling a ~2" × 2" area with the unit name and compartment/kit name in the remaining strip, so that when the label is peeled off and held upright the QR is at the top with the name underneath. Printed 3x2 labels SHALL NOT display visible `/q/{code}` text.

#### Scenario: Label content renders
- **WHEN** the 3x2 rotated label layout is active
- **THEN** each label SHALL show a QR code sized approximately 2" × 2"
- **AND** the unit name and target name SHALL appear in the remaining 1" strip
- **AND** visible `/q/{code}` text SHALL NOT appear on the printed label
- **AND** when the label is turned upright, the QR SHALL appear at the top with text below it

#### Scenario: QR code still encodes URL
- **WHEN** a printed label omits visible `/q/{code}` text
- **THEN** the QR code SHALL still encode the full valid checkoff URL
- **AND** scanning the QR code SHALL resolve through the existing `/q/{code}` lookup flow
