## MODIFIED Requirements

### Requirement: Records page displays a 9-day Daily Check Work Completion trend
The Records page SHALL display a fleet-wide `Daily Check Work Completion` trend for the latest nine operational dates after the page header. The trend SHALL be independent of the Records page unit filter and SHALL appear beside the Shift Average chart on extra-large screens and above it on narrower screens.

#### Scenario: Admin views the Records page on an extra-large screen
- **WHEN** an admin views the Records page on an extra-large screen
- **THEN** the page SHALL display one daily result for each of the latest nine operational dates beside the Shift Average chart
- **AND** the displayed trend SHALL remain fleet-wide when an admin selects a unit filter

#### Scenario: Admin views the Records page on a narrow screen
- **WHEN** an admin views the Records page below the extra-large breakpoint
- **THEN** the Daily Check Work Completion trend SHALL appear above the Shift Average chart
- **AND** both charts SHALL remain usable without compressed labels or bars
