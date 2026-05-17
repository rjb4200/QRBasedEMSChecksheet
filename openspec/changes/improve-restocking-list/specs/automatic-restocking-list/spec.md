## MODIFIED Requirements

### Requirement: Restocking List is hidden when empty
The system SHALL hide the Restocking List when no active exceptions and no manual restock items exist.

#### Scenario: No exceptions and no manual items exist
- **WHEN** all checked item values satisfy their requirements and no manual items have been added
- **THEN** the Restocking List SHALL NOT render an empty section or placeholder

#### Scenario: No exceptions but manual items exist
- **WHEN** all checked item values satisfy their requirements but manual restock items have been added
- **THEN** the Restocking List SHALL render and show the manual items

### Requirement: Restocking List is collapsed by default on the unit page
The Restocking List section on the unit page SHALL render in a collapsed state by default, showing only a compact header bar with the section title on the left and action controls (Add, Share, Copy, Print) plus an expand/collapse indicator on the right.

#### Scenario: Unit page loads with exceptions or manual items
- **WHEN** a user views a unit page with one or more exceptions or manual items
- **THEN** the Restocking List section SHALL display a collapsed header bar
- **AND** the header bar SHALL show "Restocking List" on the left
- **AND** the header bar SHALL show Add, Share, Copy, and Print icon buttons plus the expand/collapse indicator on the right
- **AND** the deficiency entries and manual items SHALL be hidden until the user expands the section

#### Scenario: User expands the Restocking List
- **WHEN** a user clicks or taps the collapsed Restocking List header
- **THEN** the section SHALL expand to show the grouped deficiency entries and manual items
- **AND** the section SHALL remain expanded until the user collapses it again

### Requirement: Restocking List includes Print, Copy, and Share actions
The Restocking List header bar SHALL include compact icon-style Add, Share, Copy, and Print buttons. Each button SHALL have an accessible label.

#### Scenario: Restocking List header bar renders
- **WHEN** the Restocking List section renders in either collapsed or expanded state
- **THEN** the header bar SHALL display Add, Share, Copy, and Print icon buttons on the right
- **AND** each icon button SHALL include an accessible aria-label

#### Scenario: User clicks Print
- **WHEN** a user clicks the Print icon button in the Restocking List header
- **THEN** a new window SHALL open containing the restocking checklist content including both generated exception entries and manual items
- **AND** the browser print dialog SHALL open for that checklist window
- **AND** the full unit page SHALL NOT be printed

#### Scenario: User clicks Copy
- **WHEN** a user clicks the Copy icon button in the Restocking List header
- **THEN** the Restocking List text including both generated exception entries and manual items SHALL be copied to the system clipboard

#### Scenario: User clicks Share on supported browser
- **WHEN** a user clicks the Share icon button in the Restocking List header
- **AND** the Web Share API is available
- **THEN** the native share dialog SHALL open with the Restocking List text including generated exceptions and manual items
- **AND** the shared content SHALL include the unit name when available

#### Scenario: User clicks Share on unsupported browser
- **WHEN** a user clicks the Share icon button in the Restocking List header
- **AND** the Web Share API is NOT available
- **THEN** the Restocking List text SHALL be copied to the clipboard
- **AND** the user SHALL see brief "Copied" feedback

#### Scenario: User clicks Add
- **WHEN** a user clicks the Add icon button in the Restocking List header
- **AND** the section is expanded
- **THEN** an inline form SHALL appear for entering a manual restock item

#### Scenario: Add button when collapsed
- **WHEN** a user clicks the Add icon button in the Restocking List header
- **AND** the section is collapsed
- **THEN** the section SHALL expand and the inline Add form SHALL appear

## ADDED Requirements

### Requirement: Manual restock items appear alongside generated entries
The Restocking List SHALL display manual restock items in a separate "Manual" source grouping alongside auto-generated exception groups.

#### Scenario: Both exception and manual items exist
- **WHEN** the Restocking List is expanded and both generated exceptions and manual items exist
- **THEN** manual items SHALL appear in a group titled "Manual" below the generated exception groups
- **AND** manual items SHALL include addressed checkboxes

#### Scenario: Only manual items exist
- **WHEN** the Restocking List is expanded and only manual items exist with no generated exceptions
- **THEN** only the "Manual" group SHALL appear
- **AND** the Restocking List SHALL still render
