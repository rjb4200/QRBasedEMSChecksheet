## Context

The `admin_users` table has RLS enabled but no restrictive policies. Admin user management routes use `createAdminClient()` (service-role) which bypasses RLS entirely. Without explicit session checks at the route boundary, unauthenticated requests can access or modify admin records through these API endpoints.

## Goals / Non-Goals

**Goals:**
- Remove permissive RLS policies from `admin_users` while keeping RLS enabled.
- Restrict `admin_users` to server-side service-role access only.
- Add admin session verification to all admin-users API routes before any database operation.
- Preserve admin login, Admin Users page, and daily report recipient workflows.
- Preserve all public crew-facing behavior unchanged.

**Non-Goals:**
- Do not redesign authentication or admin sessions.
- Do not require crews to log in.
- Do not add complex RBAC.
- Do not change checkoff, QR/NFC, records, or fleet panel behavior.

## Decisions

### Decision 1: Remove permissive RLS, keep RLS enabled

Drop any policies with `USING (true)` or `WITH CHECK (true)` on `admin_users`. Keep RLS enabled so service-role access remains the only access path.

Rationale: The current model already depends on service-role for admin_users operations. Permissive RLS provides no real protection and triggers Supabase advisor warnings.

### Decision 2: Route-level session verification before DB access

Each admin-users API route verifies a valid admin session cookie before executing any Supabase query.

Rationale: Service-role clients bypass RLS, so application-level authorization is the only meaningful protection layer. Reusing the existing `verifyAdminSession` helper keeps the change minimal and consistent with the admin app shell.

### Decision 3: Seed route also protected

The `/api/admin-users/seed` route also requires admin session verification.

Rationale: This route creates admin users with default credentials using service-role access. Leaving it unprotected would create a direct bypass of the hardening effort.

## Risks / Trade-offs

- **Risk**: Route-level checks could break the Admin Users page if session validation fails unexpectedly. -> **Mitigation**: Reuse the same session validation already trusted by the admin layout middleware.
- **Risk**: Removing permissive RLS could reveal other code paths that depend on direct `admin_users` access. -> **Mitigation**: Audit all `admin_users` references before deploying. All current callers already use `createAdminClient`.
- **Risk**: The seed route may have been used as a one-time setup convenience. -> **Mitigation**: Seed route remains available but only to authenticated admins. Bootstrap recovery provides an alternative recovery path if needed.

## Migration Plan

1. Verify admin session checks are in place on all admin-users API routes.
2. Apply migration removing permissive RLS policies on `admin_users`.
3. Run lint/typecheck/build and verify admin workflows.
4. Rollback: restore the removed policies and remove route-level session checks.
