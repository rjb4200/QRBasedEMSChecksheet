## ADDED Requirements

### Requirement: Completed and partial shift data is archived
At each shift reset, all compartment checkoff data (completed and partial) SHALL be stored in a historical archive.

#### Scenario: Completed data archived at shift reset
- **WHEN** the 06:00 shift reset occurs
- **THEN** all Green compartments from the night shift are saved to the archive with their data

#### Scenario: Partial data archived at shift reset
- **WHEN** the 18:00 shift reset occurs
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
