## ADDED Requirements

### Requirement: Admin-users collection API requires authenticated admin session
The `/api/admin-users` route SHALL require a valid admin session before listing or creating admin users.

#### Scenario: Unauthenticated list request rejected
- **WHEN** a request without a valid admin session calls `GET /api/admin-users`
- **THEN** the system SHALL return 401 Unauthorized
- **AND** no admin-user data SHALL be returned

#### Scenario: Unauthenticated create request rejected
- **WHEN** a request without a valid admin session calls `POST /api/admin-users`
- **THEN** the system SHALL return 401 Unauthorized
- **AND** no admin user SHALL be created

#### Scenario: Authenticated request allowed
- **WHEN** a request with a valid admin session calls the collection endpoint
- **THEN** the system SHALL allow the route to execute its server-side logic

### Requirement: Admin-users item API requires authenticated admin session
The `/api/admin-users/[id]` route SHALL require a valid admin session before updating or deleting an admin user.

#### Scenario: Unauthenticated update rejected
- **WHEN** a request without a valid admin session calls `PUT` or `PATCH /api/admin-users/[id]`
- **THEN** the system SHALL return 401 Unauthorized

#### Scenario: Unauthenticated delete rejected
- **WHEN** a request without a valid admin session calls `DELETE /api/admin-users/[id]`
- **THEN** the system SHALL return 401 Unauthorized

### Requirement: Seed route requires authenticated admin session
The `/api/admin-users/seed` route SHALL require a valid admin session before creating default admin users.

#### Scenario: Unauthenticated seed rejected
- **WHEN** a request without a valid admin session calls `POST /api/admin-users/seed`
- **THEN** the system SHALL return 401 Unauthorized

### Requirement: admin_users table has no permissive RLS policies
The `admin_users` table SHALL have RLS enabled with no policies using `USING (true)` or `WITH CHECK (true)`.

#### Scenario: Permissive policies removed
- **WHEN** the security migration is applied
- **THEN** no `USING (true)` or `WITH CHECK (true)` policies SHALL exist on `admin_users`
- **AND** RLS SHALL remain enabled

### Requirement: Non-regression for admin workflows
Existing admin login, Admin Users page, and daily report recipient behavior SHALL remain unchanged.

#### Scenario: Admin workflows preserved
- **WHEN** an admin with a valid session uses the Admin Users page or daily report settings
- **THEN** all existing functionality SHALL continue to work
