## ADDED Requirements

### Requirement: Branding assets use committed Winchester image sources
The system SHALL use the committed Winchester branding image sources for WFD branding.

#### Scenario: Runtime branding references source assets
- **WHEN** WFD branding is added to the app
- **THEN** the primary source image SHALL be `images/WFD_Logo_1848.jpg`
- **AND** the City seal source SHALL be `images/City of winchester Seal.png`
- **AND** the implementation SHALL NOT reference nonexistent `/public/branding/` paths

#### Scenario: Images need web-served derivatives
- **WHEN** Next.js cannot serve or import the committed `images/` files directly for a target surface
- **THEN** the implementation SHALL create or generate runtime assets from the committed source images
- **AND** the runtime assets SHALL remain traceable to the committed source images

### Requirement: Browser tab uses WFD-derived icon
The system SHALL use the WFD logo or a WFD-derived asset as the browser tab icon.

#### Scenario: App loads in browser
- **WHEN** a user opens qrCheckoff in a browser
- **THEN** the browser tab icon SHALL display the WFD logo or a WFD-derived favicon
- **AND** the app title SHALL remain readable
- **AND** favicon work SHALL NOT cause visible page layout changes

### Requirement: Login page displays WFD identity
The login page SHALL identify qrCheckoff as a Winchester Fire Department equipment check system.

#### Scenario: Login page renders
- **WHEN** a user views the login page
- **THEN** the page SHALL display the WFD logo with descriptive alt text
- **AND** the page SHALL include Winchester Fire Department and qrCheckoff identity text
- **AND** the login form SHALL remain the primary focus
- **AND** the layout SHALL remain usable on mobile

### Requirement: Main app header includes compact WFD logo
The main app header SHALL include compact WFD branding without reducing operational usability.

#### Scenario: Header renders
- **WHEN** a user views the main app header or top navigation
- **THEN** the header SHALL show a small WFD logo near the app name
- **AND** the logo SHALL have descriptive alt text
- **AND** the logo SHALL NOT crowd buttons, menus, unit controls, or fleet panel controls
- **AND** the header SHALL remain usable on mobile

### Requirement: Branding remains visual-only
The WFD branding change SHALL NOT alter operational behavior or data handling.

#### Scenario: Branding is implemented
- **WHEN** WFD branding is added
- **THEN** the implementation SHALL NOT change database schema, authentication, QR behavior, checkoff workflow, fleet panel logic, unit status tracking, archive logic, reporting logic, label behavior, or admin feature scope

### Requirement: Logos are placed sparingly
The system SHALL avoid excessive logo placement that adds visual clutter.

#### Scenario: Operational pages render
- **WHEN** unit cards, compartment cards, item rows, labels, QR scan flows, buttons, modals, or table rows render
- **THEN** those surfaces SHALL NOT receive additional decorative logo placement as part of this change
