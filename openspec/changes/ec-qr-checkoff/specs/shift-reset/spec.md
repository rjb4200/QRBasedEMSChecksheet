## ADDED Requirements

### Requirement: Shift windows are defined as 06:00-18:00 and 18:00-06:00
The system SHALL define two shift windows per calendar day: Day shift (06:00 to 18:00) and Night shift (18:00 to 06:00 next day).

#### Scenario: Day shift window
- **WHEN** current time is between 06:00 and 17:59
- **THEN** the active shift is the day shift

#### Scenario: Night shift window
- **WHEN** current time is between 18:00 and 05:59
- **THEN** the active shift is the night shift

### Requirement: Completed checks are archived at shift reset
At each shift reset time (06:00 and 18:00), all compartments with Green (completed) status SHALL be archived to the shift history.

#### Scenario: Green checks archived at 06:00
- **WHEN** the 06:00 shift reset occurs
- **THEN** all completed compartments from the night shift are saved to archive

### Requirement: In-progress checks are saved as partially complete
At each shift reset time, all compartments with Yellow (in-progress) status SHALL be saved as "partially complete" with all entered data preserved.

#### Scenario: Yellow checks saved as partial at 18:00
- **WHEN** the 18:00 shift reset occurs
- **THEN** all in-progress compartments are saved with status "partially complete" and all entered data

### Requirement: New shift starts with fresh Grey status
After a shift reset, all compartments for in-service units SHALL start with Grey (not started) status for the new shift.

#### Scenario: All compartments reset to Grey
- **WHEN** a new shift begins after reset
- **THEN** all compartments display as Grey for all in-service units

### Requirement: Previous shift completion summary is visible
The new shift's dashboard SHALL display a summary of what the previous shift completed (e.g., "18 of 25 compartments done").

#### Scenario: Completion summary shown to new shift
- **WHEN** user opens the unit dashboard at the start of a new shift
- **THEN** a summary shows how many compartments were completed by the previous shift

### Requirement: Shift reset runs automatically via scheduled job
The shift reset process SHALL be triggered automatically by a scheduled job at 06:00 and 18:00.

#### Scenario: Scheduled reset executes at 06:00
- **WHEN** the system clock reaches 06:00
- **THEN** the shift reset job executes

#### Scenario: Scheduled reset executes at 18:00
- **WHEN** the system clock reaches 18:00
- **THEN** the shift reset job executes
