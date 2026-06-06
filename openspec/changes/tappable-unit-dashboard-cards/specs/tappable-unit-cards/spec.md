## ADDED Requirements

### Requirement: In-progress and completed cards navigate to checkoff on tap

Yellow (in-progress) and green (completed) status cards on the unit dashboard SHALL be wrapped in a Next.js `<Link>` that navigates to the checkoff form when tapped. Grey (not-started) cards SHALL remain non-interactive.

#### Scenario: Tapping an in-progress card opens checkoff

- **WHEN** user taps a yellow (in-progress) compartment or kit card
- **THEN** the browser SHALL navigate to the checkoff form for that target

#### Scenario: Tapping a completed card opens checkoff

- **WHEN** user taps a green (completed) compartment or kit card
- **THEN** the browser SHALL navigate to the checkoff form for that target

#### Scenario: Tapping a not-started card does nothing

- **WHEN** user taps a grey (not-started) card
- **THEN** no navigation SHALL occur

### Requirement: QR location reminder remains independently expandable

The QR location `<details>` element on a tappable card SHALL expand without triggering navigation.

#### Scenario: Tapping QR pin expands note, doesn't navigate

- **WHEN** user taps the QR location map-pin icon on a tappable card
- **THEN** the location note SHALL expand
- **AND** the browser SHALL NOT navigate to the checkoff page
