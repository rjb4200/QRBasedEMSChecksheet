## ADDED Requirements

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
