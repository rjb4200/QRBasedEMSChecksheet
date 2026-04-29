## ADDED Requirements

### Requirement: Users authenticate via Google Workspace OAuth
The system SHALL use Google Workspace OAuth for authentication, restricted to @winchesterky.com domain users.

#### Scenario: User logs in with Google
- **WHEN** user visits the app and is not authenticated
- **THEN** they are redirected to Google Workspace login

#### Scenario: Non-domain user is denied access
- **WHEN** a user with a non-@winchesterky.com email attempts to log in
- **THEN** access is denied with an appropriate error message

### Requirement: Secondary OAuth providers are supported
The system SHALL support secondary OAuth login via Apple and Microsoft for part-time staff.

#### Scenario: User logs in with Microsoft
- **WHEN** user selects "Sign in with Microsoft"
- **THEN** they are redirected to Microsoft OAuth login

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

### Requirement: User roles are managed by admins
The admin interface SHALL allow assigning and changing user roles in a `user_roles` table.

#### Scenario: Admin assigns role to user
- **WHEN** admin assigns the "Supervisor" role to a user
- **THEN** the user gains supervisor-level access on next login

### Requirement: Authenticated identity is used for accountability
All checkoff actions SHALL be attributed to the authenticated user's identity.

#### Scenario: Checkoff attributed to user
- **WHEN** user completes a compartment checkoff
- **THEN** the submission is recorded with the user's Google Workspace identity
