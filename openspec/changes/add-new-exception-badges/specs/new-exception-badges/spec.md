## ADDED Requirements

### Requirement: NEW badge on exceptions panel
The system SHALL display a "NEW" badge on the exceptions panel for items that are below par today but were not exceptions in the last completed checkoff.

#### Scenario: New exception shows NEW badge
- **WHEN** an item is below par today but was at or above par in the last completed checkoff
- **THEN** a "NEW" badge SHALL be displayed next to that item on the exceptions panel

#### Scenario: Existing exception has no NEW badge
- **WHEN** an item is below par today and was also below par in the last completed checkoff
- **THEN** no "NEW" badge SHALL be displayed for that item

### Requirement: NEW badge on printouts
The system SHALL display a "NEW" badge on check sheet printouts for items that are new exceptions.

#### Scenario: Printout shows NEW badge
- **WHEN** generating a check sheet print for a unit with new exceptions
- **THEN** the "NEW" badge SHALL appear next to new exception items on the printed document

### Requirement: NEW badge only on current day
The system SHALL automatically remove the "NEW" badge on subsequent days.

#### Scenario: NEW badge drops off next day
- **WHEN** viewing the exceptions panel on a day after the exception first appeared
- **THEN** the "NEW" badge SHALL NOT be displayed
- **AND** the item SHALL appear as a regular (existing) exception if still below par

### Requirement: No previous check handling
The system SHALL treat all exceptions as "NEW" when there is no previous completed checkoff to compare against.

#### Scenario: No previous check means all NEW
- **WHEN** there is no previous completed checkoff for the unit
- **THEN** all current exceptions SHALL display the "NEW" badge