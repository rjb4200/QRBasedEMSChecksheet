## ADDED Requirements

### Requirement: Readiness summary appears with selected-date unit records
The Records page SHALL display the selected operational date, followed by the readiness-state summary, followed by the selected date's unit record cards.

#### Scenario: Admin views selected-date records
- **WHEN** an admin opens the Records page for a selected operational date
- **THEN** the selected date SHALL appear above the readiness summary
- **AND** the readiness summary SHALL appear above the unit record cards

#### Scenario: Admin filters records to one unit
- **WHEN** an admin applies a unit filter for the selected operational date
- **THEN** the readiness summary and unit record cards SHALL both reflect that selected unit and date
