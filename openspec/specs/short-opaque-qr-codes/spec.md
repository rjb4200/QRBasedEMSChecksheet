## ADDED Requirements

### Requirement: QR URLs use short opaque codes
The system SHALL generate printed QR URLs using a short opaque code path `/q/{code}` instead of embedding internal unit, compartment, or unit kit UUIDs in the QR URL.

#### Scenario: Admin generates compartment QR
- **WHEN** an admin views or prints a QR code for a unit compartment
- **THEN** the QR URL SHALL use `/q/{code}`
- **AND** the QR URL SHALL NOT include the unit UUID
- **AND** the QR URL SHALL NOT include the compartment UUID

#### Scenario: Admin generates assigned kit QR
- **WHEN** an admin views or prints a QR code for an assigned unit kit
- **THEN** the QR URL SHALL use `/q/{code}`
- **AND** the QR URL SHALL NOT include the unit UUID
- **AND** the QR URL SHALL NOT include the unit kit UUID

### Requirement: QR codes are random and opaque
The system SHALL generate QR target codes as random opaque identifiers that do not reveal unit identity, target name, target type, station, or apparatus type.

#### Scenario: Person reads QR URL text
- **WHEN** a person reads the URL encoded in a printed QR code
- **THEN** the URL SHALL NOT reveal the unit name
- **AND** the URL SHALL NOT reveal the target name
- **AND** the URL SHALL NOT reveal whether the target is a compartment or assigned kit

#### Scenario: New QR target needs a code
- **WHEN** the system creates a QR target without an existing active code
- **THEN** the code SHALL be randomly generated
- **AND** the code SHALL use at least five characters by default
- **AND** the code SHALL avoid visually confusing characters where practical

### Requirement: QR target maps to exactly one checkoff target
The system SHALL store each QR target as an active or inactive mapping to exactly one unit compartment or exactly one assigned unit kit.

#### Scenario: QR target references compartment
- **WHEN** a QR target is created for a compartment
- **THEN** it SHALL include the parent unit
- **AND** it SHALL include the compartment target
- **AND** it SHALL NOT include an assigned unit kit target

#### Scenario: QR target references assigned kit
- **WHEN** a QR target is created for an assigned unit kit
- **THEN** it SHALL include the parent unit
- **AND** it SHALL include the assigned unit kit target
- **AND** it SHALL NOT include a compartment target

### Requirement: Active QR code resolves to existing checkoff flow
The system SHALL resolve active `/q/{code}` URLs to the existing checkoff flow for the mapped target without changing checkoff form behavior.

#### Scenario: Crew scans active compartment QR
- **WHEN** a crew member scans an active QR code mapped to a compartment
- **THEN** the system SHALL open the existing compartment checkoff flow for that unit and compartment
- **AND** checkoff submission behavior SHALL remain unchanged

#### Scenario: Crew scans active assigned kit QR
- **WHEN** a crew member scans an active QR code mapped to an assigned unit kit
- **THEN** the system SHALL open the existing assigned kit checkoff flow for that unit and unit kit assignment
- **AND** checkoff submission behavior SHALL remain unchanged

### Requirement: Invalid or inactive QR codes are handled generically
The system SHALL show a clear generic invalid QR page when a code is missing, invalid, inactive, or no longer references an available target.

#### Scenario: Crew opens invalid QR code
- **WHEN** a crew member opens `/q/{code}` for a code that does not exist
- **THEN** the system SHALL show an invalid or inactive QR code message
- **AND** the system SHALL NOT expose internal IDs
- **AND** the system SHALL NOT show database error details

#### Scenario: Crew opens inactive QR code
- **WHEN** a crew member opens `/q/{code}` for an inactive code
- **THEN** the system SHALL show an invalid or inactive QR code message
- **AND** the system SHALL NOT resolve to a checkoff form

### Requirement: QR generation automatically creates and reuses active target codes
The system SHALL automatically create a QR target code when one is missing and SHALL reuse an existing active QR target code for the same checkoff target afterward.

#### Scenario: Admin opens QR page for target without code
- **WHEN** an admin views or prints a QR code for a target that does not have an active QR target
- **THEN** the system SHALL automatically create an active QR target
- **AND** the system SHALL display the new short code
- **AND** the admin SHALL NOT need to manually generate a QR code before printing

#### Scenario: Admin reopens QR page
- **WHEN** an admin views the QR page for a target that already has an active QR target
- **THEN** the system SHALL display the existing active code
- **AND** the generated QR URL SHALL remain stable

