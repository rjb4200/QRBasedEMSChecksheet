## ADDED Requirements

### Requirement: Records page displays a 14-day check completion trend chart
The Records page SHALL display a vertical bar chart showing daily check completion percentages for the last 14 rolling days using CSS bars.

#### Scenario: Chart appears under the page header
- **WHEN** an admin views the Records page
- **THEN** a "Last 14 Days Check Completion" chart SHALL be displayed directly under the page title and description
- **AND** the chart SHALL span the content width of the Records page

#### Scenario: Each bar represents one day with the correct data
- **WHEN** the chart renders
- **THEN** 14 bars SHALL be displayed, one for each of the last 14 rolling days
- **AND** each bar's height SHALL be proportional to the completion percentage for that day (checked units / in-service units × 100)
- **AND** each bar SHALL display the date and checked/in-service count below it

#### Scenario: Bars are color-coded by completion percentage
- **WHEN** a day has more than 85% completion
- **THEN** the bar SHALL be green
- **WHEN** a day has 70–85% completion
- **THEN** the bar SHALL be amber
- **WHEN** a day has below 70% completion
- **THEN** the bar SHALL be red
- **WHEN** a day has zero in-service units or no records
- **THEN** the bar SHALL be gray and SHALL display zero count

### Requirement: Trend chart reads existing data without new queries
The trend chart SHALL use the existing `getDailyUnitRecords` function which already returns 14 days of pre-computed daily aggregates.

#### Scenario: No additional database queries
- **WHEN** the Records page loads
- **THEN** the trend chart SHALL derive its data from the same `getDailyUnitRecords` call used by the rest of the page
- **AND** no additional Supabase queries SHALL be made for the chart

### Requirement: Chart is fleet-wide regardless of unit filter
The trend chart SHALL show fleet-wide completion data for all units, unaffected by any unit filter selected on the Records page.

#### Scenario: Unit filter does not change chart
- **WHEN** an admin selects a specific unit in the Records page filter
- **THEN** the trend chart SHALL continue to display fleet-wide completion data for all units
- **AND** the chart SHALL remain unchanged

### Requirement: Chart is a server component with no client-side JavaScript
The trend chart SHALL be rendered entirely on the server using CSS-styled HTML elements with no client-side JavaScript for rendering or interactivity.

#### Scenario: Chart renders without hydration issues
- **WHEN** the Records page loads
- **THEN** the chart SHALL be visible immediately with no layout shift or hydration mismatch
- **AND** bar heights SHALL accurately reflect the completion data

### Requirement: Chart handles edge cases gracefully
The trend chart SHALL handle days with missing data, zero in-service units, or partial records without errors.

#### Scenario: Day has zero in-service units
- **WHEN** a day has zero units in service
- **THEN** the bar SHALL display at zero height with a gray bar
- **AND** the label SHALL show zero count

#### Scenario: Day is missing from the data
- **WHEN** a day within the 14-day range has no records
- **THEN** a bar SHALL still be displayed for that day
- **AND** the bar SHALL show 0% with zero count
