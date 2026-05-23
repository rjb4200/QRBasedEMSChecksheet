## Why

The `admin_users` table has RLS enabled but no restrictive policies, and the admin user management API routes use service-role database access without explicit admin session verification. This leaves admin account management vulnerable to unauthenticated requests that can bypass row-level security entirely. Tightening both the database policy layer and the API authorization layer closes these gaps while preserving all existing admin workflows and public crew-facing behavior.

## What Changes

- Remove permissive RLS policies from `admin_users` while keeping RLS enabled.
- Restrict `admin_users` access to server-side service-role code only.
- Add admin session verification to `/api/admin-users` and `/api/admin-users/[id]` routes before any database operation.
- Add admin session verification to `/api/admin-users/seed` route.
- Preserve admin login, Admin Users page, daily report recipient editing, and all public crew workflows.

## Capabilities

### New Capabilities
- `admin-users-api-hardening`: Admin user management API routes require a verified admin session before performing any reads or writes using service-role database access.

### Modified Capabilities
- `admin-auth`: Admin session validation is now enforced at the admin-users API boundary, not only at the admin app shell.

## Impact

- **Database**: Migration to remove permissive `admin_users` RLS policies.
- **API security**: `src/app/api/admin-users/route.ts`, `src/app/api/admin-users/[id]/route.ts`, and `src/app/api/admin-users/seed/route.ts` gain admin session checks.
- **Behavior**: No changes to admin login, Admin Users page, daily report recipients, crew checkoff, QR/NFC, records, or fleet panel.