#### Scenario: System generates duplicate random code
- **WHEN** a generated random code collides with an existing code
- **THEN** the system SHALL generate a different code and retry
- **AND** the system SHALL NOT create duplicate active code values

### Requirement: Admin can see assigned QR codes
The system SHALL allow admins to see the short code assigned to each QR target and the short URL used for QR printing.

#### Scenario: Admin views QR target
- **WHEN** an admin views a QR code for a compartment or assigned kit
- **THEN** the admin SHALL see the short code assigned to that target
- **AND** the admin SHALL see the `/q/{code}` URL used by the QR code

### Requirement: Scanner accepts short QR URLs
The system SHALL treat `/q/{code}` URLs as valid Winchester EMS checkoff QR codes in the camera scanner.

#### Scenario: Crew scans short QR URL
- **WHEN** the camera scanner decodes a URL whose path starts with `/q/`
- **THEN** the scanner SHALL navigate to the decoded `/q/{code}` path
- **AND** the resolver SHALL handle target lookup

#### Scenario: Crew scans unrelated QR URL
- **WHEN** the camera scanner decodes a URL that is not a supported checkoff QR path
- **THEN** the scanner SHALL show the existing invalid checkoff QR error behavior

### Requirement: Admin QR page displays plaintext checkoff URL per label
The admin QR page SHALL display the full `/q/{code}` checkoff URL as readable text alongside each QR code image.

#### Scenario: Admin views QR codes for a unit
- **WHEN** an admin views the QR page for a unit
- **THEN** each label SHALL show the plaintext URL below or alongside the QR image
- **AND** the URL SHALL match the URL encoded in the QR code

### Requirement: Admin QR page includes a Copy URL button per label
The admin QR page SHALL include a Copy URL button for each label that copies the checkoff URL to the system clipboard.

#### Scenario: Admin clicks Copy URL
- **WHEN** an admin clicks the Copy URL button for a compartment or kit label
- **THEN** the full checkoff URL SHALL be copied to the clipboard
- **AND** the button SHALL provide brief visual feedback that the copy succeeded

### Requirement: Admin QR page includes NFC tag programming guidance
The admin QR page SHALL include a compact guidance section explaining that the displayed URLs can be programmed into NFC tags for tap-to-open access.

#### Scenario: Admin sees NFC guidance
- **WHEN** an admin views the QR page for a unit
- **THEN** a guidance block SHALL recommend NTAG216 anti-metal tags (30mm+)
- **AND** the guidance SHALL explain that programming the URL into an NFC tag enables one-tap compartment access

### Requirement: Admin QR page supports 3x2 rotated label print format
The admin QR print page SHALL support a 3" × 2" rotated label layout accessible via a `format=3x2-rotated` query parameter.

#### Scenario: Admin selects 3x2 rotated format
- **WHEN** an admin navigates to the QR print page with `?format=3x2-rotated`
- **THEN** the page SHALL render a 5-row × 2-column grid of 3" × 2" label cells
- **AND** each label cell SHALL contain content rotated 90 degrees

#### Scenario: Default format unchanged
- **WHEN** an admin navigates to the QR print page without a format parameter
- **THEN** the existing default QR print grid SHALL render unchanged

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

### Requirement: Admin can select QR labels for printing
The admin QR label page SHALL display all available compartment and assigned-kit labels with controls that determine whether each label is included in standard and 3x2 print output.

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
The admin QR label page SHALL provide a Print Selected action that prints only labels currently selected for printing in both standard and 3x2 formats.

#### Scenario: Admin prints selected labels
- **WHEN** an admin activates Print Selected
- **THEN** print output SHALL include selected labels
- **AND** print output SHALL exclude unselected labels

#### Scenario: Admin prints with no selected labels
- **WHEN** an admin activates Print Selected while no labels are selected
- **THEN** the system SHALL show a clear "No labels selected." message
- **AND** the system SHALL NOT open an empty print dialog

### Requirement: Admin can print duplicate physical QR label copies
Each QR label SHALL provide a second-copy control that optionally prints one additional physical copy using the same QR target and encoded URL in both standard and 3x2 formats.

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

### Requirement: Rotated layout prints correctly at 100% scale
The rotated label layout SHALL print reliably at 100% scale on letter-size paper without browser scaling.

#### Scenario: Printing rotated labels
- **WHEN** an admin prints the 3x2 rotated layout
- **THEN** labels SHALL align to a 2-column × 5-row grid on letter paper
- **AND** QR codes SHALL remain scannable after printing
