## ADDED Requirements

### Requirement: Time-to-complete is tracked per compartment
The system SHALL record the time duration from when a user opens a compartment form to when they submit it.

#### Scenario: Time recorded on submission
- **WHEN** user submits a compartment checkoff
- **THEN** the time-on-page duration is stored with the submission record

### Requirement: Average time-to-complete is calculated per employee
The admin dashboard SHALL display the average time-to-complete for each employee across all compartments.

#### Scenario: View employee average time
- **WHEN** admin views provider analytics
- **THEN** each employee's average time per compartment is displayed

### Requirement: Discrepancy rate is tracked per employee
The system SHALL track the rate at which an employee's entered quantities differ from the par level.

#### Scenario: Discrepancy rate calculated
- **WHEN** admin views provider analytics
- **THEN** each employee's discrepancy rate (items where count != par level) is displayed

### Requirement: Analytics are filterable by date range and unit
Provider analytics SHALL support filtering by date range and specific units.

#### Scenario: Filter analytics by date
- **WHEN** admin filters analytics to last 30 days
- **THEN** only data from the last 30 days is included in calculations

#### Scenario: Filter analytics by unit
- **WHEN** admin filters analytics to "Medic 1"
- **THEN** only data from Medic 1 checkoffs is included

### Requirement: Time-on-page data is used for analytics only
Time-on-page data SHALL NOT trigger automatic alerts or flag users - it is available for manual review only.

#### Scenario: Time data available for review
- **WHEN** admin views an employee's analytics
- **THEN** time-on-page data is displayed but no automated flags are shown
