## Purpose

Define how administrative, crew, and system activity is recorded, retained, and reviewed by admins without exposing secrets or making logs publicly accessible.

## Requirements

### Requirement: System events are recorded in a structured log table
The system SHALL maintain a `system_logs` table recording actor, action, area, target, result, and JSONB detail columns for administrative, operational, and system events.

#### Scenario: Admin changes a unit status
- **WHEN** an admin changes a unit's status via the admin unit edit page
- **THEN** a system log row SHALL be written with actor_type "admin", area "fleet", action "unit.status_changed", target_type "unit", and before/after data

#### Scenario: Daily report is sent
- **WHEN** the daily email cron job successfully sends a report
- **THEN** a system log row SHALL be written with actor_type "system", area "reporting", action "daily_report.sent", and result "success"

#### Scenario: Daily report fails
- **WHEN** the daily email cron job encounters an error
- **THEN** a system log row SHALL be written with actor_type "system", area "reporting", action "daily_report.failed", result "failure", and the error message in the message column

#### Scenario: Crew signatures are locked
- **WHEN** a crew member locks their signatures on the unit page
- **THEN** a system log row SHALL be written with actor_type "crew", area "checkoff", action "crew.locked", and target unit name

### Requirement: Log writes do not expose secrets
The system SHALL NOT write passwords, API keys, cron secrets, authorization headers, or access tokens into any system_logs column.

#### Scenario: Cron job fails with authorization header present
- **WHEN** a cron job with an Authorization header fails
- **THEN** the log row SHALL include the error message but SHALL NOT include the Authorization header value

### Requirement: Log writes are server-side only
All system log inserts SHALL be performed by server-side code using the admin client. Public client-side code SHALL NOT be able to insert arbitrary log rows.

#### Scenario: Client attempts direct insert
- **WHEN** a browser client attempts to call a log insert function directly
- **THEN** the insert SHALL be rejected or unavailable to the client context

### Requirement: System logs are retained for three months
The system SHALL automatically remove `system_logs` rows older than 3 months.

#### Scenario: A log row is older than three months
- **WHEN** the retention cleanup runs
- **THEN** system log rows with `created_at` older than 3 months SHALL be deleted

#### Scenario: A log row is within three months
- **WHEN** the retention cleanup runs
- **THEN** system log rows with `created_at` within the last 3 months SHALL remain available

### Requirement: Admin system log page is filterable and searchable
The admin page at `/admin/system-log` SHALL display log rows with controls to filter by date range, area, result, and free-text search.

#### Scenario: Admin filters by area and result
- **WHEN** an admin selects area "reporting" and result "failure" on the system log page
- **THEN** the page SHALL show only log rows matching both filters

#### Scenario: Admin searches by text
- **WHEN** an admin enters a search term in the free-text field
- **THEN** the page SHALL filter rows where the actor name, target name, action, or message contains the term

### Requirement: Log rows show expandable details
Each log row on the admin system log page SHALL be expandable to reveal message, before_data, after_data, and metadata content.

#### Scenario: Admin expands a log row
- **WHEN** an admin clicks or taps a log row
- **THEN** the row SHALL expand to show detail fields including message and data values

### Requirement: Crew and public users cannot access the system log
The system log page SHALL be accessible only to authenticated admin users.

#### Scenario: Crew user navigates to /admin/system-log
- **WHEN** a non-admin crew user navigates to the system log URL
- **THEN** the system SHALL redirect to the login page or show an access-denied page
