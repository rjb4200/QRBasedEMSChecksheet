## REMOVED Requirements

### Requirement: Records page layout includes trend chart and reorganized sections
**Reason**: The requirement combines the retired inaccurate chart with independent Records page layout behavior.
**Migration**: Replace it with the retained Records page layout requirement below.

## ADDED Requirements

### Requirement: Records page layout includes reorganized sections
The Records page SHALL display the filter form, unit cards, record count, exports, and Clear Records section without the retired completion trend chart.

#### Scenario: Records page excludes the retired trend chart
- **WHEN** an admin views the Records page
- **THEN** the page SHALL NOT display the `Last 14 Days Check Completion` chart
- **AND** the filter form SHALL appear after the page header

#### Scenario: "Showing N records" label appears below unit cards
- **WHEN** the Records page displays unit records
- **THEN** the "Showing N unit records for YYYY-MM-DD" label and CSV export links SHALL appear after the unit record cards

#### Scenario: Clear Records section appears at page bottom
- **WHEN** an admin views the Records page
- **THEN** the Clear Records section SHALL appear after the unit records and "Showing N records" label at the bottom of the page

#### Scenario: Existing controls remain functional after chart removal
- **WHEN** an admin views the Records page after the chart is removed
- **THEN** the unit filter, date input, Print Daily Record, Simple CSV, Detailed CSV, and Export Package buttons SHALL continue to function with their existing behavior
