## Requirements

### Requirement: Bootstrap admin recovery login is optional and server-only
The system SHALL support an optional bootstrap admin recovery login path controlled by `BOOTSTRAP_ADMIN_ENABLED`, `BOOTSTRAP_ADMIN_USER`, and `BOOTSTRAP_ADMIN_PASSWORD`, and those values SHALL be read only from server-side environment configuration.

#### Scenario: Bootstrap recovery disabled
- **WHEN** `BOOTSTRAP_ADMIN_ENABLED` is not enabled
- **THEN** the system SHALL reject bootstrap recovery credentials
- **AND** normal admin login behavior SHALL remain unchanged

#### Scenario: Bootstrap recovery enabled
- **WHEN** `BOOTSTRAP_ADMIN_ENABLED` is enabled
- **AND** a user submits the configured bootstrap username and password
- **THEN** the system SHALL accept the bootstrap recovery login

### Requirement: Bootstrap recovery login creates the normal admin session
The system SHALL create the same admin session and cookie used by normal admin login when bootstrap recovery credentials are accepted.

#### Scenario: Bootstrap login succeeds
- **WHEN** bootstrap recovery credentials are accepted
- **THEN** the system SHALL create the standard admin session/cookie
- **AND** the user SHALL be authorized for the admin area the same way as a normal admin login

### Requirement: Bootstrap password is never exposed
The system SHALL NOT log, serialize, return, or otherwise expose the configured bootstrap password to clients.

#### Scenario: Bootstrap login attempt is processed
- **WHEN** the server validates bootstrap recovery credentials
- **THEN** the bootstrap password SHALL remain server-only
- **AND** responses, rendered pages, and logs SHALL NOT include the password value
