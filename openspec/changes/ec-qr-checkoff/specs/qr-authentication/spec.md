## ADDED Requirements

### Requirement: QR codes encode compartment checkoff URLs
Each physical QR code SHALL encode a URL in the format `/checkoff/{unit-id}/{compartment-id}` that navigates directly to the checkoff form for that specific compartment.

#### Scenario: User scans QR for a valid compartment
- **WHEN** user scans a QR code on a unit
- **THEN** the app navigates to the checkoff form for that unit and compartment

#### Scenario: QR code encodes correct URL format
- **WHEN** a QR code is generated for compartment "Cab" on unit "EC1"
- **THEN** the encoded URL is `/checkoff/ec1/cab`

### Requirement: No manual navigation links to checkoff forms in the UI
The crew UI SHALL NOT provide any clickable links, buttons, or navigation paths to compartment checkoff forms except through the QR scanner.

#### Scenario: Compartment grid buttons are non-clickable
- **WHEN** user views the compartment status grid
- **THEN** compartment status indicators are displayed as non-interactive elements

#### Scenario: Only scan button provides access to forms
- **WHEN** user wants to open a compartment form
- **THEN** the only UI element to do so is the global "Scan" button

### Requirement: QR scanner uses device camera
The QR scanner SHALL use the device camera to read QR codes and navigate to the encoded URL.

#### Scenario: Camera opens on scan button tap
- **WHEN** user taps the global "Scan" button
- **THEN** the device camera opens with a QR code scanning overlay

#### Scenario: Valid QR code navigates to form
- **WHEN** camera detects a valid compartment QR code
- **THEN** the app navigates to the corresponding checkoff form

#### Scenario: Invalid QR code shows error
- **WHEN** camera detects a QR code not matching the expected format
- **THEN** an error message is displayed and the user remains on the scan screen

### Requirement: Unit must be in-service to access checkoff
The system SHALL only allow checkoff access for units marked as "In-Service."

#### Scenario: Scanning QR for out-of-service unit
- **WHEN** user scans a QR code for a unit marked "Out-of-Service"
- **THEN** an error message indicates the unit is not in service
