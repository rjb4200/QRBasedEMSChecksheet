## ADDED Requirements

### Requirement: Unit list is the main entry point
The app root SHALL redirect to `/units` so the crew unit selector is the primary page.

#### Scenario: User opens app root
- **WHEN** any user opens `/`
- **THEN** the app redirects to `/units`

### Requirement: Admin dashboard is linked for approved admins
The public unit list SHALL show an Admin Dashboard button only to signed-in users with Admin role.

#### Scenario: Approved admin opens unit list
- **WHEN** an authenticated admin opens `/units`
- **THEN** an Admin Dashboard button is displayed

#### Scenario: Unauthenticated crew opens unit list
- **WHEN** an unauthenticated crew member opens `/units`
- **THEN** no Admin Dashboard button is displayed

### Requirement: App supports Add to Home Screen
The PWA SHALL support installation to the device home screen with an app icon and splash screen.

#### Scenario: User adds app to home screen
- **WHEN** user selects "Add to Home Screen" in the browser
- **THEN** the app icon is added to the device home screen and launches as a standalone app

### Requirement: App is mobile-first responsive
The PWA SHALL be optimized for mobile device screens with responsive layouts for tablets and desktops.

#### Scenario: Mobile layout renders correctly
- **WHEN** user opens the app on a mobile device
- **THEN** the UI is optimized for the screen size with touch-friendly controls

### Requirement: Camera integration for QR scanning
The PWA SHALL request camera permission and integrate QR code scanning within the app.

#### Scenario: Camera permission requested
- **WHEN** user taps the "Scan" button for the first time
- **THEN** the browser requests camera permission

#### Scenario: QR scanning works within app
- **WHEN** user grants camera permission and points at a QR code
- **THEN** the QR code is detected and the app navigates to the encoded URL

### Requirement: App works in standalone mode
When launched from the home screen, the app SHALL run in standalone mode without browser chrome.

#### Scenario: App launches standalone
- **WHEN** user opens the app from the home screen
- **THEN** the app runs without browser navigation bars or address bar

### Requirement: App manifest includes required metadata
The PWA manifest SHALL include app name, short name, theme color, background color, icons, and display mode.

#### Scenario: PWA manifest is valid
- **WHEN** browser evaluates the PWA manifest
- **THEN** all required metadata fields are present and valid
