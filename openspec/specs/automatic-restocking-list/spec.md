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
