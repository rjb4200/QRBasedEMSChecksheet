## MODIFIED Requirements

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
