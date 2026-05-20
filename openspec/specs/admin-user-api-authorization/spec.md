## Requirements

### Requirement: Admin-users collection API requires an authenticated admin session
The `/api/admin-users` route SHALL require a valid admin session before listing or creating admin users.

#### Scenario: Unauthenticated list request
- **WHEN** a request without a valid admin session calls `GET /api/admin-users`
- **THEN** the system SHALL reject the request
- **AND** no admin-user data SHALL be returned

#### Scenario: Unauthenticated create request
- **WHEN** a request without a valid admin session calls `POST /api/admin-users`
- **THEN** the system SHALL reject the request
- **AND** no admin user SHALL be created

#### Scenario: Authenticated collection request
- **WHEN** a request with a valid admin session calls `GET /api/admin-users` or `POST /api/admin-users`
- **THEN** the system SHALL allow the route to execute its server-side admin-user logic

### Requirement: Admin-users item API requires an authenticated admin session
The `/api/admin-users/[id]` route SHALL require a valid admin session before updating or deleting an admin user.

#### Scenario: Unauthenticated item request
- **WHEN** a request without a valid admin session calls `PATCH /api/admin-users/[id]` or `DELETE /api/admin-users/[id]`
- **THEN** the system SHALL reject the request
- **AND** no admin-user record SHALL be changed

#### Scenario: Authenticated item request
- **WHEN** a request with a valid admin session calls `PATCH /api/admin-users/[id]` or `DELETE /api/admin-users/[id]`
- **THEN** the system SHALL allow the route to execute its server-side admin-user logic
