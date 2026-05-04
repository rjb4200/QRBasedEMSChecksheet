## Why

Currently, admin authentication uses a hardcoded username (rjb4200) and SHA-256 hashed password stored in the codebase. There is no way to add, update, or manage multiple admin users through the GUI. This limits flexibility for teams and creates a security risk with credentials in code.

## What Changes

- Add admin users table in database to store user credentials
- Create GUI page for managing admin users (add, edit, delete)
- Implement secure password storage using bcrypt hashing
- Enforce strong password requirements (minimum length, complexity)
- Allow password change for existing admin users
- Replace hardcoded credentials with database-backed authentication

## Capabilities

### New Capabilities

- `admin-user-management`: GUI interface for creating, updating, and deleting admin users with secure password handling.
- `secure-password-storage`: Bcrypt password hashing with enforcement of strong password policies.

### Modified Capabilities

- `admin-authentication`: Update existing admin auth to use database users instead of hardcoded credentials.

## Impact

- New database table for admin users
- New admin page for user management
- Updates to authentication logic to check against database
- Password hashing utility (bcrypt)
- Client-side password validation