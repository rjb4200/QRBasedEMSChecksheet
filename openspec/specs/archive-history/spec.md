## ADDED Requirements

### Requirement: Completed and partial shift data is archived
At each shift reset, all compartment checkoff data (completed and partial) SHALL be stored in a historical archive.

#### Scenario: Completed data archived at shift reset
- **WHEN** the 06:00 shift reset occurs
- **THEN** all Green compartments from the previous daily checkoff are saved to the archive with their data

#### Scenario: Partial data archived at shift reset
- **WHEN** the 06:00 shift reset occurs
- **THEN** all Yellow compartments are saved to the archive with status "partially complete"

### Requirement: Archive is queryable by date range and unit
The admin interface SHALL allow querying archived shift data by date range and unit.

#### Scenario: Query by date range
- **WHEN** admin searches for records from 2026-04-01 to 2026-04-15
- **THEN** all archived shifts in that range are returned

#### Scenario: Query by unit
- **WHEN** admin filters by unit "EC3"
- **THEN** all archived shifts for EC3 are returned

### Requirement: Admin can view daily fleet checkoff records
The admin interface SHALL provide a past checkoff records view that defaults to the last 14 days and displays one expandable row per day.

#### Scenario: Admin opens past checkoff records
- **WHEN** admin opens the records page without filters
- **THEN** the system displays daily fleet summary rows for the last 14 days

#### Scenario: Daily row summarizes fleet completion
- **WHEN** a day has four complete in-service units out of five in-service units
- **THEN** the daily row displays "4/5" as the completion summary

#### Scenario: Daily row uses saved unit ledger
- **WHEN** admin views a historical day
- **THEN** the in-service unit denominator comes from the saved daily unit ledger for that day, not the current units table

#### Scenario: Deleted unit remains in historical records
- **WHEN** a unit is deleted after it appeared in saved daily records
- **THEN** historical records for days when the unit was present still include that unit

#### Scenario: No ledger exists for a historical day
- **WHEN** a day has no saved unit ledger rows
- **THEN** the daily row displays "0/0" and indicates that no unit ledger was saved for that day

#### Scenario: Daily row shows unit status bubbles
- **WHEN** admin views a daily row
- **THEN** the row displays one status-colored bubble for each unit included in the current filter

#### Scenario: Daily row expands to unit details
- **WHEN** admin expands a daily row
- **THEN** the system displays each unit's unit status, compartment count, completed compartments, completion percentage, record status, and archive detail link when available

#### Scenario: Unit-day has no archive
- **WHEN** a unit has no archive row for a date in the selected range
- **THEN** the expanded daily details still include that unit/date and mark it as "No record"

#### Scenario: Admin filters past records
- **WHEN** admin selects a date range or unit filter
- **THEN** the daily summary rows and expanded details update to only include matching unit-day records

### Requirement: Admin can export past checkoff records to CSV
The admin interface SHALL allow exporting the selected past checkoff records to simple or detailed CSV formats.

#### Scenario: Export simple filtered records
- **WHEN** admin clicks "Simple CSV" on the records page
- **THEN** the system downloads a CSV containing each visible unit-day record with date, unit, status, check counts, crew names, crew lock status, completion percentage, and archive ID when available

#### Scenario: Export detailed filtered records
- **WHEN** admin clicks "Detailed CSV" on the records page
- **THEN** the system downloads a CSV containing the selected date range's unit, crew names, compartment, item, submitted value, expected value, check status, item status, and completion timestamp details

#### Scenario: Records completion includes crew lock
- **WHEN** admin views historical Records for a unit-day
- **THEN** locked crew names count as one completed check and unlocked crew names do not count toward 100% completion

### Requirement: Admin can print historical daily check sheets
The admin interface SHALL allow printing the same compact daily check sheet document from historical Records data using the current Records page form values for `date` and `unitId` at the time Print is clicked.

#### Scenario: Print historical daily check sheets
- **WHEN** admin clicks "Print Check Sheets" for a daily record
- **THEN** the system opens a print-ready three-column daily check sheet document for that historical date using the same unit availability rules as Records

