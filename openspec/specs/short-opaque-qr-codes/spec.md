## Purpose
Define short opaque QR codes, admin QR label printing, and QR/NFC access behavior for unit compartments and assigned kits.

## Requirements

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

### Requirement: Admin QR page supports Spartan S004 and Avery 94237 label formats
The admin QR print page SHALL provide two label format choices: the default Spartan S004 3" × 3" format and an Avery 94237 2" × 3" format accessible via the `format=3x2-rotated` query parameter.

#### Scenario: Admin selects Spartan S004 format
- **WHEN** an admin navigates to the QR print page without a format parameter
- **THEN** the page SHALL render the Spartan S004 3" × 3" label workflow
- **AND** the format tab SHALL identify it as Spartan S004 3×3 Labels

#### Scenario: Admin selects Avery 94237 format
- **WHEN** an admin navigates to the QR print page with `?format=3x2-rotated`
- **THEN** the page SHALL render the Avery 94237 label workflow
- **AND** the format tab SHALL identify it as Avery 94237 Labels

### Requirement: Admin can select capped QR labels for printing
The admin QR label page SHALL display all available compartment and assigned-kit labels with controls that determine whether each label is included in print output, while limiting each format to the physical label count supported by that sheet.

#### Scenario: Spartan QR label page loads
- **WHEN** an admin opens the Spartan S004 QR label page for a unit
- **THEN** all available QR labels SHALL be visible
- **AND** up to the first 6 physical labels SHALL default to selected for printing
- **AND** each label SHALL show a print-label selection control
- **AND** the page SHALL show the selected physical-label count as `N/6`

#### Scenario: Avery QR label page loads
- **WHEN** an admin opens the Avery 94237 QR label page for a unit
- **THEN** all available QR labels SHALL be visible
- **AND** up to the first 8 physical labels SHALL default to selected for printing
- **AND** each label SHALL show a print-label selection control
- **AND** the page SHALL show the selected physical-label count as `N/8`

#### Scenario: Admin deselects one label
- **WHEN** an admin turns off the print-label control for a label
- **THEN** that label SHALL remain visible on the page
- **AND** that label SHALL be excluded from print output
- **AND** the selected physical-label count SHALL decrease

### Requirement: Capped label formats prevent over-selection
The Spartan S004 and Avery 94237 print workflows SHALL prevent admins from selecting more physical labels than the current format supports, including duplicate physical copies.

#### Scenario: Spartan selection limit is reached
- **WHEN** 6 Spartan S004 physical labels are selected
- **THEN** selecting another unselected label SHALL be disabled or blocked
- **AND** enabling a second copy that would exceed 6 physical labels SHALL be disabled or blocked
- **AND** the page SHALL show a warning that Spartan S004 3x3 supports up to 6 physical labels per print

#### Scenario: Avery selection limit is reached
- **WHEN** 8 Avery 94237 physical labels are selected
- **THEN** selecting another unselected label SHALL be disabled or blocked
- **AND** enabling a second copy that would exceed 8 physical labels SHALL be disabled or blocked
- **AND** the page SHALL show a warning that Avery 94237 supports up to 8 physical labels per print

### Requirement: Admin can deselect all QR labels
The admin QR label page SHALL provide a page-level control to deselect all labels in capped label formats.

#### Scenario: Admin deselects all labels
- **WHEN** an admin activates Deselect All
- **THEN** every available label SHALL become deselected for printing
- **AND** the selected physical-label count SHALL become zero

#### Scenario: Capped format omits Select All
- **WHEN** an admin views the Spartan S004 or Avery 94237 label format
- **THEN** the page SHALL NOT show a Select All control

### Requirement: Admin can print selected QR labels
The admin QR label page SHALL provide a Print Selected action that prints only labels currently selected for printing in both Spartan S004 and Avery 94237 formats.

#### Scenario: Admin prints selected labels
- **WHEN** an admin activates Print Selected
- **THEN** print output SHALL include selected labels
- **AND** print output SHALL exclude unselected labels

#### Scenario: Admin prints with no selected labels
- **WHEN** an admin activates Print Selected while no labels are selected
- **THEN** the system SHALL show a clear "No labels selected." message
- **AND** the system SHALL NOT open an empty print dialog

### Requirement: Admin can print duplicate physical QR label copies
Each QR label SHALL provide a second-copy control that optionally prints one additional physical copy using the same QR target and encoded URL in both Spartan S004 and Avery 94237 formats.

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
- **AND** both physical copies SHALL count toward the current format's physical-label limit

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

### Requirement: Spartan S004 labels print on a fixed letter-size template
The Spartan S004 QR label print output SHALL use a fixed letter-size sheet with six absolute-positioned 3" × 3" label cells.

#### Scenario: Printing Spartan S004 labels
- **WHEN** an admin prints the Spartan S004 format at 100% scale with browser headers and footers off
- **THEN** print output SHALL use a letter-size page with zero page margin
- **AND** labels SHALL align to two columns and three rows of 3" × 3" cells
- **AND** QR codes SHALL remain scannable after printing

#### Scenario: Spartan printed label content renders
- **WHEN** a Spartan S004 label prints
- **THEN** each label SHALL show a QR code sized approximately 2.18" × 2.18"
- **AND** the unit name and target name SHALL appear below the QR code
- **AND** visible `/q/{code}` text SHALL NOT appear on the printed label

### Requirement: Avery 94237 labels print on a fixed letter-size template
The Avery 94237 QR label print output SHALL use a fixed letter-size sheet with eight absolute-positioned 3" × 2" label cells containing rotated content.

#### Scenario: Printing Avery 94237 labels
- **WHEN** an admin prints the Avery 94237 format at 100% scale with browser headers and footers off
- **THEN** print output SHALL use a letter-size page with zero page margin
- **AND** labels SHALL align to two columns and four rows of 3" × 2" cells
- **AND** QR codes SHALL remain scannable after printing

#### Scenario: Avery printed label content renders
- **WHEN** an Avery 94237 label prints
- **THEN** each label SHALL contain content rotated 90 degrees
- **AND** each label SHALL show a QR code sized approximately 1.92" × 1.92"
- **AND** the unit name and target name SHALL appear with the QR code
- **AND** visible `/q/{code}` text SHALL NOT appear on the printed label

#### Scenario: QR code still encodes URL
- **WHEN** a printed Spartan S004 or Avery 94237 label omits visible `/q/{code}` text
- **THEN** the QR code SHALL still encode the full valid checkoff URL
- **AND** scanning the QR code SHALL resolve through the existing `/q/{code}` lookup flow
