## Purpose
Define the admin authentication session behavior including session creation, duration, validation, and explicit logout.

## Requirements

### Requirement: Admin session persists for 180 days
The admin authentication session SHALL persist for 180 days from creation, after which the browser cookie SHALL expire and the server SHALL reject the HMAC-signed session value.

#### Scenario: Admin signs in
- **WHEN** an admin successfully signs in with valid credentials
- **THEN** the session cookie SHALL be set with a maxAge of 180 days
- **AND** the HMAC session payload SHALL carry a 180-day expiration timestamp

#### Scenario: Admin returns within 180 days
- **WHEN** an admin with a valid session cookie visits the admin area within 180 days of sign-in
- **THEN** the session SHALL be accepted without requiring re-authentication

#### Scenario: Session exceeds 180 days
- **WHEN** an admin visits the admin area more than 180 days after sign-in
- **THEN** the session SHALL be rejected
- **AND** the admin SHALL be redirected to the login page

#### Scenario: Admin explicitly signs out
- **WHEN** an admin clicks Sign Out
- **THEN** the session cookie SHALL be deleted immediately
- **AND** the session SHALL be terminated regardless of remaining duration

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

### Requirement: Admin session enforced at admin-users API boundary
The admin authentication system SHALL enforce verified admin sessions at the admin-users API route boundary before any service-role database access is performed.

#### Scenario: API route blocks unauthenticated access
- **WHEN** a request reaches an admin-users API route without a valid admin session cookie
- **THEN** the route SHALL return 401 before any database operation occurs

#### Scenario: API route allows authenticated access
- **WHEN** a request reaches an admin-users API route with a valid admin session cookie
- **THEN** the route SHALL proceed with its server-side database logic
