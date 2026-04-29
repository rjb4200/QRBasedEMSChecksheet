## ADDED Requirements

### Requirement: Users authenticate via Supabase email login
The system SHALL use Supabase email magic-link login for authentication.

#### Scenario: User requests sign-in link
- **WHEN** user enters an email address on the login page
- **THEN** the system sends a Supabase sign-in link to that email address

#### Scenario: User completes email login
- **WHEN** user opens the Supabase sign-in link
- **THEN** the system creates an authenticated session and redirects the user into the app

### Requirement: Crew checkoff access is public
The system SHALL allow crew members to open `/units`, unit dashboards, QR scanner routes, and compartment checkoff forms without logging in.

#### Scenario: Crew opens unit list without login
- **WHEN** an unauthenticated crew member opens `/units`
- **THEN** the unit list loads without redirecting to login

#### Scenario: Crew submits checkoff without login
- **WHEN** an unauthenticated crew member opens a QR checkoff URL and submits a compartment
- **THEN** the compartment data is saved and marked complete without requiring a Supabase session

### Requirement: Sessions persist in cookies
The system SHALL store authenticated Supabase sessions in browser cookies so users remain logged in across browser restarts until the session expires or they sign out.

#### Scenario: User returns after prior login
- **WHEN** user returns to the app with a valid Supabase session cookie
- **THEN** the system treats the user as authenticated without requiring a new login

### Requirement: Role-based access control is enforced
The system SHALL enforce three access levels: User, Supervisor, and Admin.

#### Scenario: User role access
- **WHEN** a user with "User" role logs in
- **THEN** they can sign personnel acknowledgements but cannot access admin features

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

#### Scenario: Unauthenticated user attempts admin access
- **WHEN** a user without a valid session opens an admin route
- **THEN** the system redirects the user to the login page before rendering admin data

### Requirement: User roles are managed by admins
The admin interface SHALL allow creating users, editing full names, and assigning or changing user roles in a `user_roles` table.

#### Scenario: Admin creates user
- **WHEN** admin enters an email address and optional full name
- **THEN** the system creates or updates the Supabase Auth user, confirms the email, creates or updates the profile row, and assigns the `user` role by default

#### Scenario: Admin edits user name
- **WHEN** admin updates a user's full name on the Users page
- **THEN** the profile name is saved and shown in admin user lists and authenticated signatures

#### Scenario: Admin assigns role to user
- **WHEN** admin assigns the "Supervisor" role to a user
- **THEN** the user gains supervisor-level access on next request

### Requirement: Authenticated identity is used for signatures and privileged access
The system SHALL use authenticated identity for admin/supervisor access and personnel sign-off, while routine compartment checkoff completion remains public.

#### Scenario: Signature attributed to user
- **WHEN** an authenticated user signs off after a completed unit checkoff
- **THEN** the signature is recorded with the user's authenticated email identity
