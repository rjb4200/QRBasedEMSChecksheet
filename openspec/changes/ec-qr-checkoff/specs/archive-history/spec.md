## ADDED Requirements

### Requirement: Completed and partial shift data is archived
At each shift reset, all compartment checkoff data (completed and partial) SHALL be stored in a historical archive.

#### Scenario: Completed data archived at shift reset
- **WHEN** the 06:00 shift reset occurs
- **THEN** all Green compartments from the previous daily checkoff are saved to the archive with their data

#### Scenario: Partial data archived at shift reset
- **WHEN** the 06:00 shift reset occurs
- **THEN** all Yellow compartments are saved to the archive with status "partially complete"

### Requirement: Archive is queryable by date range, unit, and user
The admin interface SHALL allow querying archived shift data by date range, unit, and user.

#### Scenario: Query by date range
- **WHEN** admin searches for records from 2026-04-01 to 2026-04-15
- **THEN** all archived shifts in that range are returned

#### Scenario: Query by unit
- **WHEN** admin filters by unit "EC3"
- **THEN** all archived shifts for EC3 are returned

#### Scenario: Query by user
- **WHEN** admin filters by user "John Doe"
- **THEN** all archived shifts where John Doe performed checkoffs are returned

### Requirement: Admin can view last-year daily unit records
The admin interface SHALL provide a past checkoff records view that defaults to the last 365 days and includes one row for each unit on each day.

#### Scenario: Admin opens past checkoff records
- **WHEN** admin opens the records page without filters
- **THEN** the system displays daily records for every unit for the last year

#### Scenario: Unit-day has no archive
- **WHEN** a unit has no archive row for a date in the selected range
- **THEN** the records table still includes that unit/date and marks it as "No record"

#### Scenario: Admin filters past records
- **WHEN** admin selects a date range or unit filter
- **THEN** the records table updates to only include matching unit-day records

### Requirement: Admin can export past checkoff records to CSV
The admin interface SHALL allow exporting the selected past checkoff records to CSV.

#### Scenario: Export filtered records
- **WHEN** admin clicks "Export CSV" on the records page
- **THEN** the system downloads a CSV containing each visible unit-day record with date, unit, status, compartment counts, completion percentage, and archive ID when available

### Requirement: Archive viewer displays historical shift data
The admin interface SHALL provide an archive viewer that displays historical compartment checkoff data in a readable format.

#### Scenario: View historical shift details
- **WHEN** admin selects an archived shift
- **THEN** all compartment data, user signatures, and timestamps for that shift are displayed

### Requirement: Partial completions are marked in archive
Archived shifts that were not fully completed SHALL be marked as "Partially Complete" with the completion percentage.

#### Scenario: Partial shift marked in archive
- **WHEN** admin views an archived shift with incomplete compartments
- **THEN** the shift is labeled "Partially Complete (18/25 compartments)"
