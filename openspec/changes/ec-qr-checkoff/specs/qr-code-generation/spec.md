## ADDED Requirements

### Requirement: QR codes are generated for each compartment of a unit
The admin panel SHALL generate a QR code for each compartment of a unit, encoding the URL `/checkoff/{unit-id}/{compartment-id}`.

#### Scenario: Generate QR codes for a unit
- **WHEN** admin requests QR codes for a unit
- **THEN** a QR code is generated for each compartment of that unit

### Requirement: QR codes are printable as a formatted page
The generated QR codes SHALL be displayed in a printable layout with compartment labels and unit identification.

#### Scenario: Print QR code page
- **WHEN** admin clicks "Print QR Codes" for a unit
- **THEN** a formatted page opens with all compartment QR codes, labels, and unit name, ready for printing

### Requirement: QR codes can be exported as PDF
The QR code page SHALL support saving as a PDF file.

#### Scenario: Export QR codes as PDF
- **WHEN** admin selects "Save as PDF" for a unit's QR codes
- **THEN** a PDF file is generated with all compartment QR codes formatted for printing

### Requirement: QR codes include unit and compartment identification
Each printed QR code SHALL be labeled with the unit name and compartment name for physical identification.

#### Scenario: QR code label format
- **WHEN** a QR code is printed
- **THEN** it displays "Unit: EC1 | Compartment: Cab" beneath the QR image

### Requirement: QR codes can be regenerated
The admin panel SHALL allow regenerating QR codes for any unit, producing new codes with the same URLs.

#### Scenario: Regenerate QR codes
- **WHEN** admin regenerates QR codes for a unit
- **THEN** new QR codes are generated with the same URLs as before
