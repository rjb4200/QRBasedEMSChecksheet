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
