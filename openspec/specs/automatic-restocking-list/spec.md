## Purpose
Define the automatically generated Restocking List that summarizes unit deficiencies from existing check data without creating a separate inventory system.

## Requirements

### Requirement: Restocking List is generated from existing exceptions
The system SHALL generate a Restocking List from existing unit check exception rules for quantity, checkbox, and condition item values.

#### Scenario: Quantity item below par
- **WHEN** a checked quantity item has a value below its par level
- **THEN** the Restocking List SHALL include the item with deficiency text such as "Below par: 2 of 6"

#### Scenario: Checkbox item is not checked
- **WHEN** a checked checkbox item has a failed value
- **THEN** the Restocking List SHALL include the item with deficiency text such as "Missing"

#### Scenario: Condition item is not OK
- **WHEN** a checked condition item has a non-OK status
- **THEN** the Restocking List SHALL include the item with deficiency text such as "Condition issue"

### Requirement: Restocking List groups deficiencies by source section
The system SHALL group Restocking List entries by compartment or assigned kit source name.

#### Scenario: Compartment and kit exceptions exist
- **WHEN** a unit has exceptions from compartments and assigned kits
- **THEN** the Restocking List SHALL show both source types in one list grouped by source name
- **AND** assigned kit exceptions SHALL be associated with the unit kit assignment being checked

#### Scenario: Duplicate equipment exists in multiple sources
- **WHEN** the same equipment item has exceptions in multiple compartments or kits
- **THEN** each exception SHALL appear independently under its own source section

### Requirement: Restocking List is hidden when empty
The system SHALL hide the Restocking List when no active exceptions exist.

#### Scenario: No exceptions exist
- **WHEN** all checked item values satisfy their requirements
- **THEN** the Restocking List SHALL NOT render an empty section or placeholder

### Requirement: Partial checkoffs only use checked data
The system SHALL generate Restocking List entries only from completed or in-progress check data and SHALL NOT assume unchecked items are missing.

#### Scenario: Unit has unchecked sections
- **WHEN** a unit has compartments or kits with no current check data
- **THEN** the Restocking List SHALL ignore those unchecked sections
- **AND** the system SHALL NOT fabricate missing-item entries for them

### Requirement: Restocking List updates during checkoff
The system SHALL update the visible Restocking List dynamically as checkoff item values change.

#### Scenario: User fixes an exception
- **WHEN** a user changes a deficient item value to a passing value
- **THEN** the item SHALL be removed from the visible Restocking List immediately

#### Scenario: User creates an exception
- **WHEN** a user changes an item value to a deficient value
- **THEN** the item SHALL appear in the visible Restocking List immediately

### Requirement: Restocking List uses shared normalization
The system SHALL use shared exception normalization for Restocking List display across unit pages, printouts, PDF/email outputs, and historical records.

#### Scenario: Same exception appears on multiple surfaces
- **WHEN** the same item deficiency is displayed on the unit page and in a printed or PDF checksheet
- **THEN** the source name, item name, and deficiency text SHALL be consistent

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
- **THEN** a new window SHALL open containing only the restocking checklist content
- **AND** the browser print dialog SHALL open for that checklist window
- **AND** the full unit page SHALL NOT be printed

#### Scenario: User clicks Copy
- **WHEN** a user clicks the Copy button inside the expanded Restocking List
- **THEN** the Restocking List text SHALL be copied to the system clipboard

### Requirement: Restocking List checkboxes are interactive
The Restocking List SHALL render a checkbox for each deficiency entry and SHALL preserve the existing expand/collapse, Print, and Copy behavior.

#### Scenario: Restocking List has entries
- **WHEN** a crew member views an expanded Restocking List with deficiencies
- **THEN** each entry SHALL display a checkbox alongside the item name and deficiency text
- **AND** Print, Copy, and the collapse toggle SHALL remain functional

#### Scenario: Addressed items show checked state
- **WHEN** a Restocking List entry has been marked as addressed
- **THEN** the checkbox SHALL render as checked on all devices viewing the same unit after polling propagates the state

### Requirement: Restocking List placement on unit page
The Restocking List SHALL appear immediately below the page header, above the crew signature (CrewNameLock) section.

#### Scenario: Unit page renders with exceptions
- **WHEN** a user views a unit page with one or more exceptions
- **THEN** the Restocking List SHALL appear between the header and CrewNameLock
- **AND** CrewNameLock, status cards, Section Comments, and Daily Unit Comments SHALL follow in that order
