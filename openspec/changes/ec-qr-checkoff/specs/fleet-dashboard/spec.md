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

### Requirement: Fleet page can print daily check sheets
The admin Fleet page SHALL provide a print action for the current daily check sheets in a compact two-column print layout intended to fit a daily packet on front/back letter pages.

#### Scenario: Print current daily check sheets
- **WHEN** admin clicks "Print Today's Check Sheets" on the Fleet page
- **THEN** the system opens a print-ready document containing all units, compartments, check statuses, and submitted item values for the current daily checkoff

#### Scenario: Daily check sheets use compact print layout
- **WHEN** the print-ready daily check sheets render
- **THEN** the document uses a two-column layout with print CSS for letter paper and compact typography

### Requirement: Fleet page displays submitted item exceptions by date
The admin Fleet page SHALL display submitted checkoff items that are missing or below their configured par count for the last 7 days by default, grouped by date.

#### Scenario: Exceptions grouped by date
- **WHEN** admin opens the Fleet page
- **THEN** the exceptions panel shows daily date sections for the last 7 days

#### Scenario: Compact exceptions panel header
- **WHEN** admin views the Fleet page
- **THEN** the exceptions panel uses a compact "Exceptions" heading without additional explanatory header text

#### Scenario: Last three days expanded
- **WHEN** the exceptions panel renders
- **THEN** the most recent three date sections are expanded by default and older date sections are closed

#### Scenario: Exceptions filtered by date
- **WHEN** admin selects a from/to date range
- **THEN** the exceptions panel shows daily sections only for the selected date range

#### Scenario: Export exceptions CSV
- **WHEN** admin clicks "Export CSV" in the exceptions panel
- **THEN** a CSV downloads with the selected range's date, unit, compartment, item, issue, actual value, and expected value

#### Scenario: Checkbox submitted missing
- **WHEN** a completed compartment checkoff includes a checkbox item saved as missing
- **THEN** the Fleet page exceptions panel lists the unit, compartment, item, and missing issue

#### Scenario: Quantity submitted below par
- **WHEN** a completed compartment checkoff includes a quantity item below its configured par level
- **THEN** the Fleet page exceptions panel lists the unit, compartment, item, submitted quantity, and expected par count
