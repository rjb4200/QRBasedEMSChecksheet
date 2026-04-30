## ADDED Requirements

### Requirement: Daily checkoff window starts at 06:00
The system SHALL define one daily checkoff window beginning at 06:00 and ending at 05:59 the next calendar day.

#### Scenario: Daily window after 06:00
- **WHEN** current time is between 06:00 and 23:59
- **THEN** the active checkoff date is the current calendar day

#### Scenario: Daily window before 06:00
- **WHEN** current time is between 00:00 and 05:59
- **THEN** the active checkoff date is the previous calendar day

### Requirement: Completed checks are archived at shift reset
At the daily reset time (06:00), all compartments with Green (completed) status SHALL be archived to history.

#### Scenario: Green checks archived at 06:00
- **WHEN** the 06:00 shift reset occurs
- **THEN** all completed compartments from the previous daily checkoff are saved to archive

### Requirement: Unit ledger is saved at shift reset
At the daily reset time, the system SHALL save a ledger snapshot of every unit for the day being closed, including unit id, unit name, unit status, and total compartment count.

#### Scenario: Unit status snapshot is saved
- **WHEN** the 06:00 shift reset occurs
- **THEN** the system saves one daily ledger row for each unit with that unit's status at reset time

#### Scenario: Out-of-service unit affects history forward only
- **WHEN** a unit is set out of service before a reset
- **THEN** future daily ledger rows save that unit as out of service without changing prior daily ledger rows

#### Scenario: Deleted or added units do not break historical records
- **WHEN** a unit is deleted or a new unit is added after a ledger day is saved
- **THEN** prior daily records continue to display from the saved ledger snapshot rather than the current units table

### Requirement: In-progress checks are saved as partially complete
At the daily reset time, all compartments with Yellow (in-progress) status SHALL be saved as "partially complete" with all entered data preserved.

#### Scenario: Yellow checks saved as partial at 06:00
- **WHEN** the 06:00 shift reset occurs
- **THEN** all in-progress compartments are saved with status "partially complete" and all entered data

### Requirement: New shift starts with fresh Grey status
After the daily reset, all compartments for in-service units SHALL start with Grey (not started) status for the new daily checkoff.

#### Scenario: All compartments reset to Grey
- **WHEN** a new daily checkoff begins after reset
- **THEN** all compartments display as Grey for all in-service units

### Requirement: Previous shift completion summary is visible
The dashboard SHALL display a summary of what the previous daily checkoff completed (e.g., "18 of 25 compartments done").

#### Scenario: Completion summary shown to new shift
- **WHEN** user opens the unit dashboard after the daily reset
- **THEN** a summary shows how many compartments were completed by the previous daily checkoff

### Requirement: Shift reset runs automatically via scheduled job
The shift reset process SHALL be triggered automatically by a scheduled job at 06:00.

#### Scenario: Scheduled reset executes at 06:00
- **WHEN** the system clock reaches 06:00
- **THEN** the shift reset job executes
