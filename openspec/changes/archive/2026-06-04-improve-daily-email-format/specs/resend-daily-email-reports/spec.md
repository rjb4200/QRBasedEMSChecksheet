## MODIFIED Requirements

### Requirement: Daily email report includes general unit comments
The daily email report SHALL include general unit comments from `daily_unit_comments` alongside section comments, grouped by unit.

#### Scenario: General comments appear in email
- **WHEN** a unit has a saved general comment for the report date
- **THEN** the email SHALL display that comment under the unit card labeled as "General"

### Requirement: Daily email report shows exception counts per unit
The daily email report SHALL display per-unit exception counts instead of listing every individual exception item.

#### Scenario: Exception counts replace item lists
- **WHEN** the daily email is generated
- **THEN** each unit card SHALL show the count of exceptions for that unit
- **AND** individual exception item details SHALL NOT appear in the email

### Requirement: Daily email report uses per-unit card layout
The daily email report SHALL format unit status information as per-unit HTML cards with status badges, completion stats, progress bars, and grouped comments.

#### Scenario: Incomplete unit card displays full details
- **WHEN** a unit is not 100% complete
- **THEN** the email SHALL display a full-width card with status badge, checks count, exception count, progress bar, and comments

#### Scenario: Complete unit card is compact
- **WHEN** a unit is 100% complete with no exceptions
- **THEN** the email SHALL display a compact green card with only the unit name and completion indicator
