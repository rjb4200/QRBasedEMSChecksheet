## ADDED Requirements

### Requirement: Admin-users API routes enforce session verification
The admin authentication system SHALL enforce verified admin sessions at the admin-users API route boundary before any service-role database access is performed.

#### Scenario: API route blocks unauthenticated access
- **WHEN** a request reaches an admin-users API route without a valid admin session cookie
- **THEN** the route SHALL return 401 before any database operation occurs

#### Scenario: API route allows authenticated access
- **WHEN** a request reaches an admin-users API route with a valid admin session cookie
- **THEN** the route SHALL proceed with its server-side database logic
