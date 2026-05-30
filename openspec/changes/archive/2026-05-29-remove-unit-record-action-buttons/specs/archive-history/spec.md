## ADDED Requirements

### Requirement: Per-unit action buttons removed from Records page cards
The Records page SHALL NOT display individual "View", "No archive", or "Print" buttons on each unit record card.

#### Scenario: Unit cards show no action buttons
- **WHEN** an admin views the Records page with unit records
- **THEN** each unit record card SHALL display record data without per-unit "View"/"No archive" or "Print" action buttons

#### Scenario: Print Daily Record button remains
- **WHEN** the per-unit buttons are removed
- **THEN** the "Print Daily Record" button in the filter form SHALL continue to print the full daily record for the selected date
