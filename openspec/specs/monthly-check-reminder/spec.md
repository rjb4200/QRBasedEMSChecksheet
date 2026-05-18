## Purpose
Define the monthly check reminder banner that alerts crews when a unit's configured monthly check day arrives.

## Requirements

### Requirement: Admin can configure monthly check day
The system SHALL allow admins to set a monthly check day for each unit from the admin unit edit form.

#### Scenario: Admin sets monthly check day
- **WHEN** an admin enters a value from 1 to 31 in the monthly check day field and saves
- **THEN** the value SHALL be saved to the unit record

#### Scenario: Admin clears monthly check day
- **WHEN** an admin clears the monthly check day field and saves
- **THEN** the value SHALL be saved as null and no reminder SHALL appear

#### Scenario: Invalid value rejected
- **WHEN** an admin enters 0 or 32
- **THEN** the save SHALL be rejected with a validation error

### Requirement: Reminder banner on unit check sheet
The system SHALL display a monthly check reminder banner at the top of the unit check sheet page when today is the unit's configured monthly check day.

#### Scenario: Today matches monthly check day
- **WHEN** the current local day of the month equals the unit's monthly_check_day
- **THEN** an amber reminder banner SHALL appear at the top of the unit check sheet page

#### Scenario: No monthly check day configured
- **WHEN** the unit has no monthly_check_day set
- **THEN** no banner SHALL appear

### Requirement: Reminder banner on compartment check pages
The system SHALL display the same monthly check reminder banner at the top of each compartment check page for that unit.

#### Scenario: Compartment page shows banner
- **WHEN** a crew member opens a compartment check page for a unit whose monthly check is due today
- **THEN** the reminder banner SHALL appear at the top of the page

### Requirement: Short month handling
The system SHALL display the monthly check reminder on the last day of the month when the configured day exceeds the month's length.

#### Scenario: Day 31 in a 30-day month
- **WHEN** the unit is configured for day 31 and the month has 30 days
- **THEN** the banner SHALL appear on day 30

#### Scenario: Day 31 in February
- **WHEN** the unit is configured for day 31 and it is February
- **THEN** the banner SHALL appear on the last day of February (28 or 29)
