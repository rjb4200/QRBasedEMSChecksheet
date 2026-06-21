## ADDED Requirements

### Requirement: Backup controls are admin-only

Database backup and restore controls SHALL only be available to authorized administrators.

#### Scenario: Non-admin cannot access backup page

- **GIVEN** a signed-in user without admin privileges
- **WHEN** the user opens the backup administration page
- **THEN** access SHALL be denied

#### Scenario: Non-admin cannot trigger backup or restore actions

- **GIVEN** a signed-in user without admin privileges
- **WHEN** the user submits a backup or restore request directly
- **THEN** the request SHALL be rejected

### Requirement: Admin backup page shows backup status

The system SHALL provide an admin backup page that displays the most recent backup status and metadata.

#### Scenario: Admin views last successful backup

- **GIVEN** at least one successful backup has been recorded
- **WHEN** an admin opens the backup page
- **THEN** the page SHALL show the last successful backup timestamp
- **AND** the page SHOULD show backup destination/type, status, file size, checksum, or other available file metadata

#### Scenario: Admin views backup failure

- **GIVEN** the most recent backup attempt failed
- **WHEN** an admin opens the backup page
- **THEN** the page SHALL show the failure status and a safe error summary

### Requirement: Stale backup warning appears after 14 days

The system SHALL warn administrators when there is no recent successful backup.

#### Scenario: No successful backup exists

- **GIVEN** no successful backup has been recorded
- **WHEN** an admin opens the backup page
- **THEN** a prominent warning banner SHALL indicate that no successful backup is available

#### Scenario: Last successful backup is older than 14 days

- **GIVEN** the last successful backup is more than 14 days old
- **WHEN** an admin opens the backup page
- **THEN** a prominent warning banner SHALL indicate that the backup is stale

#### Scenario: Last successful backup is recent

- **GIVEN** the last successful backup is 14 days old or newer
- **WHEN** an admin opens the backup page
- **THEN** the stale-backup warning banner SHALL NOT be shown

### Requirement: Admin can manually create a backup

Authorized administrators SHALL be able to trigger a manual database backup from the admin backup page.

#### Scenario: Admin starts manual backup

- **GIVEN** an authorized admin is on the backup page
- **WHEN** the admin selects "Create Backup Now"
- **THEN** the system SHALL start a server-side backup process
- **AND** database credentials SHALL NOT be exposed to the browser

#### Scenario: Manual backup completes

- **GIVEN** a manual backup process completes successfully
- **WHEN** the backup status is recorded
- **THEN** the backup SHALL be recorded as successful with timestamp and available file metadata

#### Scenario: Manual backup fails

- **GIVEN** a manual backup process fails
- **WHEN** the backup status is recorded
- **THEN** the backup attempt SHALL be recorded as failed with timestamp and a safe error summary

### Requirement: Scripted backup automation is supported

The system SHALL provide a secure way to trigger backups from an external script or server automation.

#### Scenario: Scripted backup request uses valid secret

- **GIVEN** a trusted server has the configured backup automation secret
- **WHEN** it triggers the backup endpoint or command with that secret
- **THEN** the system SHALL start a server-side backup process
- **AND** the attempt SHALL be audited as an automated backup request

#### Scenario: Scripted backup request has missing or invalid secret

- **GIVEN** a request does not include the configured backup automation secret
- **WHEN** it attempts to trigger a backup
- **THEN** the system SHALL reject the request
- **AND** no backup SHALL be created

#### Scenario: Bash automation example is documented

- **GIVEN** an administrator wants scheduled automatic backups
- **WHEN** they review the backup documentation
- **THEN** the documentation SHALL include a bash, curl, or cron-compatible example for triggering a backup

### Requirement: Backup files are stored securely

Backup files SHALL be stored outside the production database and SHALL NOT be publicly accessible.

#### Scenario: Backup file is created

- **GIVEN** a backup completes successfully
- **WHEN** the backup file is stored
- **THEN** it SHALL be stored in a private destination
- **AND** access SHALL require administrator privileges or server-side credentials

#### Scenario: Browser cannot access backup credentials

- **GIVEN** an admin opens the backup page
- **WHEN** page data is sent to the browser
- **THEN** database passwords, service-role keys, backup storage keys, and automation tokens SHALL NOT be included

### Requirement: Restore workflow is guarded by multiple confirmations

Any in-app production restore workflow SHALL require multiple confirmations before a destructive restore can begin.

#### Scenario: Admin begins restore review

- **GIVEN** an authorized admin selects a backup for restore
- **WHEN** the restore review page is shown
- **THEN** the page SHALL show clear warnings that production data may be overwritten
- **AND** the page SHALL identify the selected backup

#### Scenario: Restore requires typed confirmation

- **GIVEN** an authorized admin is reviewing a restore
- **WHEN** the typed confirmation text is missing or incorrect
- **THEN** the restore SHALL NOT proceed

#### Scenario: Restore requires final confirmation

- **GIVEN** the typed confirmation text is correct
- **WHEN** the admin has not completed the final confirmation step
- **THEN** the restore SHALL NOT proceed

#### Scenario: Restore attempt is audited

- **GIVEN** an admin attempts a restore
- **WHEN** the restore request is accepted or rejected
- **THEN** the attempt SHALL be audited with timestamp, actor, selected backup, result, and safe error summary when applicable

### Requirement: Restore documentation prioritizes safe recovery

The system SHALL document a recovery process that prefers restoring to a new or staging project before production restore.

#### Scenario: Admin reviews restore runbook

- **GIVEN** an administrator needs to recover from database corruption
- **WHEN** they read the restore documentation
- **THEN** the documentation SHALL describe restoring to a fresh or staging database first
- **AND** the documentation SHALL describe verification steps before production cutover or production restore