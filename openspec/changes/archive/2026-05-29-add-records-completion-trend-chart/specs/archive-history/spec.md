## ADDED Requirements

### Requirement: Records page layout includes trend chart and reorganized sections
The Records page SHALL display a completion trend chart under the header and SHALL reorganize sections so that the "Showing N records" label appears below unit cards and the Clear Records section appears at the bottom of the page.

#### Scenario: Trend chart placed under header and above filters
- **WHEN** an admin views the Records page
- **THEN** the "Last 14 Days Check Completion" chart SHALL appear after the page header and before the filter form
- **AND** the filter form, Export Package form, and summary cards SHALL appear after the chart

#### Scenario: "Showing N records" label appears below unit cards
- **WHEN** the Records page displays unit records
- **THEN** the "Showing N unit records for YYYY-MM-DD" label and CSV export links SHALL appear after the unit record cards

#### Scenario: Clear Records section appears at page bottom
- **WHEN** an admin views the Records page
- **THEN** the Clear Records section SHALL appear after the unit records and "Showing N records" label at the bottom of the page

#### Scenario: Existing controls remain functional after reorder
- **WHEN** the Records page layout is reorganized
- **THEN** the unit filter, date input, Print Daily Record, Simple CSV, Detailed CSV, and Export Package buttons SHALL all continue to function with their existing behavior
