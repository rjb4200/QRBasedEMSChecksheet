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
The admin Fleet page SHALL provide a print action for the current daily check sheets in a compact three-column print layout intended to fit a daily packet on front/back letter pages.

#### Scenario: Print current daily check sheets
- **WHEN** admin clicks "Print Today's Check Sheets" on the Fleet page
- **THEN** the system opens a print-ready document containing all units, compartments, check statuses, and submitted item values for the current daily checkoff

#### Scenario: Current daily check sheets use records-compatible unit availability
- **WHEN** daily check sheets are printed for a date
- **THEN** units created after that date are excluded unless a saved daily unit ledger includes them for that date

#### Scenario: Daily check sheets use compact print layout
- **WHEN** the print-ready daily check sheets render
- **THEN** the document uses a three-column layout with print CSS for letter paper, compact typography, reduced margins, rounded box fragments across page breaks, and crew names when available

#### Scenario: Printed units start on separate pages
- **WHEN** the print-ready daily check sheets render multiple units
- **THEN** each unit starts on its own printed page and does not share that page with another unit

#### Scenario: Printed unit header repeats across pages
- **WHEN** a unit's print-ready daily check sheet extends across multiple printed pages
- **THEN** each printed page for that unit repeats the unit header with title, unit/date, status, crew, generated timestamp, and completion count

#### Scenario: Print page preview remains readable
- **WHEN** admin opens the print page in the browser before printing
- **THEN** the page uses normal card-style formatting instead of exposing print-only table layout artifacts

#### Scenario: Printed exceptions are emphasized
- **WHEN** the print-ready daily check sheets include missing or below-par item exceptions
- **THEN** those exception rows display in red text with a red outline box

#### Scenario: Printed checkbox items omit par label
- **WHEN** the print-ready daily check sheets include checkbox yes/no items
- **THEN** those checkbox rows do not display a par value

### Requirement: Fleet page displays submitted item exceptions by date
The admin Fleet page SHALL display submitted checkoff items that are missing or below their configured par count for the last 7 days by default, grouped by date and by unit within each date.

#### Scenario: Exceptions grouped by date and unit
- **WHEN** admin opens the Fleet page
- **THEN** the exceptions panel SHALL show daily date sections, each containing collapsible unit sections with exception counts

#### Scenario: Last three days expanded
- **WHEN** the exceptions panel renders
- **THEN** the most recent three date sections are expanded by default and older date sections are closed

#### Scenario: Exception rows are compact
- **WHEN** exception items are displayed within a unit section
- **THEN** each item SHALL render as a compact line showing item name, compartment name, and issue
- **AND** the panel SHALL NOT use a wide horizontal table

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

### Requirement: Fleet Panel includes Recent Comments section between print bar and Exceptions
The Fleet Panel SHALL include a collapsed, lazy-loading Recent Comments section positioned after the daily checksheet print bar and before the Exceptions section.

#### Scenario: Fleet Panel layout includes Recent Comments
- **WHEN** the Fleet Panel renders
- **THEN** the Recent Comments section SHALL appear between the print bar and the Exceptions section
- **AND** it SHALL be collapsed by default

#### Scenario: Fleet Panel load speed unaffected
- **WHEN** the Fleet Panel initially loads
- **THEN** no comment data SHALL be fetched from the server
- **AND** the Fleet Panel render performance SHALL not be affected by the Recent Comments feature

### Requirement: Fleet Panel displays storage capacity warning when thresholds are exceeded
The admin Fleet Panel SHALL display a storage capacity warning banner below the fleet matrix when database usage exceeds the configured thresholds.

#### Scenario: Fleet Panel shows warning at 90%
- **WHEN** database usage is at or above 90% of the storage limit
- **THEN** a warning banner SHALL appear below the Fleet Matrix on the Fleet Panel

#### Scenario: Fleet Panel shows critical warning at 95%
- **WHEN** database usage is at or above 95% of the storage limit
- **THEN** a visually distinct critical banner SHALL appear below the Fleet Matrix on the Fleet Panel

#### Scenario: Fleet Panel normal operation
- **WHEN** database usage is below 90%
- **THEN** no storage banner SHALL be displayed on the Fleet Panel

### Requirement: Fleet operations share a visual panel
The Fleet Panel SHALL display the unit card grid and daily checksheet print bar within a shared white rounded panel with a red "Fleet Matrix" label at the top, while the page title "Admin Dashboard" appears outside and above the panel.

#### Scenario: Fleet operations panel renders
- **WHEN** the Fleet Panel loads
- **THEN** the page title "Admin Dashboard" SHALL appear above the panel
- **AND** the unit cards and print bar SHALL appear inside a single shared container with white background
- **AND** the panel SHALL show "Fleet Matrix" as a compact red label at the top
- **AND** unit cards SHALL have visible borders for contrast against the white panel
