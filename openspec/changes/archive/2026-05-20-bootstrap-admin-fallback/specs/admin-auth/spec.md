## ADDED Requirements

### Requirement: Admin login supports bootstrap recovery credentials
The admin login flow SHALL optionally accept bootstrap recovery credentials when bootstrap recovery is enabled.

#### Scenario: Bootstrap credentials match while enabled
- **WHEN** bootstrap recovery is enabled
- **AND** the submitted admin username and password match the configured bootstrap recovery credentials
- **THEN** the system SHALL treat the login as a successful admin sign-in

#### Scenario: Bootstrap credentials submitted while disabled
- **WHEN** bootstrap recovery is disabled
- **AND** the submitted admin username and password match the configured bootstrap recovery credentials
- **THEN** the system SHALL reject the bootstrap recovery login

### Requirement: Normal admin login remains available
The admin login flow SHALL continue to accept persisted `admin_users` credentials whether or not bootstrap recovery is enabled.

#### Scenario: Persisted admin signs in while bootstrap is enabled
- **WHEN** a persisted admin user submits valid normal admin credentials
- **THEN** the system SHALL accept the login using the existing admin-user authentication path
- **AND** daily report recipient settings and Admin Users page behavior SHALL remain unchanged
