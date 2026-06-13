## MODIFIED Requirements

### Requirement: Status determined by database row check on page load

The system SHALL determine compartment status by checking the `compartment_checks` table when the page loads, without real-time subscriptions. The page-load auto-create of in-progress rows SHALL use atomic save semantics targeting the normalized unique identity `(unit_id, target_type, target_id, shift_date, shift_period)`.

#### Scenario: Page load checks database for status

- **WHEN** user navigates to the unit dashboard
- **THEN** each compartment's status is determined by querying the database

#### Scenario: Page-load auto-create uses normalized atomic save

- **WHEN** a page-load creates an initial in-progress checkoff row
- **THEN** the operation SHALL use atomic save semantics targeting `unit_id,target_type,target_id,shift_date,shift_period`
- **AND** it SHALL NOT use a separate SELECT followed by INSERT
