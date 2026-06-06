## MODIFIED Requirements

### Requirement: Status determined by database row check on page load

The system SHALL determine compartment status by checking the `compartment_checks` table when the page loads, without real-time subscriptions. The page-load auto-create of in-progress rows SHALL use atomic `.upsert()` with `onConflict`.

#### Scenario: Page load checks database for status

- **WHEN** user navigates to the unit dashboard
- **THEN** each compartment's status is determined by querying the database

#### Scenario: Page-load auto-create uses upsert

- **WHEN** a page-load creates an initial in-progress checkoff row
- **THEN** the operation SHALL use `.upsert()` with `onConflict` targeting the unique index, not a separate SELECT followed by INSERT
