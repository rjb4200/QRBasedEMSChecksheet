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
