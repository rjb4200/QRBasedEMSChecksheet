## Context

The current admin authentication uses a hardcoded username (rjb4200) with a SHA-256 hashed password stored in the Next.js environment variables. This approach doesn't allow for multiple admin users, password changes without code deployment, or user management through the GUI.

## Goals / Non-Goals

**Goals:**
- Store admin users in a database table with bcrypt-hashed passwords
- Create admin GUI page to list, add, edit, and delete admin users
- Allow password change for existing users
- Enforce strong password requirements (minimum 8 characters, mixed case, numbers, special characters)
- Migrate authentication to use database users

**Non-Goals:**
- Role-based access control (all admins have same privileges)
- Password reset via email (manual password change only)
- User activity logging beyond authentication

## Decisions

### 1. Password Storage

**Decision:** Use bcrypt for password hashing with a cost factor of 12.

**Rationale:** bcrypt is industry-standard for password hashing, includes salting, and is resistant to rainbow table attacks. Cost factor 12 provides good security without excessive performance impact.

**Alternative Considered:** Use SHA-256 with salt. Rejected because bcrypt is specifically designed for password storage with built-in salt and configurable work factor.

### 2. Password Requirements

**Decision:** Enforce minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character.

**Rationale:** These requirements align with common security standards and significantly reduce the chance of weak passwords.

### 3. Database Schema

**Decision:** Create `admin_users` table with columns: id, username, password_hash, created_at, updated_at.

**Rationale:** Simple schema that stores what's needed for authentication. The password_hash stores the bcrypt hash, never the plain password.

### 4. Migration Strategy

**Decision:** Add default admin user during migration matching the existing hardcoded credentials.

**Rationale:** Ensures no lockout after deployment. The default user can change their password through the GUI after first login.

## Risks / Trade-offs

- **Migration:** Existing hardcoded credentials must be preserved. Mitigated by seeding initial admin user with same credentials.
- **Password Visibility:** Admin users can see usernames but not passwords (only reset option). Mitigated by never storing or displaying plain passwords.
- **Last Admin Deletion:** Prevent deletion of the last admin user. Mitigated by checking user count before deletion.

## Migration Plan

1. Create admin_users table via Supabase migration
2. Add bcrypt library dependency
3. Create admin user management API routes
4. Build admin user management page
5. Update authentication to check database
6. Seed initial admin user
7. Deploy and test
8. Remove hardcoded credentials from environment

## Open Questions

- Should there be a maximum number of admin users? (Recommend: No hard limit, but practical limit of ~10)
- Should admin usernames be unique? (Recommend: Yes, to prevent confusion)