## Requirements

### Requirement: Database storage usage is monitored
The system SHALL monitor current database storage usage via `pg_database_size()` and compute the percentage against a configured storage limit.

#### Scenario: Usage is below warning threshold
- **WHEN** database usage is below 90% of the configured limit
- **THEN** no storage warning banner SHALL be displayed

#### Scenario: Usage reaches warning threshold
- **WHEN** database usage reaches or exceeds 90% of the configured limit but is below 95%
- **THEN** a yellow warning banner SHALL be displayed on the admin Fleet Panel

#### Scenario: Usage reaches critical threshold
- **WHEN** database usage reaches or exceeds 95% of the configured limit
- **THEN** a red critical warning banner SHALL be displayed on the admin Fleet Panel

### Requirement: Storage limit is configurable
The system SHALL support a `DATABASE_STORAGE_LIMIT_MB` environment variable for the database storage limit and SHALL default to 500 MB when not set.

#### Scenario: Limit configured
- **WHEN** `DATABASE_STORAGE_LIMIT_MB` is set to a positive number
- **THEN** the system SHALL use that value as the storage limit

#### Scenario: Limit not configured
- **WHEN** `DATABASE_STORAGE_LIMIT_MB` is not set
- **THEN** the system SHALL default to 500 MB as the storage limit

### Requirement: Storage usage is visible on the System Log page
In addition to the Fleet Panel warning banner, database storage usage SHALL be visible as a read-only display on the System Log page.

#### Scenario: System Log shows storage details
- **WHEN** an admin views the System Log page
- **THEN** the current database storage percentage, MB used/limit, and last-checked time SHALL be displayed

### Requirement: Storage warning is admin-only
The storage warning banner SHALL be visible only to authenticated admin users.

#### Scenario: Non-admin user views the page
- **WHEN** a non-admin user accesses the Fleet Panel
- **THEN** the storage warning banner SHALL NOT be displayed
