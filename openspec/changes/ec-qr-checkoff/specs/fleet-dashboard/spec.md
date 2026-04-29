## ADDED Requirements

### Requirement: Fleet matrix displays all units in a grid
The admin dashboard SHALL display a grid showing all units with their real-time compartment completion status.

#### Scenario: All units visible in fleet matrix
- **WHEN** admin opens the fleet dashboard
- **THEN** all units are displayed in a grid with their current status

### Requirement: Each unit shows compartment completion percentage
Each unit in the fleet matrix SHALL display the percentage of compartments completed for the current shift.

#### Scenario: Unit shows completion percentage
- **WHEN** admin views the fleet matrix
- **THEN** each unit displays "X of Y compartments completed (Z%)"

### Requirement: Units can be toggled In-Service or Out-of-Service
The admin dashboard SHALL provide a toggle to set each unit's status to "In-Service" or "Out-of-Service."

#### Scenario: Admin toggles unit to Out-of-Service
- **WHEN** admin sets a unit to "Out-of-Service"
- **THEN** the unit is excluded from shift reset and email alert checks

#### Scenario: Admin toggles unit to In-Service
- **WHEN** admin sets a unit to "In-Service"
- **THEN** the unit is included in shift reset and email alert checks

### Requirement: Fleet matrix filters by unit type and shift
The fleet dashboard SHALL allow filtering units by type (EC, Medic) and current/past shifts.

#### Scenario: Filter by unit type
- **WHEN** admin selects "Medic" filter
- **THEN** only medic units are displayed

#### Scenario: Filter by shift
- **WHEN** admin selects a past shift
- **THEN** the fleet matrix shows completion status for that shift

### Requirement: Real-time status via page refresh or polling
The fleet matrix SHALL update unit statuses periodically via page refresh or automatic polling.

#### Scenario: Status updates on polling interval
- **WHEN** the polling interval elapses (every 30 seconds)
- **THEN** the fleet matrix refreshes with current completion data
