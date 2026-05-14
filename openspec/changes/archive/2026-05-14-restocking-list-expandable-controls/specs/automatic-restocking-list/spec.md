## ADDED Requirements

### Requirement: Restocking List is collapsed by default on the unit page
The Restocking List section on the unit page SHALL render in a collapsed state by default, showing only a compact header toggle, and SHALL NOT display a "Items Needing Attention" subtitle.

#### Scenario: Unit page loads with exceptions
- **WHEN** a user views a unit page with one or more exceptions
- **THEN** the Restocking List section SHALL display a collapsed toggle header
- **AND** the "Items Needing Attention" subtitle SHALL NOT be present
- **AND** the deficiency entries SHALL be hidden until the user expands the section

#### Scenario: User expands the Restocking List
- **WHEN** a user clicks or taps the collapsed Restocking List header
- **THEN** the section SHALL expand to show the grouped deficiency entries
- **AND** the section SHALL remain expanded until the user collapses it again

### Requirement: Restocking List includes Print and Copy actions when expanded
The Restocking List section SHALL include a Print button and a Copy-to-clipboard button, and both buttons SHALL be visible only when the section is expanded.

#### Scenario: Restocking List is collapsed
- **WHEN** the Restocking List is in its default collapsed state
- **THEN** Print and Copy buttons SHALL NOT be visible

#### Scenario: Restocking List is expanded
- **WHEN** the Restocking List is expanded
- **THEN** a Print button and a Copy button SHALL be visible near the top of the expanded content

#### Scenario: User clicks Print
- **WHEN** a user clicks the Print button inside the expanded Restocking List
- **THEN** the browser print dialog SHALL open

#### Scenario: User clicks Copy
- **WHEN** a user clicks the Copy button inside the expanded Restocking List
- **THEN** the Restocking List text SHALL be copied to the system clipboard