#### Scenario: Print uses currently selected date without filtering first
- **WHEN** admin changes the Records page date input
- **AND** clicks Print without first clicking Filter
- **THEN** the print route SHALL receive the currently selected date value
- **AND** the printed header and records SHALL use that selected date

#### Scenario: Print preserves selected unit filter
- **WHEN** admin selects a unit on the Records page and clicks Print
- **THEN** the print route SHALL receive the selected `unitId`
- **AND** the print output SHALL be filtered to that unit

#### Scenario: Historical print excludes future units
- **WHEN** admin prints check sheets for a date before a unit was created and no saved ledger includes that unit for that date
- **THEN** that unit is excluded from the historical printout

#### Scenario: Historical print preserves deleted units
- **WHEN** admin prints check sheets for a date when a now-deleted unit was present
- **THEN** that unit is included in the printout using its preserved unit configuration and records-compatible availability

#### Scenario: Print route defaults only when no date is supplied
- **WHEN** `/admin/archives/print` is opened without a valid `date` query parameter
- **THEN** the print route SHALL default to the current shift date

### Requirement: Archive viewer displays historical shift data
The admin interface SHALL provide an archive viewer that displays historical compartment checkoff data in a readable format.

#### Scenario: View historical shift details
- **WHEN** admin selects an archived shift
- **THEN** all compartment data and timestamps for that shift are displayed

### Requirement: Partial completions are marked in archive
Archived shifts that were not fully completed SHALL be marked as "Partially Complete" with the completion percentage.

#### Scenario: Partial shift marked in archive
- **WHEN** admin views an archived shift with incomplete compartments
- **THEN** the shift is labeled "Partially Complete (18/25 compartments)"

### Requirement: Records page displays section comments alongside unit-level comments
The admin Records page SHALL display historical section comments from compartment and kit checkoffs for the selected date and unit, alongside unit-level comments.

#### Scenario: Section comments shown on Records
- **WHEN** an admin opens the Records page for a date with section comments
- **THEN** each unit record SHALL show its section comments labeled by source name
- **AND** section comments SHALL appear separately from unit-level comments

#### Scenario: Section comments respect date and unit filtering
- **WHEN** an admin changes the Records date or unit filter
- **THEN** section comments SHALL update to reflect only the selected date and unit

### Requirement: Print view includes section comments alongside unit-level comments
The Records print view SHALL include historical section comments from compartment and kit checkoffs in the printed daily record, distinct from unit-level comments.

#### Scenario: Print view shows section comments
- **WHEN** an admin prints Records for a date with section comments
- **THEN** each unit's printed record SHALL show its section comments labeled by source name
- **AND** section comments SHALL appear in the same column as unit-level comments

#### Scenario: Print view preserves existing layout
- **WHEN** the print view renders with section comments
- **THEN** the existing landscape table layout, column structure, and formatting SHALL remain unchanged

## ADDED Requirements

### Requirement: Admin can select a date range and trigger an export package from the Records page
The Records page SHALL provide a date range selector and an "Export Package" button that triggers generation of a downloadable ZIP archive for the selected range.

#### Scenario: Export Package button appears on Records page
- **WHEN** an admin views the Records page
- **THEN** an "Export Package" button SHALL be visible alongside the existing "Simple CSV" and "Detailed CSV" export buttons

#### Scenario: Date range selection for export package
- **WHEN** an admin selects a "from" and "to" date for the export package
- **THEN** the export package SHALL include all records with operational dates between and including the selected from and to dates

#### Scenario: Existing exports remain unchanged
- **WHEN** the export package feature is added
- **THEN** the "Simple CSV" and "Detailed CSV" links SHALL continue to function using the existing single-date filter
- **AND** the "Print Daily Record" button SHALL continue to function using the existing single-date filter
- **AND** the `/admin/exceptions/export` route SHALL remain unchanged

#### Scenario: Export package respects unit filter
- **WHEN** an admin selects a specific unit in the Records page filter and triggers an export package
- **THEN** the export package SHALL use the selected unitId as a filter for the generated CSVs

## ADDED Requirements

