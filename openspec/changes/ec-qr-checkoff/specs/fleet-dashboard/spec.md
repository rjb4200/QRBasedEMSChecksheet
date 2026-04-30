## ADDED Requirements

### Requirement: Fleet matrix displays all units in a grid
The admin dashboard SHALL display a top-level Fleet page showing all units with their real-time compartment completion status for the current checkoff day.

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

### Requirement: Real-time status via page refresh or polling
The fleet matrix SHALL update unit statuses periodically via page refresh or automatic polling.

#### Scenario: Status updates on polling interval
- **WHEN** the polling interval elapses (every 30 seconds)
- **THEN** the fleet matrix refreshes with current completion data

### Requirement: Fleet page displays submitted item exceptions
The admin Fleet page SHALL display submitted checkoff items that are unchecked or below their configured par count for the current checkoff day.

#### Scenario: Checkbox submitted unchecked
- **WHEN** a completed compartment checkoff includes a checkbox item saved as unchecked
- **THEN** the Fleet page exceptions panel lists the unit, compartment, item, and unchecked issue

#### Scenario: Quantity submitted below par
- **WHEN** a completed compartment checkoff includes a quantity item below its configured par level
- **THEN** the Fleet page exceptions panel lists the unit, compartment, item, submitted quantity, and expected par count
