## ADDED Requirements

### Requirement: Admins authenticate via username and password
The system SHALL use a dedicated admin username/password login for admin page access and SHALL store the admin session in a signed HTTP-only cookie.

#### Scenario: Admin submits valid credentials
- **WHEN** admin enters the configured username and password on the login page
- **THEN** the system creates a signed admin session cookie and redirects to the requested admin page

#### Scenario: Admin submits invalid credentials
- **WHEN** admin enters an invalid username or password
- **THEN** the system denies login and does not create an admin session cookie

#### Scenario: Admin password is not stored as plaintext
- **WHEN** the system validates admin credentials
- **THEN** it compares the entered password to a stored hash or server-only environment override, not to a plaintext password value

### Requirement: Crew checkoff access is public
The system SHALL allow crew members to open `/units`, unit dashboards, QR scanner routes, and compartment checkoff forms without logging in.

#### Scenario: Crew opens unit list without login
- **WHEN** an unauthenticated crew member opens `/units`
- **THEN** the unit list loads without redirecting to login

#### Scenario: Crew submits checkoff without login
- **WHEN** an unauthenticated crew member opens a QR checkoff URL and submits a compartment
- **THEN** the compartment data is saved and marked complete without requiring a Supabase session

### Requirement: Admin sessions persist in cookies
The system SHALL store admin sessions in signed HTTP-only browser cookies so admins remain logged in until the session expires or they sign out.

#### Scenario: Admin returns after prior login
- **WHEN** admin returns to the app with a valid admin session cookie
- **THEN** the system allows access to admin routes without requiring a new login

### Requirement: Supervisor role-based access control is enforced
The system SHALL enforce Supabase role-based access for Supervisor routes while admin routes use the dedicated admin session cookie.

#### Scenario: User role access
- **WHEN** a user with "User" role logs in
- **THEN** they cannot access supervisor or admin features

#### Scenario: Supervisor role access
- **WHEN** a user with "Supervisor" role logs in
- **THEN** they can view all units and provider statistics but cannot edit unit configurations

#### Scenario: Admin session access
- **WHEN** a user has a valid admin session cookie
- **THEN** they can manage units, toggle in-service status, edit master layouts, and access admin features

### Requirement: Privileged access is protected
The system SHALL protect admin access with the signed admin session cookie and supervisor access with Supabase role approval in the `user_roles` table.

#### Scenario: User without admin session attempts admin access
- **WHEN** a user without a valid admin session opens an admin route
- **THEN** the system redirects the user to the login page before rendering admin data

#### Scenario: Approved admin accesses admin panel
- **WHEN** a user with a valid admin session opens an admin route
- **THEN** the system allows access to the admin panel

### Requirement: Admin user management page is not exposed
The admin interface SHALL NOT expose a Users management page because admin access is controlled by the configured username/password session.

#### Scenario: Admin navigation excludes users page
- **WHEN** admin views the admin dashboard navigation
- **THEN** no Users link is displayed
