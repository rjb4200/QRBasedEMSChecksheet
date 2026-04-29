## ADDED Requirements

### Requirement: Users authenticate via Supabase email login
The system SHALL use Supabase email magic-link login for authentication.

#### Scenario: User requests sign-in link
- **WHEN** user enters an email address on the login page
- **THEN** the system sends a Supabase sign-in link to that email address

#### Scenario: User completes email login
- **WHEN** user opens the Supabase sign-in link
- **THEN** the system creates an authenticated session and redirects the user into the app

### Requirement: User-side login accepts any email address
The system SHALL allow standard user login from any valid email address.

#### Scenario: Non-department email logs in as user
- **WHEN** a user signs in with a valid non-department email address
- **THEN** the system allows login with standard User access

### Requirement: Sessions persist in cookies
The system SHALL store authenticated Supabase sessions in browser cookies so users remain logged in across browser restarts until the session expires or they sign out.

#### Scenario: User returns after prior login
- **WHEN** user returns to the app with a valid Supabase session cookie
- **THEN** the system treats the user as authenticated without requiring a new login

### Requirement: Role-based access control is enforced
The system SHALL enforce three access levels: User, Supervisor, and Admin.

#### Scenario: User role access
- **WHEN** a user with "User" role logs in
- **THEN** they can select a unit and perform checkoffs but cannot access admin features

#### Scenario: Supervisor role access
- **WHEN** a user with "Supervisor" role logs in
- **THEN** they can view all units and provider statistics but cannot edit unit configurations

#### Scenario: Admin role access
- **WHEN** a user with "Admin" role logs in
- **THEN** they can manage units, toggle in-service status, edit master layouts, and access all features

### Requirement: Admin access is limited to a pre-approved list
The system SHALL limit admin and supervisor access to users explicitly approved in the `user_roles` table.

#### Scenario: Unapproved user attempts admin access
- **WHEN** an authenticated user without Admin role opens an admin route
- **THEN** the system denies access and shows an access denied message

#### Scenario: Approved admin accesses admin panel
- **WHEN** an authenticated user with Admin role opens an admin route
- **THEN** the system allows access to the admin panel

### Requirement: User roles are managed by admins
The admin interface SHALL allow assigning and changing user roles in a `user_roles` table.

#### Scenario: Admin assigns role to user
- **WHEN** admin assigns the "Supervisor" role to a user
- **THEN** the user gains supervisor-level access on next request

### Requirement: Authenticated identity is used for accountability
All checkoff actions SHALL be attributed to the authenticated user's email identity.

#### Scenario: Checkoff attributed to user
- **WHEN** user completes a compartment checkoff
- **THEN** the submission is recorded with the user's authenticated email identity