### Requirement: Admin can access a Clear Records workflow from the Records page
The Records page SHALL provide a "Clear Records" workflow that allows admins to preview, export, confirm, and clear historical operational records for a selected date range.

#### Scenario: Clear Records interface appears on Records page
- **WHEN** an admin views the Records page
- **THEN** a "Clear Records" section SHALL be visible alongside the existing export buttons
- **AND** SHALL include date range inputs for selecting which records to preview and potentially clear

#### Scenario: Row count preview displayed before any action
- **WHEN** an admin selects a date range and clicks "Preview"
- **THEN** per-table row counts for the operational tables SHALL be displayed
- **AND** the counts SHALL update when the date range changes

#### Scenario: Existing exports remain available
- **WHEN** the Clear Records workflow is added
- **THEN** all existing export options (Simple CSV, Detailed CSV, Export Package, Print Daily Record) SHALL continue to function unchanged

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

## ADDED Requirements

### Requirement: All export formats consolidated into a single Export form row
The Records page SHALL present Simple CSV, Detailed CSV, and Full Package as submit buttons in a single Export form row sharing the same from/to date inputs and unit filter.

#### Scenario: Export form contains all three format buttons
- **WHEN** an admin views the Records page
- **THEN** the Export form SHALL display "Simple CSV", "Detailed CSV", and "Full Package" as submit buttons alongside the from/to date inputs

#### Scenario: Standalone CSV link row is removed
- **WHEN** the export formats are consolidated
- **THEN** the previous standalone "Simple CSV" and "Detailed CSV" link row SHALL no longer appear on the page

#### Scenario: All three buttons use the same date inputs
- **WHEN** an admin enters from and to dates in the Export form
- **THEN** clicking any of the three export buttons SHALL use the same from/to/unitId values

### Requirement: Per-unit action buttons removed from Records page cards
The Records page SHALL NOT display individual "View", "No archive", or "Print" buttons on each unit record card.

#### Scenario: Unit cards show no action buttons
- **WHEN** an admin views the Records page with unit records
- **THEN** each unit record card SHALL display record data without per-unit "View"/"No archive" or "Print" action buttons

#### Scenario: Print Daily Record button remains
- **WHEN** the per-unit buttons are removed
- **THEN** the "Print Daily Record" button in the filter form SHALL continue to print the full daily record for the selected date

## ADDED Requirements

### Requirement: Data deletion section uses danger zone visual treatment
The data deletion section SHALL display a red danger banner header with a warning icon and permanent subtext to clearly distinguish it from other page content.

#### Scenario: Danger banner always visible
- **WHEN** an admin views the Records page
- **THEN** the deletion section SHALL display a red banner with "⚠️ DANGER ZONE — Data Destruction" as its header
- **AND** a subtext SHALL read "These actions permanently delete operational records. Exported records cannot be recovered after deletion."

#### Scenario: Section has distinct red-tinted styling
- **WHEN** the Records page renders
- **THEN** the deletion section SHALL use a red-tinted border and background visually distinct from other white page cards

### Requirement: Terminology uses DELETE instead of Clear
The deletion section SHALL use all-caps "DELETE" terminology instead of "Clear" in all labels, buttons, and status text.

#### Scenario: Labels and buttons use DELETE
- **WHEN** an admin interacts with the deletion section
- **THEN** labels SHALL read "DELETE RECORDS From", "Export and DELETE", and "DELETE another range"
- **AND** all internal references to "clear" SHALL be replaced with "DELETE"

### Requirement: Records page supports staged section rendering
The Records page SHALL preserve existing archive filters, unit cards, summary stats, trend chart, export controls, and Clear Records workflow while allowing those sections to render progressively instead of all at once.

#### Scenario: Existing Records behavior remains after staged rendering
- **WHEN** staged loading is added to the Records page
- **THEN** the unit filter, date input, Print Daily Record, Simple CSV, Detailed CSV, Full Package, and Clear Records workflows SHALL continue to function with their existing behavior
- **AND** unit record cards SHALL display the same data as before

#### Scenario: Selected date and unit filter are preserved
- **WHEN** an admin changes the Records date or unit filter
- **THEN** all staged sections SHALL use the same selected date and unit filter
