## ADDED Requirements

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
