## ADDED Requirements

### Requirement: Completed and partial shift data is archived
At each shift reset, all compartment checkoff data (completed and partial) SHALL be stored in a historical archive.

#### Scenario: Completed data archived at shift reset
- **WHEN** the 06:00 shift reset occurs
- **THEN** all Green compartments from the previous daily checkoff are saved to the archive with their data

#### Scenario: Partial data archived at shift reset
- **WHEN** the 06:00 shift reset occurs
- **THEN** all Yellow compartments are saved to the archive with status "partially complete"

### Requirement: Archive is queryable by date range and unit
The admin interface SHALL allow querying archived shift data by date range and unit.

#### Scenario: Query by date range
- **WHEN** admin searches for records from 2026-04-01 to 2026-04-15
- **THEN** all archived shifts in that range are returned

#### Scenario: Query by unit
- **WHEN** admin filters by unit "EC3"
- **THEN** all archived shifts for EC3 are returned

### Requirement: Admin can view daily fleet checkoff records
The admin interface SHALL provide a past checkoff records view that defaults to the last 14 days and displays one expandable row per day.

#### Scenario: Admin opens past checkoff records
- **WHEN** admin opens the records page without filters
- **THEN** the system displays daily fleet summary rows for the last 14 days

#### Scenario: Daily row summarizes fleet completion
- **WHEN** a day has four complete in-service units out of five in-service units
- **THEN** the daily row displays "4/5" as the completion summary

#### Scenario: Daily row uses saved unit ledger
- **WHEN** admin views a historical day
- **THEN** the in-service unit denominator comes from the saved daily unit ledger for that day, not the current units table

#### Scenario: No ledger exists for a historical day
- **WHEN** a day has no saved unit ledger rows
- **THEN** the daily row displays "0/0" and indicates that no unit ledger was saved for that day

#### Scenario: Daily row shows unit status bubbles
- **WHEN** admin views a daily row
- **THEN** the row displays one status-colored bubble for each unit included in the current filter

#### Scenario: Daily row expands to unit details
- **WHEN** admin expands a daily row
- **THEN** the system displays each unit's unit status, compartment count, completed compartments, completion percentage, record status, and archive detail link when available

#### Scenario: Unit-day has no archive
- **WHEN** a unit has no archive row for a date in the selected range
- **THEN** the expanded daily details still include that unit/date and mark it as "No record"

#### Scenario: Admin filters past records
- **WHEN** admin selects a date range or unit filter
- **THEN** the daily summary rows and expanded details update to only include matching unit-day records

### Requirement: Admin can export past checkoff records to CSV
The admin interface SHALL allow exporting the selected past checkoff records to simple or detailed CSV formats.

#### Scenario: Export simple filtered records
- **WHEN** admin clicks "Simple CSV" on the records page
- **THEN** the system downloads a CSV containing each visible unit-day record with date, unit, status, check counts, crew names, crew lock status, completion percentage, and archive ID when available

#### Scenario: Export detailed filtered records
- **WHEN** admin clicks "Detailed CSV" on the records page
- **THEN** the system downloads a CSV containing the selected date range's unit, crew names, compartment, item, submitted value, expected value, check status, item status, and completion timestamp details

#### Scenario: Records completion includes crew lock
- **WHEN** admin views historical Records for a unit-day
- **THEN** locked crew names count as one completed check and unlocked crew names do not count toward 100% completion

### Requirement: Admin can print historical daily check sheets
The admin interface SHALL allow printing the same compact daily check sheet document from historical Records data.

#### Scenario: Print historical daily check sheets
- **WHEN** admin clicks "Print Check Sheets" for a daily record
- **THEN** the system opens a print-ready two-column daily check sheet document for that historical date

### Requirement: Archive viewer displays historical shift data
The admin interface SHALL provide an archive viewer that displays historical compartment checkoff data in a readable format.

#### Scenario: View historical shift details
- **WHEN** admin selects an archived shift
- **THEN** all compartment data and timestamps for that shift are displayed

### Requirement: Partial completions are marked in archive
Archived shifts that were not fully completed SHALL be marked as "Partially Complete" with the completion percentage.

#### Scenario: Partial shift marked in archive
- **WHEN** admin views an archived shift with incomplete compartments
- **THEN** the shift is labeled "Partially Complete (18/25 compartments)"
