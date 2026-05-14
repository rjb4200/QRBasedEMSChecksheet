## ADDED Requirements

### Requirement: Unit checksheets display Restocking List below Unit Comments
Unit checksheets SHALL display a Restocking List below the Daily Unit Comments section when current unit exceptions exist.

#### Scenario: Unit checksheet has exceptions
- **WHEN** a user views a unit checksheet with one or more current exceptions
- **THEN** the page SHALL show a `Restocking List` section below `Daily Unit Comments`
- **AND** the section SHALL list deficiencies grouped by compartment or assigned kit source name

#### Scenario: Unit checksheet has no exceptions
- **WHEN** a user views a unit checksheet with no current exceptions
- **THEN** the page SHALL NOT display a Restocking List section

#### Scenario: Unit comments are empty but exceptions exist
- **WHEN** the unit has no saved Daily Unit Comments but has current exceptions
- **THEN** the Restocking List SHALL still display below the comment editor area
